"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";

/**
 * Keeps document title/description in sync when the client route changes
 * (e.g. Home ↔ Docs) while preserving the selected language.
 */
export default function DocumentMeta() {
  const pathname = usePathname();
  const { locale } = useI18n();

  useEffect(() => {
    // Trigger the same meta update path used by locale switches.
    // Reading locale here ensures dependency tracking on route + language.
    void locale;
    void pathname;
    // I18nProvider already owns the actual DOM write logic via locale effect
    // and setLocale. This component re-applies on pathname changes.
    const event = new Event("kuaiyou:route-meta");
    window.dispatchEvent(event);
  }, [locale, pathname]);

  return null;
}
