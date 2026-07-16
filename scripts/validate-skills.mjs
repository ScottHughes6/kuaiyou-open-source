// Validates every skills/*.json against the repo's exported schema.json and
// verifies the generated index contract. Dependency-free so CI can run it
// without an npm install. Implements just the subset of JSON Schema that
// schema.json uses: type, required, minLength, const.
import { readFileSync, readdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const skillsDir = join(repoRoot, "skills");

const schema = JSON.parse(readFileSync(join(repoRoot, "schema.json"), "utf8"));

function validate(obj, schema, path = "") {
  const errors = [];
  if (schema.type === "object") {
    if (typeof obj !== "object" || obj === null || Array.isArray(obj)) {
      return [`${path || "root"}: expected object`];
    }
    for (const key of schema.required ?? []) {
      if (!(key in obj)) errors.push(`${path}${key}: missing required field`);
    }
    for (const [key, sub] of Object.entries(schema.properties ?? {})) {
      if (key in obj) errors.push(...validate(obj[key], sub, `${path}${key}.`));
    }
  } else if (schema.type === "string") {
    if (typeof obj !== "string") errors.push(`${path.slice(0, -1)}: expected string`);
    else if (schema.minLength && obj.length < schema.minLength) errors.push(`${path.slice(0, -1)}: shorter than ${schema.minLength}`);
    else if (schema.const !== undefined && obj !== schema.const) errors.push(`${path.slice(0, -1)}: must equal ${JSON.stringify(schema.const)}`);
  } else if (schema.type === "array") {
    if (!Array.isArray(obj)) errors.push(`${path.slice(0, -1)}: expected array`);
  }
  return errors;
}

const files = readdirSync(skillsDir).filter((f) => f.endsWith(".json") && f !== "index.json");
let failed = false;
const ids = new Set();

for (const file of files) {
  let data;
  try {
    data = JSON.parse(readFileSync(join(skillsDir, file), "utf8"));
  } catch (e) {
    console.error(`✗ ${file}: invalid JSON — ${e.message}`);
    failed = true;
    continue;
  }
  const errors = validate(data, schema);
  if (errors.length) {
    console.error(`✗ ${file}:\n  ${errors.join("\n  ")}`);
    failed = true;
  } else {
    if (ids.has(data.id)) {
      console.error(`✗ ${file}: duplicate id "${data.id}"`);
      failed = true;
    }
    ids.add(data.id);
    console.log(`✓ ${file}`);
  }
}

// Verify the index contract: generator output must be { skills: [...] } and
// cover exactly the valid skill files consumed by the website.
execFileSync("node", [join(repoRoot, "scripts", "build-skill-index.js")], { stdio: "inherit" });
const index = JSON.parse(readFileSync(join(skillsDir, "index.json"), "utf8"));
if (!Array.isArray(index.skills)) {
  console.error("✗ index.json: expected { skills: [...] } shape");
  failed = true;
} else if (index.skills.length !== ids.size) {
  console.error(`✗ index.json: has ${index.skills.length} entries but ${ids.size} valid skills exist`);
  failed = true;
} else {
  console.log(`✓ index.json contract: ${index.skills.length} skills`);
}

if (failed) {
  process.exit(1);
}
console.log("All skills valid.");
