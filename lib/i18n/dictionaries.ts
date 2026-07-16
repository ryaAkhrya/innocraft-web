import { enMessages } from "@/messages/en";
import { idMessages } from "@/messages/id";
import type { Locale } from "@/types/i18n";

const dictionaries = {
  id: idMessages,
  en: enMessages,
} as const;

export const locales = ["id", "en"] as const;
export const defaultLocale: Locale = "id";

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
