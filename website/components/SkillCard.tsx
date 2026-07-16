'use client';
import { useState } from 'react';
import type { Skill } from '@/lib/skills';

interface SkillCardProps {
  skill: Skill;
  baseUrl: string;
}

export default function SkillCard({ skill, baseUrl }: SkillCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    // Absolute URL so the copied link is usable outside the current page.
    const jsonLink = new URL(`${baseUrl}/${skill.file}`, window.location.origin).href;
    try {
      await navigator.clipboard.writeText(jsonLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard API can reject (e.g. denied permission); leave state unchanged.
    }
  };

  return (
    <div className="glass-panel skill-card">
      <div className="card-header">
        <h3 className="card-title">{skill.name}</h3>
        <span className="card-badge">{skill.executionMode}</span>
      </div>

      <p className="card-desc">{skill.description}</p>

      <div className="card-footer">
        <div className="card-id code-font">{skill.id}</div>
        <button
          onClick={handleCopy}
          className="copy-btn"
        >
          <span aria-live="polite">{copied ? '✅ Copied!' : '🔗 Copy Link'}</span>
        </button>
      </div>
    </div>
  );
}
