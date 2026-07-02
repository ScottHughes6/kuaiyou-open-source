'use client';
import { useEffect, useState } from 'react';
import SkillCard from '@/components/SkillCard';

interface Skill {
  id: string;
  name: string;
  description: string;
  executionMode: string;
  file: string;
  updatedAt: string;
}

export default function Home() {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  
  // Since we are deploying to GitHub pages with basePath
  const basePath = '/kuaiyou-open-source';

  useEffect(() => {
    // Fetch the generated index.json from the GitHub pages root
    fetch(`${basePath}/skills/index.json`)
      .then(res => res.json())
      .then(data => {
        if (data.skills) {
          setSkills(data.skills);
        }
        setLoading(false);
      })
      .catch(err => {
        console.error("Failed to load skills:", err);
        setLoading(false);
      });
  }, []);

  const filteredSkills = skills.filter(skill => 
    skill.name.toLowerCase().includes(search.toLowerCase()) || 
    skill.description.toLowerCase().includes(search.toLowerCase()) ||
    skill.id.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="container animate-fade-in">
      <div className="hero">
        <div className="hero-badge code-font">v2.0.0-beta</div>
        <h1 className="hero-title">
          Building the Next-Gen
          <br />
          <span className="gradient-text">Agentic UI Automation</span>
        </h1>
        <p className="hero-subtitle">
          Kuaiyou Open Source Ecosystem. Powered by MCP Protocol.
          <br />
          Empowering AI Agents to control mobile interfaces with structured JSON skills.
        </p>
      </div>

      <div className="how-it-works glass-panel">
        <div className="section-header">
          <h2>How It Works</h2>
          <p>The bridge between Large Language Models and Android UI</p>
        </div>
        
        <div className="architecture-flow">
          <div className="arch-node">
            <div className="node-icon">🧠</div>
            <div className="node-title">AI Agent</div>
            <div className="node-desc">Claude, Cursor, etc.</div>
          </div>
          
          <div className="arch-arrow">
            <div className="arrow-text code-font">Call Tool</div>
            <div className="arrow-line"></div>
          </div>
          
          <div className="arch-node highlight">
            <div className="node-icon">⚡</div>
            <div className="node-title">Kuaiyou MCP</div>
            <div className="node-desc">Context & Action Server</div>
          </div>
          
          <div className="arch-arrow">
            <div className="arrow-text code-font">Push JSON</div>
            <div className="arrow-line"></div>
          </div>
          
          <div className="arch-node">
            <div className="node-icon">📱</div>
            <div className="node-title">Android Device</div>
            <div className="node-desc">Kuaiyou App Runtime</div>
          </div>
        </div>
      </div>

      <div className="skills-section">
        <div className="section-header">
          <h2>Skills Explorer</h2>
          <p>Discover and deploy community-driven automation skills.</p>
        </div>

        <div className="search-container">
          <input 
            type="text" 
            placeholder="Search skills by name, description or ID..." 
            className="search-input glass-panel code-font"
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="loading code-font">Loading skills index...</div>
        ) : filteredSkills.length > 0 ? (
          <div className="skills-grid">
            {filteredSkills.map(skill => (
              <SkillCard key={skill.id} skill={skill} baseUrl={basePath} />
            ))}
          </div>
        ) : (
          <div className="empty-state glass-panel">
            No skills found matching &quot;{search}&quot;.
          </div>
        )}
      </div>

      
    </main>
  );
}
