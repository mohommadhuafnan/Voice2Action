import { defaultLanguage, isAppLanguage, type AppLanguage } from "@/lib/i18n/config";

export function normalizeLanguage(value: string | null | undefined): AppLanguage {
  if (!value) {
    return defaultLanguage;
  }
  return isAppLanguage(value) ? value : defaultLanguage;
}
