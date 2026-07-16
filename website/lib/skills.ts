import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export interface Skill {
  id: string;
  name: string;
  description: string;
  executionMode: string;
  file: string;
}

const SKILLS_DIR = join(process.cwd(), "public", "skills");

// Read skill metadata at build time so the homepage can be statically rendered
// with content in the HTML (no runtime fetch, no loading flash, indexable).
export function getSkills(): Skill[] {
  const files = readdirSync(SKILLS_DIR).filter(
    (f) => f.endsWith(".json") && f !== "index.json"
  );
  const skills: Skill[] = [];
  for (const file of files) {
    try {
      const data = JSON.parse(readFileSync(join(SKILLS_DIR, file), "utf-8"));
      if (data.id && data.name) {
        skills.push({
          id: data.id,
          name: data.name,
          description: data.description || "",
          executionMode: data.executionMode || "REACTIVE",
          file,
        });
      }
    } catch {
      // Skip unparseable files; the CI skills gate validates them separately.
    }
  }
  return skills.sort((a, b) => a.name.localeCompare(b.name));
}
