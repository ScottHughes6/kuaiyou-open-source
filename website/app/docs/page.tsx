'use client';

export default function DocsPage() {
  return (
    <main className="docs-container animate-fade-in">
      <div className="docs-sidebar glass-panel">
        <ul className="docs-nav">
          <li><a href="#introduction" className="active">Introduction</a></li>
          <li><a href="#quick-start">Quick Start</a></li>
          <li><a href="#write-skill">Write your first Skill</a></li>
          <li><a href="#mcp-tools">MCP Tools Reference</a></li>
        </ul>
      </div>
      
      <div className="docs-content glass-panel">
        <section id="introduction">
          <h1>Kuaiyou MCP Ecosystem</h1>
          <p>
            Welcome to the open-source developer documentation for Kuaiyou Master. 
            This ecosystem connects Large Language Models (LLMs) to native Android automation using the 
            <strong> Model Context Protocol (MCP)</strong>.
          </p>
          <div className="alert info">
            <strong>Note:</strong> This open-source repository contains the MCP Server and the community Skills Index. 
            The Kuaiyou Master Android App runtime is closed-source.
          </div>
        </section>

        <section id="quick-start">
          <h2>Quick Start</h2>
          <p>To start controlling your phone from Claude or Cursor, you need to run the Kuaiyou MCP Server locally.</p>
          
          <h3>1. Prerequisites</h3>
          <ul>
            <li>Node.js (v18 or higher)</li>
            <li>Kuaiyou Master App installed on an Android device</li>
            <li>ADB installed and the device connected via USB/WiFi</li>
          </ul>

          <h3>2. Start the Server</h3>
          <pre className="code-block code-font"><code>npx @kuaiyou/mcp-server --adb</code></pre>

          <h3>3. Connect your Agent</h3>
          <p>If you are using Claude Desktop, add the following to your <code>claude_desktop_config.json</code>:</p>
          <pre className="code-block code-font"><code>{`{
  "mcpServers": {
    "kuaiyou": {
      "command": "npx",
      "args": ["-y", "@kuaiyou/mcp-server", "--adb"]
    }
  }
}`}</code></pre>
        </section>

        <section id="write-skill">
          <h2>Write your first Skill</h2>
          <p>A ReactiveSkill is a JSON document that defines the UI automation workflow.</p>
          <pre className="code-block code-font"><code>{`{
  "name": "Click Like Button",
  "goals": [
    {
      "id": "find_like",
      "action": {
        "type": "CLICK",
        "target": {
          "type": "TEXT",
          "value": "Like"
        }
      }
    }
  ]
}`}</code></pre>
        </section>
      </div>

      
    </main>
  );
}
