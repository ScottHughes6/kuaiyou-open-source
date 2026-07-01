import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { StdioClientTransport } from "@modelcontextprotocol/sdk/client/stdio.js";
import { CallToolRequestSchema } from "@modelcontextprotocol/sdk/types.js";

async function runTests() {
  console.log("Starting MCP Client test...");
  const transport = new StdioClientTransport({
    command: "node",
    args: ["./build/index.js"]
  });

  const client = new Client(
    { name: "test-client", version: "1.0.0" },
    { capabilities: {} }
  );

  await client.connect(transport);
  console.log("Connected to MCP Server!");

  try {
    console.log("\\n--- Testing fetch_screen_nodes ---");
    const result1 = await client.request(
      {
        method: "tools/call",
        params: {
          name: "fetch_screen_nodes",
          arguments: {}
        }
      },
      CallToolRequestSchema
    );
    console.log("Success! Extracted node count:", JSON.parse((result1 as any).content[0].text).length);

    console.log("\\n--- Testing validate_kuaiyou_skill ---");
    const validJson = JSON.stringify({
      id: "test-123",
      name: "Test Skill",
      description: "A test skill",
      executionMode: "REACTIVE",
      termination: { type: "ALL_GOALS_COMPLETED" },
      goals: [],
      agentId: ""
    });
    
    const result2 = await client.request(
      {
        method: "tools/call",
        params: {
          name: "validate_kuaiyou_skill",
          arguments: { skillJson: validJson }
        }
      },
      CallToolRequestSchema
    );
    console.log("Validation Result:", (result2 as any).content[0].text);

    console.log("\\n--- Testing deploy_to_device ---");
    const result3 = await client.request(
      {
        method: "tools/call",
        params: {
          name: "deploy_to_device",
          arguments: { skillId: "test-123", skillJson: validJson }
        }
      },
      CallToolRequestSchema
    );
    console.log("Deploy Result:", (result3 as any).content[0].text);

  } catch (error) {
    console.error("Test failed:", error);
  } finally {
    process.exit(0);
  }
}

runTests();
