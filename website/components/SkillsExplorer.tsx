'use client';
import { useMemo, useState } from 'react';
import SkillCard from '@/components/SkillCard';
import type { Skill } from '@/lib/skills';

interface SkillsExplorerProps {
  skills: Skill[];
  baseUrl: string;
}

export default function SkillsExplorer({ skills, baseUrl }: SkillsExplorerProps) {
  const [search, setSearch] = useState('');

  const filteredSkills = useMemo(() => {
    const q = search.toLowerCase();
    return skills.filter(
      (skill) =>
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.id.toLowerCase().includes(q)
    );
  }, [skills, search]);

  return (
    <>
      <div className="search-container">
        <label htmlFor="skill-search" className="sr-only">
          Search skills by name, description or ID
        </label>
        <input
          id="skill-search"
          type="text"
          placeholder="Search skills by name, description or ID..."
          className="search-input glass-panel code-font"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filteredSkills.length > 0 ? (
        <div className="skills-grid">
          {filteredSkills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} baseUrl={baseUrl} />
          ))}
        </div>
      ) : (
        <div className="empty-state glass-panel" role="status">
          No skills found matching &quot;{search}&quot;.
        </div>
      )}
    </>
  );
}
