"use client";

import { useRef, useState } from "react";
import type { Skill } from "@/lib/skills";
import { useI18n } from "@/lib/i18n";

interface SkillCardProps {
  skill: Skill;
  baseUrl: string;
}

type CopyState = "idle" | "copying" | "success" | "error";

export default function SkillCard({ skill, baseUrl }: SkillCardProps) {
  const { t } = useI18n();
  const [copyState, setCopyState] = useState<CopyState>("idle");
  const [jsonUrl, setJsonUrl] = useState("");
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const langAttr =
    skill.language === "zh"
      ? "zh-CN"
      : skill.language === "mixed"
        ? "zh-CN"
        : undefined;

  const categoryLabel =
    skill.category === "examples"
      ? t("skills.category.examples")
      : t("skills.category.tests");

  const resolveUrl = () =>
    new URL(`${baseUrl}/${skill.file}`, window.location.origin).href;

  const handleCopy = async () => {
    if (copyState === "copying") return;
    const url = resolveUrl();
    setJsonUrl(url);
    setCopyState("copying");

    try {
      await navigator.clipboard.writeText(url);
      setCopyState("success");
    } catch {
      setCopyState("error");
    }

    if (resetTimer.current) clearTimeout(resetTimer.current);
    resetTimer.current = setTimeout(() => setCopyState("idle"), 2500);
  };

  const buttonLabel =
    copyState === "copying"
      ? t("skills.copyCopying")
      : copyState === "success"
        ? t("skills.copySuccess")
        : copyState === "error"
          ? t("skills.copyError")
          : t("skills.copyIdle");

  return (
    <article className="glass-panel skill-card">
      <div className="card-header">
        <h3 className="card-title" lang={langAttr}>
          {skill.name}
        </h3>
        <div className="card-badges">
          <span className="card-badge category-badge">{categoryLabel}</span>
          <span className="card-badge mode-badge code-font">
            {skill.executionMode}
          </span>
        </div>
      </div>

      <p className="card-desc" lang={langAttr}>
        {skill.description}
      </p>

      <div className="card-footer">
        <div className="card-id code-font" title={skill.id}>
          {skill.id}
        </div>
        <div className="card-actions">
          <a
            className="copy-btn card-link-btn"
            href={`${baseUrl}/${skill.file}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            {t("skills.viewJson")}
            <span className="sr-only">{t("nav.opensNewTab")}</span>
          </a>
          <button
            type="button"
            onClick={handleCopy}
            className="copy-btn"
            disabled={copyState === "copying"}
            aria-live="polite"
          >
            {buttonLabel}
          </button>
        </div>
      </div>

      {copyState === "error" && (
        <div className="copy-fallback" role="alert">
          <p>{t("skills.copyFallback")}</p>
          <input
            className="copy-fallback-input code-font"
            readOnly
            value={jsonUrl || `${baseUrl}/${skill.file}`}
            onFocus={(e) => e.currentTarget.select()}
            aria-label={t("skills.copyFallbackAria", { id: skill.id })}
          />
        </div>
      )}
    </article>
  );
}
