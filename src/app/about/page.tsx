import type { Metadata } from "next";
import { cookies } from "next/headers";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { getDictionary } from "@/lib/i18n/dictionary";
import { languageCookieName } from "@/lib/i18n/config";
import { normalizeLanguage } from "@/lib/i18n/resolve-language";

export const metadata: Metadata = {
  title: "About | Voice2Action",
  description: "Learn about Voice2Action mission and product vision.",
};

export default async function AboutPage() {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get(languageCookieName)?.value);
  const t = getDictionary(language);

  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-semibold text-white">{t.pages.about.title}</h1>
        <div className="mt-8 space-y-6 text-slate-300">
          <p>{t.pages.about.paragraphs[0]}</p>
          <p>{t.pages.about.paragraphs[1]}</p>
          <p>{t.pages.about.paragraphs[2]}</p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
