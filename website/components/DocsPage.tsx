"use client";

import { useI18n } from "@/lib/i18n";

export default function DocsPageContent() {
  const { t } = useI18n();

  return (
    <main id="main-content" className="docs-container animate-fade-in">
      <nav className="docs-sidebar glass-panel" aria-label={t("docs.navAria")}>
        <ul className="docs-nav">
          <li>
            <a href="#introduction" className="active">
              {t("docs.nav.intro")}
            </a>
          </li>
          <li>
            <a href="#quick-start">{t("docs.nav.quick")}</a>
          </li>
          <li>
            <a href="#write-skill">{t("docs.nav.write")}</a>
          </li>
          <li>
            <a href="#mcp-tools">{t("docs.nav.tools")}</a>
          </li>
          <li>
            <a href="#boundaries">{t("docs.nav.boundaries")}</a>
          </li>
        </ul>
      </nav>

      <div className="docs-content glass-panel">
        <section id="introduction">
          <h1>{t("docs.intro.title")}</h1>
          <p>
            {t("docs.intro.p1")}{" "}
            <strong>Model Context Protocol (MCP)</strong>{" "}
            {t("docs.intro.p1.mid")}
          </p>
          <div className="alert info">
            <strong>{t("docs.intro.note.strong")}</strong>{" "}
            {t("docs.intro.note")}
          </div>
        </section>

        <section id="quick-start">
          <h2>{t("docs.quick.title")}</h2>
          <p>{t("docs.quick.p")}</p>

          <h3>{t("docs.quick.prereq")}</h3>
          <ul>
            <li>{t("docs.quick.prereq.1")}</li>
            <li>{t("docs.quick.prereq.2")}</li>
            <li>{t("docs.quick.prereq.3")}</li>
            <li>{t("docs.quick.prereq.4")}</li>
          </ul>

          <h3>{t("docs.quick.start")}</h3>
          <p>{t("docs.quick.lan")}</p>
          <pre className="code-block code-font">
            <code>
              KUAIYOU_DEVICE_IP=192.168.1.100 npx -y kuaiyou-mcp-server
            </code>
          </pre>
          <p>{t("docs.quick.usb")}</p>
          <pre className="code-block code-font">
            <code>npx -y kuaiyou-mcp-server</code>
          </pre>

          <h3>{t("docs.quick.connect")}</h3>
          <p>
            {t("docs.quick.claude")}{" "}
            <code>claude_desktop_config.json</code>:
          </p>
          <pre className="code-block code-font">
            <code>{`{
  "mcpServers": {
    "kuaiyou": {
      "command": "npx",
      "args": ["-y", "kuaiyou-mcp-server"],
      "env": {
        "KUAIYOU_DEVICE_IP": "192.168.1.100"
      }
    }
  }
}`}</code>
          </pre>
          <p>{t("docs.quick.compat")}</p>
        </section>

        <section id="write-skill">
          <h2>{t("docs.write.title")}</h2>
          <p>
            {t("docs.write.p")} <code>skills/</code>
            {t("docs.write.p.end")}
          </p>
          <pre className="code-block code-font">
            <code>{`{
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
}`}</code>
          </pre>
          <div className="alert info">
            <strong>{t("docs.write.tip.strong")}</strong> {t("docs.write.tip")}
          </div>
        </section>

        <section id="mcp-tools">
          <h2>{t("docs.tools.title")}</h2>
          <p>{t("docs.tools.p")}</p>
          <ul>
            <li>{t("docs.tools.1")}</li>
            <li>{t("docs.tools.2")}</li>
            <li>{t("docs.tools.3")}</li>
            <li>{t("docs.tools.4")}</li>
          </ul>
        </section>

        <section id="boundaries">
          <h2>{t("docs.bound.title")}</h2>
          <ul>
            <li>{t("docs.bound.1")}</li>
            <li>{t("docs.bound.2")}</li>
            <li>{t("docs.bound.3")}</li>
            <li>{t("docs.bound.4")}</li>
          </ul>
        </section>
      </div>
    </main>
  );
}
