import { z } from "zod";
import { writeFileSync } from "fs";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { ReactiveSkillSchema } from "../build/reactive-skill-schema.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));

const jsonSchema = z.toJSONSchema(ReactiveSkillSchema);

const required = jsonSchema.required ?? [];
const properties = Object.keys(jsonSchema.properties ?? {});
if (required.length === 0 || properties.length === 0) {
  console.error("Refusing to write schema.json: generated schema is empty.");
  process.exit(1);
}

const outPath = join(__dirname, "../../schema.json");
writeFileSync(outPath, JSON.stringify(jsonSchema, null, 2) + "\n");
console.log(`schema.json generated with ${properties.length} properties, ${required.length} required.`);
