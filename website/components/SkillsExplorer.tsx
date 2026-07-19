"use client";

import { useEffect, useMemo, useState } from "react";
import SkillCard from "@/components/SkillCard";
import type { Skill, SkillCategory } from "@/lib/skills";
import { useI18n } from "@/lib/i18n";

interface SkillsExplorerProps {
  skills: Skill[];
  baseUrl: string;
}

type Filter = "all" | SkillCategory;

const DEFAULT_VISIBLE_COUNT = 6;

export default function SkillsExplorer({
  skills,
  baseUrl,
}: SkillsExplorerProps) {
  const { t } = useI18n();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("all");
  const [expanded, setExpanded] = useState(false);

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: t("skills.filter.all") },
    { id: "examples", label: t("skills.filter.examples") },
    { id: "compatibility-tests", label: t("skills.filter.tests") },
  ];

  const filteredSkills = useMemo(() => {
    const q = search.trim().toLowerCase();
    return skills.filter((skill) => {
      if (filter !== "all" && skill.category !== filter) return false;
      if (!q) return true;
      return (
        skill.name.toLowerCase().includes(q) ||
        skill.description.toLowerCase().includes(q) ||
        skill.id.toLowerCase().includes(q) ||
        skill.executionMode.toLowerCase().includes(q)
      );
    });
  }, [skills, search, filter]);

  // Filter/search changes should re-collapse to the first 6 of the current result set.
  useEffect(() => {
    setExpanded(false);
  }, [search, filter]);

  const visibleSkills = expanded
    ? filteredSkills
    : filteredSkills.slice(0, DEFAULT_VISIBLE_COUNT);
  const canToggle = filteredSkills.length > DEFAULT_VISIBLE_COUNT;

  return (
    <div
      className="skills-explorer"
      role="search"
      aria-label={t("skills.searchAria")}
    >
      <div className="skills-toolbar">
        <div
          className="filter-pills"
          role="group"
          aria-label={t("skills.filterAria")}
        >
          {filters.map((item) => (
            <button
              key={item.id}
              type="button"
              className={`filter-pill ${filter === item.id ? "active" : ""}`}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="search-container">
          <label htmlFor="skill-search" className="sr-only">
            {t("skills.searchLabel")}
          </label>
          <input
            id="skill-search"
            type="search"
            placeholder={t("skills.searchPlaceholder")}
            className="search-input glass-panel code-font"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-controls="skills-results"
          />
        </div>
      </div>

      <p className="skills-result-count" aria-live="polite" id="skills-results">
        {t("skills.result", { count: filteredSkills.length })}
      </p>

      <div className="skills-howto glass-panel">
        <h3>{t("skills.howto.title")}</h3>
        <ol>
          <li>{t("skills.howto.1")}</li>
          <li>
            {t("skills.howto.2.before")} {t("skills.howto.2.after")}
          </li>
          <li>
            {t("skills.howto.3.before")} {t("skills.howto.3.after")}
          </li>
          <li>{t("skills.howto.4")}</li>
        </ol>
        <p className="skills-howto-note">{t("skills.howto.note")}</p>
      </div>

      {filteredSkills.length > 0 ? (
        <>
          <ul className="skills-grid">
            {visibleSkills.map((skill) => (
              <li key={skill.id} className="skills-grid-item">
                <SkillCard skill={skill} baseUrl={baseUrl} />
              </li>
            ))}
          </ul>
          {canToggle ? (
            <div className="skills-more">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setExpanded((value) => !value)}
                aria-expanded={expanded}
              >
                {expanded ? t("skills.showLess") : t("skills.showMore")}
              </button>
            </div>
          ) : null}
        </>
      ) : (
        <div className="empty-state glass-panel" role="status">
          {t("skills.empty", { query: search.trim() || filter })}
        </div>
      )}
    </div>
  );
}
