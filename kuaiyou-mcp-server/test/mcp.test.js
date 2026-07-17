const { test, before, after } = require("node:test");
const assert = require("node:assert/strict");
const { Client } = require("@modelcontextprotocol/sdk/client/index.js");
const { StdioClientTransport } = require("@modelcontextprotocol/sdk/client/stdio.js");
const path = require("node:path");

const SERVER_ENTRY = path.join(__dirname, "..", "build", "index.js");

let client;
let transport;

before(async () => {
  // No KUAIYOU_DEVICE_IP => device calls fall through to ADB, which we never
  // reach in these tests: we only exercise the protocol, validation, and
  // argument-checking layers, all of which run before any device I/O.
  transport = new StdioClientTransport({
    command: "node",
    args: [SERVER_ENTRY],
    env: { ...process.env, KUAIYOU_DEVICE_IP: "" },
  });
  client = new Client({ name: "test-client", version: "1.0.0" }, { capabilities: {} });
  await client.connect(transport);
});

after(async () => {
  await client?.close();
});

test("tools/list exposes the four expected tools", async () => {
  const { tools } = await client.listTools();
  const names = tools.map((t) => t.name).sort();
  assert.deepEqual(names, [
    "capture_screenshot",
    "get_ui_tree",
    "push_reactive_skill",
    "validate_kuaiyou_skill",
  ]);
});

test("validate_kuaiyou_skill accepts a valid skill", async () => {
  const skillJson = JSON.stringify({
    id: "test-123",
    name: "Test Skill",
    description: "A test skill",
    agentId: "agent_life",
    termination: { type: "allGoalsDone" },
    goals: [
      {
        id: "g1",
        name: "Goal 1",
        priority: 5,
        trigger: { type: "immediate" },
        actions: [{ type: "notify", message: "hello", speakVoice: false }],
        constraints: {
          maxExecutions: 1,
          cooldownMs: 0,
          continueOnFailure: false,
          enabled: true,
        },
      },
    ],
  });
  const res = await client.callTool({
    name: "validate_kuaiyou_skill",
    arguments: { skillJson },
  });
  assert.notEqual(res.isError, true);
  assert.match(res.content[0].text, /Validation successful/);
});

test("validate_kuaiyou_skill reports field-level errors for missing fields", async () => {
  const skillJson = JSON.stringify({ id: "x" }); // valid JSON, missing required fields
  const res = await client.callTool({
    name: "validate_kuaiyou_skill",
    arguments: { skillJson },
  });
  assert.equal(res.isError, true);
  // Regression guard for the zod v4 issues[] fix: must not surface as
  // "Invalid JSON format", and must name the missing fields.
  assert.match(res.content[0].text, /Validation failed with errors/);
  assert.match(res.content[0].text, /name/);
  assert.doesNotMatch(res.content[0].text, /Invalid JSON format/);
});

test("validate_kuaiyou_skill rejects malformed JSON", async () => {
  const res = await client.callTool({
    name: "validate_kuaiyou_skill",
    arguments: { skillJson: "{ not json" },
  });
  assert.equal(res.isError, true);
  assert.match(res.content[0].text, /Invalid JSON format/);
});

test("push_reactive_skill rejects a skillId with a shell metacharacter", async () => {
  await assert.rejects(
    client.callTool({
      name: "push_reactive_skill",
      arguments: { skillId: "a; id", skillJson: "{}" },
    }),
    /skillId must match/
  );
});

test("push_reactive_skill rejects a skillId with path traversal", async () => {
  await assert.rejects(
    client.callTool({
      name: "push_reactive_skill",
      arguments: { skillId: "../evil", skillJson: "{}" },
    }),
    /skillId must match/
  );
});

test("push_reactive_skill rejects missing arguments", async () => {
  await assert.rejects(
    client.callTool({
      name: "push_reactive_skill",
      arguments: { skillId: "only-id" },
    }),
    /required/
  );
});

test("unknown tool returns a method-not-found error", async () => {
  await assert.rejects(
    client.callTool({ name: "does_not_exist", arguments: {} }),
    /Unknown tool/
  );
});
