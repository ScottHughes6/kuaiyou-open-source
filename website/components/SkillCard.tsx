'use client';
import React, { useState } from 'react';

interface Skill {
  id: string;
  name: string;
  description: string;
  executionMode: string;
  file: string;
  updatedAt: string;
}

interface SkillCardProps {
  skill: Skill;
  baseUrl: string;
}

export default function SkillCard({ skill, baseUrl }: SkillCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const jsonLink = `${baseUrl}/${skill.file}`;
    navigator.clipboard.writeText(jsonLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          aria-label="Copy skill link"
        >
          {copied ? '✅ Copied!' : '🔗 Copy Link'}
        </button>
      </div>

      
    </div>
  );
}
