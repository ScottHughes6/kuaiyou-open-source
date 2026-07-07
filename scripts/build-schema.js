const { z } = require("zod");
const { zodToJsonSchema } = require("zod-to-json-schema");
const fs = require("fs");
const path = require("path");

const ReactiveSkillSchema = z.object({
  id: z.string().min(1, "Missing required field: id"),
  name: z.string().min(1, "Missing required field: name"),
  description: z.string().min(1, "Missing required field: description"),
  executionMode: z.literal("REACTIVE").optional(),
  agentId: z.literal("").optional(),
  termination: z.object({
    type: z.string()
  }).passthrough(),
  goals: z.array(z.any()),
  pacingPreset: z.string().optional(),
  scanConfig: z.object({}).passthrough().optional()
}).passthrough();

const jsonSchema = zodToJsonSchema(ReactiveSkillSchema, "ReactiveSkill");
fs.writeFileSync(path.join(__dirname, "../schema.json"), JSON.stringify(jsonSchema, null, 2));
console.log("schema.json generated successfully.");
