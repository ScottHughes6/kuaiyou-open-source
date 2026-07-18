import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
  ErrorCode,
  McpError,
} from "@modelcontextprotocol/sdk/types.js";
import { XMLParser } from "fast-xml-parser";
import * as fs from "fs/promises";
import * as os from "os";
import * as path from "path";
import * as dotenv from "dotenv";
import crypto from "crypto";
import { ReactiveSkillSchema } from "./reactive-skill-schema.js";
import {
  runAdb,
  captureScreencap,
  httpGetText,
  httpGetBuffer,
  httpPostForm,
  withDeviceLock,
} from "./device.js";

dotenv.config();

// skillId is interpolated into a device-side file path, so restrict it to a
// conservative charset. This blocks path traversal (../) and shell metacharacters
// even though device calls no longer go through a shell.
const SKILL_ID_PATTERN = /^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$/;

const server = new Server(
  {
    name: "kuaiyou-mcp-server",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Helper for IP
const getDeviceIp = () => process.env.KUAIYOU_DEVICE_IP;
const getDeviceBaseUrl = (ip: string) => {
  return /:\d+$/.test(ip) ? `http://${ip}` : `http://${ip}:8080`;
};
const getPackageName = () => process.env.KUAIYOU_PACKAGE_NAME || "com.kuaiyou.automator.clicker";

server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "validate_kuaiyou_skill",
        description: "Validate a JSON string or file path against the Kuaiyou ReactiveSkill schema.",
        inputSchema: {
          type: "object",
          properties: {
            skillJson: {
              type: "string",
              description: "The JSON content or absolute file path to the JSON file to validate.",
            },
          },
          required: ["skillJson"],
        },
      },
      {
        name: "push_reactive_skill",
        description: "Deploy a ReactiveSkill JSON to a connected Android device via HTTP LAN direct connection (fallback to ADB).",
        inputSchema: {
          type: "object",
          properties: {
            skillId: {
              type: "string",
              description: "The ID of the skill.",
            },
            skillJson: {
              type: "string",
              description: "The JSON content to deploy.",
            },
          },
          required: ["skillId", "skillJson"],
        },
      },
      {
        name: "get_ui_tree",
        description: "Fetch the current UI node tree from the connected Android device via HTTP (fallback to ADB uiautomator).",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
      {
        name: "capture_screenshot",
        description: "Fetch the current screen screenshot from the connected Android device via HTTP (fallback to ADB screencap).",
        inputSchema: {
          type: "object",
          properties: {},
        },
      }
    ],
  };
});

function parseBoundsStr(boundsStr: string) {
  const match = boundsStr.match(/\[(-?\d+),(-?\d+)\]\[(-?\d+),(-?\d+)\]/);
  if (match) {
    const left = parseInt(match[1], 10);
    const top = parseInt(match[2], 10);
    const right = parseInt(match[3], 10);
    const bottom = parseInt(match[4], 10);
    return {
      left,
      top,
      right,
      bottom,
      width: right - left,
      height: bottom - top,
      centerX: Math.floor((left + right) / 2),
      centerY: Math.floor((top + bottom) / 2)
    };
  }
  return boundsStr;
}

