"use client";

import { useI18n, type Locale } from "@/lib/i18n";

const OPTIONS: { id: Locale; labelKey: string }[] = [
  { id: "zh", labelKey: "lang.zh" },
  { id: "en", labelKey: "lang.en" },
];

export default function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();

  return (
    <div
      className="lang-switcher"
      role="group"
      aria-label={t("lang.switch")}
    >
      {OPTIONS.map((option) => (
        <button
          key={option.id}
          type="button"
          className={`lang-btn ${locale === option.id ? "active" : ""}`}
          aria-pressed={locale === option.id}
          onClick={() => setLocale(option.id)}
        >
          {t(option.labelKey)}
        </button>
      ))}
    </div>
  );
}
