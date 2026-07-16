import SkillsExplorer from '@/components/SkillsExplorer';
import { getSkills } from '@/lib/skills';

export default function Home() {
  // Loaded at build time so skills are in the static HTML (indexable, no fetch).
  const skills = getSkills();

  // Skill JSON files are published under this basePath on GitHub Pages.
  const skillsBaseUrl = '/kuaiyou-open-source/skills';

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

        <SkillsExplorer skills={skills} baseUrl={skillsBaseUrl} />
      </div>

      
    </main>
  );
}
