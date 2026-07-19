"use client";

import Link from "next/link";
import SkillsExplorer from "@/components/SkillsExplorer";
import type { Skill } from "@/lib/skills";
import { GITHUB_REPO_URL, SKILLS_PUBLIC_PATH } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export default function HomePage({ skills }: { skills: Skill[] }) {
  const { t } = useI18n();
  const exampleCount = skills.filter((s) => s.category === "examples").length;
  const testCount = skills.filter(
    (s) => s.category === "compatibility-tests"
  ).length;

  return (
    <main id="main-content" className="container animate-fade-in">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-badge code-font">{t("home.badge")}</div>
        <h1 id="hero-title" className="hero-title">
          <span className="hero-title-line">{t("home.title.line1")}</span>{" "}
          <span className="hero-title-line gradient-text">
            {t("home.title.line2")}
          </span>{" "}
          <span className="hero-title-line">{t("home.title.line3")}</span>
        </h1>
        <p className="hero-subtitle">{t("home.subtitle")}</p>

        <div className="hero-actions">
          <Link href="/docs#quick-start" className="btn btn-primary">
            {t("home.cta.primary")}
          </Link>
          <a href="#how-it-works" className="btn btn-secondary">
            {t("home.cta.how")}
          </a>
          <a
            href={GITHUB_REPO_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-ghost"
          >
            {t("home.cta.source")}
            <span className="sr-only">{t("nav.opensNewTab")}</span>
          </a>
        </div>

        <p className="hero-boundary">{t("home.boundary")}</p>

        <ul className="hero-tags" aria-label={t("home.tags.aria")}>
          <li>{t("home.tag.android")}</li>
          <li>{t("home.tag.app")}</li>
          <li>{t("home.tag.mcp")}</li>
          <li>{t("home.tag.bridge")}</li>
        </ul>
      </section>

      <section
        id="how-it-works"
        className="how-it-works glass-panel"
        aria-labelledby="how-it-works-title"
      >
        <div className="section-header">
          <h2 id="how-it-works-title">{t("home.how.title")}</h2>
          <p>{t("home.how.subtitle")}</p>
        </div>

        <ol className="architecture-flow">
          <li className="arch-node">
            <div className="node-icon" aria-hidden="true">
              🧠
            </div>
            <div className="node-title">{t("home.how.node1.title")}</div>
            <div className="node-desc">{t("home.how.node1.desc")}</div>
          </li>

          <li className="arch-arrow" aria-hidden="true">
            <div className="arrow-text code-font">{t("home.how.arrow1")}</div>
            <div className="arrow-line"></div>
          </li>

          <li className="arch-node highlight">
            <div className="node-icon" aria-hidden="true">
              ⚡
            </div>
            <div className="node-title">{t("home.how.node2.title")}</div>
            <div className="node-desc">{t("home.how.node2.desc")}</div>
          </li>

          <li className="arch-arrow" aria-hidden="true">
            <div className="arrow-text code-font">{t("home.how.arrow2")}</div>
            <div className="arrow-line"></div>
          </li>

          <li className="arch-node">
            <div className="node-icon" aria-hidden="true">
              📱
            </div>
            <div className="node-title">{t("home.how.node3.title")}</div>
            <div className="node-desc">{t("home.how.node3.desc")}</div>
          </li>
        </ol>

        <p className="sr-only">{t("home.how.sr")}</p>
      </section>

      <section
        className="capabilities-section"
        aria-labelledby="capabilities-title"
      >
        <div className="section-header">
          <h2 id="capabilities-title">{t("home.cap.title")}</h2>
          <p>{t("home.cap.subtitle")}</p>
        </div>
        <div className="capabilities-grid">
          <article className="glass-panel capability-card">
            <h3>{t("home.cap.1.title")}</h3>
            <p>{t("home.cap.1.desc")}</p>
          </article>
          <article className="glass-panel capability-card">
            <h3>{t("home.cap.2.title")}</h3>
            <p>{t("home.cap.2.desc")}</p>
          </article>
          <article className="glass-panel capability-card">
            <h3>{t("home.cap.3.title")}</h3>
            <p>{t("home.cap.3.desc")}</p>
          </article>
          <article className="glass-panel capability-card">
            <h3>{t("home.cap.4.title")}</h3>
            <p>{t("home.cap.4.desc")}</p>
          </article>
        </div>
      </section>

      <section
        className="quickstart-section glass-panel"
        aria-labelledby="quickstart-title"
      >
        <div className="section-header">
          <h2 id="quickstart-title">{t("home.qs.title")}</h2>
          <p>{t("home.qs.subtitle")}</p>
        </div>
        <ol className="quickstart-steps">
          <li>
            <strong>{t("home.qs.1.strong")}</strong> {t("home.qs.1.rest")}
          </li>
          <li>
            <strong>{t("home.qs.2.strong")}</strong> {t("home.qs.2.rest")}
          </li>
          <li>{t("home.qs.3")}</li>
          <li>{t("home.qs.4")}</li>
          <li>{t("home.qs.5")}</li>
        </ol>
        <div className="quickstart-actions">
          <Link href="/docs#quick-start" className="btn btn-primary">
            {t("home.qs.openGuide")}
          </Link>
          <Link href="/docs#mcp-tools" className="btn btn-secondary">
            {t("home.qs.tools")}
          </Link>
        </div>
      </section>

      <section
        id="skills"
        className="skills-section"
        aria-labelledby="skills-title"
      >
        <div className="section-header">
          <h2 id="skills-title">{t("home.skills.title")}</h2>
          <p>
            {t("home.skills.subtitle", {
              examples: exampleCount,
              tests: testCount,
            })}
          </p>
        </div>

        <SkillsExplorer skills={skills} baseUrl={SKILLS_PUBLIC_PATH} />
      </section>

      <section
        className="security-section glass-panel"
        aria-labelledby="security-title"
      >
        <div className="section-header">
          <h2 id="security-title">{t("home.sec.title")}</h2>
          <p>{t("home.sec.subtitle")}</p>
        </div>
        <ul className="security-list">
          <li>{t("home.sec.1")}</li>
          <li>{t("home.sec.2")}</li>
          <li>{t("home.sec.3")}</li>
          <li>{t("home.sec.4")}</li>
          <li>{t("home.sec.5")}</li>
        </ul>
      </section>
    </main>
  );
}
