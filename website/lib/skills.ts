import { readdirSync, readFileSync } from "fs";
import { join } from "path";

export type SkillCategory = "examples" | "compatibility-tests";

export interface Skill {
  id: string;
  name: string;
  description: string;
  /** Skill-level execution mode summary derived from goals. */
  executionMode: string;
  file: string;
  category: SkillCategory;
  /** Heuristic language for a11y/lang attributes. */
  language: "zh" | "en" | "mixed";
}

// Prefer the repo-root skills/ directory (canonical source). Fall back to
// website/public/skills for environments where only the website package is present.
const CANDIDATE_DIRS = [
  join(process.cwd(), "..", "skills"),
  join(process.cwd(), "public", "skills"),
];

function resolveSkillsDir(): string {
  for (const dir of CANDIDATE_DIRS) {
    try {
      readdirSync(dir);
      return dir;
    } catch {
      // try next
    }
  }
  throw new Error(
    "No skills directory found. Expected ../skills or public/skills relative to the website package."
  );
}

function extractExecutionMode(data: {
  executionMode?: string;
  goals?: Array<{ constraints?: { executionMode?: string } }>;
}): string {
  const modes = new Set<string>();

  if (data.executionMode) {
    modes.add(String(data.executionMode).toUpperCase());
  }

  for (const goal of data.goals || []) {
    const mode = goal?.constraints?.executionMode;
    if (mode) modes.add(String(mode).toUpperCase());
  }

  if (modes.size === 0) return "DEFAULT";
  if (modes.size === 1) return Array.from(modes)[0];
  return "MIXED";
}

function classifySkill(file: string, id: string, name: string): SkillCategory {
  const haystack = `${file} ${id} ${name}`.toLowerCase();
  if (
    haystack.includes("test_") ||
    haystack.includes("_test") ||
    haystack.includes("验证") ||
    haystack.includes("测试")
  ) {
    return "compatibility-tests";
  }
  return "examples";
}

function detectLanguage(text: string): "zh" | "en" | "mixed" {
  const hasZh = /[一-鿿]/.test(text);
  const hasEn = /[A-Za-z]{3,}/.test(text);
  if (hasZh && hasEn) return "mixed";
  if (hasZh) return "zh";
  return "en";
}

// Read skill metadata at build time so the homepage can be statically rendered
// with content in the HTML (no runtime fetch, no loading flash, indexable).
export function getSkills(): Skill[] {
  const skillsDir = resolveSkillsDir();
  const files = readdirSync(skillsDir).filter(
    (f) => f.endsWith(".json") && f !== "index.json"
  );
  const skills: Skill[] = [];

  for (const file of files) {
    try {
      const data = JSON.parse(readFileSync(join(skillsDir, file), "utf-8"));
      if (data.id && data.name) {
        const description = data.description || "";
        skills.push({
          id: data.id,
          name: data.name,
          description,
          executionMode: extractExecutionMode(data),
          file,
          category: classifySkill(file, data.id, data.name),
          language: detectLanguage(`${data.name} ${description}`),
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.warn(`[getSkills] skipped ${file}: ${message}`);
    }
  }

  return skills.sort((a, b) => {
    if (a.category !== b.category) {
      return a.category === "examples" ? -1 : 1;
    }
    return a.name.localeCompare(b.name, "zh-CN");
  });
}
