export const languageCookieName = "voice2action_lang";

export const supportedLanguages = ["en", "si", "ta"] as const;

export type AppLanguage = (typeof supportedLanguages)[number];

export const defaultLanguage: AppLanguage = "en";

export function isAppLanguage(value: string): value is AppLanguage {
  return supportedLanguages.includes(value as AppLanguage);
}
