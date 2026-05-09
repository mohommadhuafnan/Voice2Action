"use client";

import { useRouter } from "next/navigation";
import { useDictionary, useLanguage } from "@/components/i18n/language-provider";
import { supportedLanguages } from "@/lib/i18n/config";
import { getDictionary } from "@/lib/i18n/dictionary";

export function LanguageSwitcher() {
  const router = useRouter();
  const { language, setLanguage } = useLanguage();
  const dictionary = useDictionary();

  return (
    <label className="inline-flex items-center gap-1 text-xs text-slate-300 sm:gap-2">
      <span className="hidden sm:inline">{dictionary.languageLabel}</span>
      <select
        value={language}
        onChange={(event) => {
          setLanguage(event.target.value as (typeof supportedLanguages)[number]);
          router.refresh();
        }}
        className="h-9 rounded-md border border-white/20 bg-slate-900/80 px-2 text-xs text-slate-100 sm:px-3"
      >
        {supportedLanguages.map((code) => (
          <option key={code} value={code}>
            {getDictionary(code).languageName}
          </option>
        ))}
      </select>
    </label>
  );
}
