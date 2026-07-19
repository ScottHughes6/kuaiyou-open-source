#!/usr/bin/env node
/**
 * Sync root skills/*.json into website/public/skills before Next build/dev.
 * Keeps the homepage catalog and the published JSON files on the same source.
 */
import { cpSync, existsSync, mkdirSync, readdirSync, rmSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const websiteRoot = join(__dirname, "..");
const repoRoot = join(websiteRoot, "..");
const sourceDir = join(repoRoot, "skills");
const targetDir = join(websiteRoot, "public", "skills");

if (!existsSync(sourceDir)) {
  console.error(`[sync-skills] source not found: ${sourceDir}`);
  process.exit(1);
}

mkdirSync(targetDir, { recursive: true });

for (const name of readdirSync(targetDir)) {
  if (name.endsWith(".json")) {
    rmSync(join(targetDir, name), { force: true });
  }
}

const files = readdirSync(sourceDir).filter((f) => f.endsWith(".json"));
for (const file of files) {
  cpSync(join(sourceDir, file), join(targetDir, file));
}

console.log(
  `[sync-skills] synced ${files.length} skill JSON file(s) → public/skills`
);
