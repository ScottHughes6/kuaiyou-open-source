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
import { exec } from "child_process";
import { promisify } from "util";
import * as dotenv from "dotenv";

dotenv.config();

const execAsync = promisify(exec);

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

// HTTP Fallback helper
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 5000) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
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
        const errors: string[] = [];

        if (!parsed.id) errors.push("Missing required field: id");
        if (!parsed.name) errors.push("Missing required field: name");
        if (!parsed.description) errors.push("Missing required field: description");
        if (parsed.executionMode !== "REACTIVE") errors.push("executionMode must be 'REACTIVE'");
        if (!parsed.termination || typeof parsed.termination !== "object") errors.push("Missing or invalid 'termination' object");
        if (!Array.isArray(parsed.goals)) errors.push("Missing or invalid 'goals' array");
        if (parsed.agentId !== "") errors.push("agentId must be an empty string '\"\"' for custom skills");

        if (errors.length > 0) {
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

      const ip = getDeviceIp();
      let logs = "";

      if (ip) {
        logs += `Attempting HTTP POST to http://${ip}:8080/api/mcp/import...\n`;
        try {
          const formData = new URLSearchParams();
          formData.append("postData", skillJson);

          const response = await fetchWithTimeout(`http://${ip}:8080/api/mcp/import`, {
            method: "POST",
            body: formData,
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });

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

      // Fallback to ADB
      logs += `\nFalling back to ADB...\n`;
      try {
        const tempPath = path.join(os.tmpdir(), `${skillId}.json`);
        await fs.writeFile(tempPath, skillJson, "utf8");

        const targetPath = `/sdcard/Android/data/com.kuaiyou.automator.clicker.test/files/${skillId}.json`;
        
        const { stdout: pushOut, stderr: pushErr } = await execAsync(`adb push ${tempPath} ${targetPath}`);
        logs += `[ADB PUSH]\n${pushOut}\n${pushErr}\n`;

        const { stdout: chmodOut, stderr: chmodErr } = await execAsync(`adb shell chmod 666 ${targetPath}`);
        logs += `[ADB CHMOD]\n${chmodOut}\n${chmodErr}\n`;

        const deepLink = `kuaiyou://import_skill?path=${targetPath}`;
        const { stdout: amOut, stderr: amErr } = await execAsync(`adb shell am start -a android.intent.action.VIEW -d "${deepLink}"`);
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
      }
    }

    case "get_ui_tree": {
      const ip = getDeviceIp();
      let logs = "";

      if (ip) {
        logs += `Attempting HTTP GET to http://${ip}:8080/api/mcp/ui_tree...\n`;
        try {
          const response = await fetchWithTimeout(`http://${ip}:8080/api/mcp/ui_tree`);
          if (response.ok) {
            const jsonText = await response.text();
            return {
              content: [{ type: "text", text: jsonText }],
            };
          } else {
            logs += `HTTP response not ok: ${response.status} ${response.statusText}\n`;
          }
        } catch (e: any) {
          logs += `HTTP fetch failed: ${e.message}\n`;
        }
      }

      // Fallback to ADB
      logs += `\nFalling back to ADB uiautomator dump...\n`;
      try {
        // Run dump
        await execAsync(`adb shell uiautomator dump /sdcard/window_dump.xml`);
        
        // Pull dump
        const tempPath = path.join(os.tmpdir(), "window_dump.xml");
        await execAsync(`adb pull /sdcard/window_dump.xml ${tempPath}`);
        
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
      }
    }

    case "capture_screenshot": {
      const ip = getDeviceIp();
      let logs = "";

      if (ip) {
        logs += `Attempting HTTP GET to http://${ip}:8080/api/mcp/screenshot...\n`;
        try {
          const response = await fetchWithTimeout(`http://${ip}:8080/api/mcp/screenshot`);
          if (response.ok) {
            const arrayBuffer = await response.arrayBuffer();
            const buffer = Buffer.from(arrayBuffer);
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
          } else {
            logs += `HTTP response not ok: ${response.status} ${response.statusText}\n`;
          }
        } catch (e: any) {
          logs += `HTTP fetch failed: ${e.message}\n`;
        }
      }

      // Fallback to ADB screencap
      logs += `\nFalling back to ADB screencap...\n`;
      try {
        const { stdout } = await execAsync(`adb shell screencap -p`, { encoding: 'buffer' });
        const base64 = stdout.toString('base64');
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
