// Validates every skills/*.json against the authoritative ReactiveSkillSchema
// (the same Zod schema the MCP server validates with, imported from its build
// output — kuaiyou-mcp-server must be built first, see the CI skills job).
// Also verifies the generated index contract. schema.json is the public
// projection of that schema and is kept in sync by the CI drift check.
import { readFileSync, readdirSync, existsSync } from "fs";
import { fileURLToPath, pathToFileURL } from "url";
import { dirname, join } from "path";
import { execFileSync } from "child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const repoRoot = join(__dirname, "..");
const skillsDir = join(repoRoot, "skills");

const schemaModulePath = join(
  repoRoot,
  "kuaiyou-mcp-server",
  "build",
  "reactive-skill-schema.mjs"
);
if (!existsSync(schemaModulePath)) {
  console.error(
    "Missing kuaiyou-mcp-server build output. Run `npm ci && npm run build` " +
      "inside kuaiyou-mcp-server/ before validating skills."
  );
  process.exit(1);
}
const { ReactiveSkillSchema } = await import(pathToFileURL(schemaModulePath).href);

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
  const result = ReactiveSkillSchema.safeParse(data);
  if (!result.success) {
    const errors = result.error.issues.map((i) => `${i.path.join(".")}: ${i.message}`);
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
