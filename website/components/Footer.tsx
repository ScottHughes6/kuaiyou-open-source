"use client";

import Link from "next/link";
import { GITHUB_REPO_URL } from "@/lib/site";
import { useI18n } from "@/lib/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="footer glass-panel">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="footer-logo-text">{t("footer.brand")}</span>
          <p className="footer-desc">{t("footer.desc")}</p>
        </div>
        <nav className="footer-links" aria-label={t("footer.nav")}>
          <a href={GITHUB_REPO_URL} target="_blank" rel="noopener noreferrer">
            {t("footer.github")}
            <span className="sr-only">{t("nav.opensNewTab")}</span>
          </a>
          <Link href="/docs">{t("footer.docs")}</Link>
          <Link href="/docs#quick-start">{t("footer.quick")}</Link>
          <a href="/#skills">{t("footer.skills")}</a>
        </nav>
      </div>
      <div className="footer-bottom">
        <p>{t("footer.copy", { year: new Date().getFullYear() })}</p>
        <p>{t("footer.note")}</p>
      </div>
    </footer>
  );
}
