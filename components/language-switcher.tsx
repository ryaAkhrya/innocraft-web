"use client";

import { cn } from "@/lib/utils";
import { useLanguage } from "@/lib/i18n/language-provider";
import type { Locale } from "@/types/i18n";

interface LanguageSwitcherProps {
  locale?: Locale;
  className?: string;
}

export function LanguageSwitcher({ locale, className }: LanguageSwitcherProps) {
  const { locale: currentLocale, setLocale } = useLanguage();
  const activeLocale = locale ?? currentLocale;

  return (
    <div className={cn("flex items-center gap-2 rounded-full border border-border bg-white/70 p-1", className)}>
      <span className="px-2 text-sm font-medium text-paragraph">{activeLocale === "id" ? "Bahasa" : "Language"}</span>
      <button
        type="button"
        aria-label="Switch to Indonesian"
        onClick={() => setLocale("id")}
        className={cn(
          "rounded-full px-3 py-1 text-sm font-semibold transition-colors",
          activeLocale === "id" ? "bg-buttonBg text-white" : "text-heading hover:bg-primaryBg/20",
        )}
      >
        ID
      </button>
      <button
        type="button"
        aria-label="Switch to English"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-full px-3 py-1 text-sm font-semibold transition-colors",
          activeLocale === "en" ? "bg-buttonBg text-white" : "text-heading hover:bg-primaryBg/20",
        )}
      >
        EN
      </button>
    </div>
  );
}
