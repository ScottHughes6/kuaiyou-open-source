import { z } from "zod";

export const ReactiveSkillSchema = z.object({
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
