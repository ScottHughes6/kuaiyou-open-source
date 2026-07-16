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
            <li>
              For LAN mode: enable &quot;LAN MCP Service&quot; in the App and note its IP.
              For the USB fallback: ADB installed with the device connected.
            </li>
          </ul>

          <h3>2. Start the Server</h3>
          <p>LAN direct connection (recommended, replace with your device IP):</p>
          <pre className="code-block code-font"><code>KUAIYOU_DEVICE_IP=192.168.1.100 npx -y kuaiyou-mcp-server</code></pre>
          <p>USB / ADB fallback (no IP needed):</p>
          <pre className="code-block code-font"><code>npx -y kuaiyou-mcp-server</code></pre>

          <h3>3. Connect your Agent</h3>
          <p>If you are using Claude Desktop, add the following to your <code>claude_desktop_config.json</code>:</p>
          <pre className="code-block code-font"><code>{`{
  "mcpServers": {
    "kuaiyou": {
      "command": "npx",
      "args": ["-y", "kuaiyou-mcp-server"],
      "env": {
        "KUAIYOU_DEVICE_IP": "192.168.1.100"
      }
    }
  }
}`}</code></pre>
        </section>

        <section id="write-skill">
          <h2>Write your first Skill</h2>
          <p>
            A ReactiveSkill is a JSON document describing a trigger-driven automation.
            Each goal watches for a trigger and runs a list of actions. This shape matches
            the shipped examples under <code>skills/</code>.
          </p>
          <pre className="code-block code-font"><code>{`{
  "id": "reactive_click_confirm",
  "name": "Click the confirm button",
  "description": "Tap the confirm button whenever it appears, up to 3 times",
  "goals": [
    {
      "id": "click_confirm",
      "name": "Click confirm",
      "trigger": {
        "type": "elementVisible",
        "target": { "type": "text", "text": "确认" }
      },
      "actions": [
        { "type": "tap", "target": { "type": "text", "text": "确认" } }
      ],
      "constraints": { "maxExecutions": 3, "cooldownMs": 2000 }
    }
  ],
  "termination": { "type": "timeout", "maxDurationMs": 30000 }
}`}</code></pre>
          <div className="alert info">
            <strong>Tip:</strong> Validate any skill with the <code>validate_kuaiyou_skill</code> tool
            or against <code>schema.json</code> before pushing it to your device.
          </div>
        </section>

        <section id="mcp-tools">
          <h2>MCP Tools Reference</h2>
          <p>The server exposes four tools to the AI agent:</p>
          <ul>
            <li><code>validate_kuaiyou_skill</code> — validate a skill JSON string or file against the ReactiveSkill schema.</li>
            <li><code>push_reactive_skill</code> — deploy a skill to the device via LAN HTTP (falls back to ADB).</li>
            <li><code>get_ui_tree</code> — fetch the current UI node tree (with parsed bounds) from the device.</li>
            <li><code>capture_screenshot</code> — capture the current screen as an image.</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
