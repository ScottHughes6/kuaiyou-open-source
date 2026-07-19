"use client";

import Link from "next/link";
import { useI18n } from "@/lib/i18n";

export default function NotFound() {
  const { t } = useI18n();

  return (
    <main id="main-content" className="container animate-fade-in not-found">
      <div className="glass-panel not-found-panel">
        <p className="hero-badge code-font">404</p>
        <h1>{t("notfound.title")}</h1>
        <p>{t("notfound.desc")}</p>
        <div className="hero-actions">
          <Link href="/" className="btn btn-primary">
            {t("notfound.home")}
          </Link>
          <Link href="/docs#quick-start" className="btn btn-secondary">
            {t("notfound.docs")}
          </Link>
        </div>
      </div>
    </main>
  );
}