function enhanceUiNodes(data: any): any {
  if (Array.isArray(data)) {
    return data.map(enhanceUiNodes);
  } else if (data !== null && typeof data === 'object') {
    const newData: any = {};
    for (const key in data) {
      if (key === 'bounds' && typeof data[key] === 'string') {
        newData[key] = parseBoundsStr(data[key]);
      } else {
        newData[key] = enhanceUiNodes(data[key]);
      }
    }
    return newData;
  }
  return data;
}

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  switch (request.params.name) {
    case "validate_kuaiyou_skill": {
      const { skillJson } = request.params.arguments as any;
      if (!skillJson) {
        throw new McpError(ErrorCode.InvalidParams, "skillJson is required");
      }

      let content = skillJson;
      try {
        const stat = await fs.stat(skillJson);
        if (stat.isFile()) {
          content = await fs.readFile(skillJson, "utf8");
        }
      } catch (e) {
        // Assume it's a JSON string if file stat fails
      }

      try {
        const parsed = JSON.parse(content);

        // 强拦截 askAgent：遍历所有 actions
        let hasAskAgent = false;
        const checkAction = (obj: any) => {
          if (!obj || typeof obj !== "object") return;
          if (obj.type === "askAgent") hasAskAgent = true;
          Object.values(obj).forEach(checkAction);
        };
        checkAction(parsed);

        if (hasAskAgent) {
           return {
             content: [{ type: "text", text: "Validation failed: 'askAgent' action is strictly prohibited and not supported for local execution." }],
             isError: true,
           };
        }

        const result = ReactiveSkillSchema.safeParse(parsed);
        
        if (!result.success) {
          const errors = result.error.issues.map(issue => `${issue.path.join('.')}: ${issue.message}`);
          return {
            content: [{ type: "text", text: "Validation failed with errors:\n" + errors.join("\n") }],
            isError: true,
          };
        }

        return {
          content: [{ type: "text", text: "Validation successful! The JSON is a valid Kuaiyou ReactiveSkill." }],
        };
      } catch (e: any) {
        return {
          content: [{ type: "text", text: `Invalid JSON format: ${e.message}` }],
          isError: true,
        };
      }
    }

    case "push_reactive_skill": {
      const { skillId, skillJson } = request.params.arguments as any;
      if (!skillId || !skillJson) {
        throw new McpError(ErrorCode.InvalidParams, "skillId and skillJson are required");
      }
      if (typeof skillId !== "string" || !SKILL_ID_PATTERN.test(skillId)) {
        throw new McpError(
          ErrorCode.InvalidParams,
          "skillId must match ^[A-Za-z0-9][A-Za-z0-9._-]{0,127}$ (no path separators or shell metacharacters)"
        );
      }

      let processedJson = skillJson;
      try {
        const obj = JSON.parse(skillJson);
        if (typeof obj === "object" && obj !== null) {
          // 在架构方案 A 下，外部完全不知道 agentId 的存在，
          // 这里不再向客户端下发 agentId，由客户端在网关层自己兜底赋值为 ""
          delete obj.agentId; 
          processedJson = JSON.stringify(obj, null, 2);
        }
      } catch (e) {
        // Ignore parse error, let the server handle invalid JSON
      }

      const ip = getDeviceIp();
      let logs = "";

      if (ip) {
        const baseUrl = getDeviceBaseUrl(ip);
        logs += `Attempting HTTP POST to ${baseUrl}/api/mcp/import...\n`;
        try {
          const formData = new URLSearchParams();
          formData.append("postData", processedJson);

          const response = await httpPostForm(`${baseUrl}/api/mcp/import`, formData);

          if (response.ok) {
            logs += `HTTP push successful!\n`;
            return {
              content: [{ type: "text", text: `Successfully deployed skill ${skillId} via HTTP!\n\nLogs:\n${logs}` }],
            };
          } else {
            logs += `HTTP response not ok: ${response.status} ${response.statusText}\n`;
          }
        } catch (e: any) {
          logs += `HTTP push failed: ${e.message}\n`;
        }
      }

      // Fallback to ADB. Serialize device-mutating work so concurrent pushes
      // don't interleave against the same device.
      logs += `\nFalling back to ADB...\n`;
      return withDeviceLock(async () => {
        let tempDir: string | undefined;
        try {
          tempDir = await fs.mkdtemp(path.join(os.tmpdir(), "kuaiyou-"));
          const tempPath = path.join(tempDir, `${crypto.randomUUID()}.json`);
          await fs.writeFile(tempPath, processedJson, "utf8");

          const packageName = getPackageName();
          const targetPath = `/sdcard/Android/data/${packageName}/files/${skillId}.json`;

          const { stdout: pushOut, stderr: pushErr } = await runAdb(["push", tempPath, targetPath]);
          logs += `[ADB PUSH]\n${pushOut}\n${pushErr}\n`;

          const { stdout: chmodOut, stderr: chmodErr } = await runAdb(["shell", "chmod", "666", targetPath]);
          logs += `[ADB CHMOD]\n${chmodOut}\n${chmodErr}\n`;

          const deepLink = `kuaiyou://import_skill?path=${targetPath}`;
          const { stdout: amOut, stderr: amErr } = await runAdb([
            "shell", "am", "start", "-a", "android.intent.action.VIEW", "-d", deepLink,
          ]);
          logs += `[ADB AM START]\n${amOut}\n${amErr}\n`;

          return {
            content: [{ type: "text", text: `Successfully deployed skill ${skillId} to device via ADB!\n\nLogs:\n${logs}` }],
          };
        } catch (e: any) {
          logs += `ADB deploy failed: ${e.message}\n`;
          return {
            content: [{ type: "text", text: `Failed to deploy to device.\nMake sure you have enabled "LAN MCP service" in the App (if using IP) or connected via USB (if using ADB).\n\nLogs:\n${logs}` }],
            isError: true,
          };
        } finally {
          if (tempDir) {
            await fs.rm(tempDir, { recursive: true, force: true }).catch(() => {});
          }
        }
      });
    }

    case "get_ui_tree": {
      const ip = getDeviceIp();
      let logs = "";

      if (ip) {
        const baseUrl = getDeviceBaseUrl(ip);
        logs += `Attempting HTTP GET to ${baseUrl}/api/mcp/ui_tree...\n`;
        try {
          const jsonText = await httpGetText(`${baseUrl}/api/mcp/ui_tree`);
          try {
            const parsedJson = JSON.parse(jsonText);
            const enhancedJson = enhanceUiNodes(parsedJson);
            return {
              content: [{ type: "text", text: JSON.stringify(enhancedJson, null, 2) }],
            };
          } catch (e) {
            return {
              content: [{ type: "text", text: jsonText }],
            };
          }
        } catch (e: any) {
          logs += `HTTP fetch failed: ${e.message}\n`;
        }
      }

      // Fallback to ADB
      logs += `\nFalling back to ADB uiautomator dump...\n`;
      const dumpFilename = `window_dump_${crypto.randomUUID()}.xml`;
      const devicePath = `/sdcard/${dumpFilename}`;
      const tempPath = path.join(os.tmpdir(), dumpFilename);

      try {
        // Run dump
        await runAdb(["shell", "uiautomator", "dump", devicePath]);

        // Pull dump
        await runAdb(["pull", devicePath, tempPath]);

        const xmlData = await fs.readFile(tempPath, "utf8");

        const parser = new XMLParser({
          ignoreAttributes: false,
          attributeNamePrefix: "@_"
        });
        const jsonObj = parser.parse(xmlData);
        
        const nodes: any[] = [];

        function traverse(node: any) {
          if (!node) return;
          
          if (Array.isArray(node)) {
            node.forEach(traverse);
            return;
          }

          if (node["@_clickable"] === "true" || node["@_text"] || node["@_content-desc"]) {
            const nodeInfo: any = {};
            if (node["@_class"]) nodeInfo.class = node["@_class"];
            if (node["@_text"]) nodeInfo.text = node["@_text"];
            if (node["@_content-desc"]) nodeInfo["content-desc"] = node["@_content-desc"];
            if (node["@_bounds"]) nodeInfo.bounds = node["@_bounds"];
            if (node["@_clickable"]) nodeInfo.clickable = node["@_clickable"] === "true";
            
            // Only add nodes that have actual geometry or text
            if (Object.keys(nodeInfo).length > 0 && nodeInfo.bounds) {
              if (typeof nodeInfo.bounds === 'string') {
                nodeInfo.bounds = parseBoundsStr(nodeInfo.bounds);
              }
              nodes.push(nodeInfo);
            }
          }

          if (node.node) {
            traverse(node.node);
          }
        }

        if (jsonObj.hierarchy) {
          traverse(jsonObj.hierarchy);
        }

        return {
          content: [{ type: "text", text: JSON.stringify(nodes, null, 2) }],
        };
      } catch (e: any) {
        logs += `ADB fetch failed: ${e.message}\n`;
        return {
          content: [{ type: "text", text: `Failed to fetch screen nodes.\nMake sure you have enabled "LAN MCP service" in the App (if using IP) or connected via USB (if using ADB).\n\nLogs:\n${logs}` }],
          isError: true,
        };
      } finally {
        // Clean up device-side and local temp files on both success and failure.
        await runAdb(["shell", "rm", devicePath]).catch(() => {});
        await fs.unlink(tempPath).catch(() => {});
      }
    }

    case "capture_screenshot": {
      const ip = getDeviceIp();
      let logs = "";

      if (ip) {
        const baseUrl = getDeviceBaseUrl(ip);
        logs += `Attempting HTTP GET to ${baseUrl}/api/mcp/screenshot...\n`;
        try {
          const buffer = await httpGetBuffer(`${baseUrl}/api/mcp/screenshot`);
          const base64 = buffer.toString('base64');
          return {
            content: [
              {
                type: "image",
                data: base64,
                mimeType: "image/jpeg"
              }
            ],
          };
        } catch (e: any) {
          logs += `HTTP fetch failed: ${e.message}\n`;
        }
      }

      // Fallback to ADB screencap
      logs += `\nFalling back to ADB screencap...\n`;
      try {
        const buffer = await captureScreencap();
        const base64 = buffer.toString('base64');
        return {
          content: [
            {
              type: "image",
              data: base64,
              mimeType: "image/png"
            }
          ],
        };
      } catch (e: any) {
        logs += `ADB screencap failed: ${e.message}\n`;
        return {
          content: [{ type: "text", text: `Failed to capture screenshot.\nMake sure you have enabled "LAN MCP service" in the App (if using IP) or connected via USB (if using ADB).\n\nLogs:\n${logs}` }],
          isError: true,
        };
      }
    }

    default:
      throw new McpError(ErrorCode.MethodNotFound, `Unknown tool: ${request.params.name}`);
  }
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Kuaiyou MCP server running on stdio");
}

run().catch((error) => {
  console.error("Fatal error running server:", error);
  process.exit(1);
});
