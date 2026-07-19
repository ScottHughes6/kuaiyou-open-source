import HomePage from "@/components/HomePage";
import { getSkills } from "@/lib/skills";

export default function Home() {
  // Loaded at build time so skills are in the static HTML (indexable, no fetch).
  const skills = getSkills();
  return <HomePage skills={skills} />;
}
