import type { Metadata } from "next";
import { cookies } from "next/headers";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { coreFeatures } from "@/features/marketing/components/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { languageCookieName } from "@/lib/i18n/config";
import { normalizeLanguage } from "@/lib/i18n/resolve-language";

export const metadata: Metadata = {
  title: "Features | Voice2Action",
  description: "Explore Voice2Action capabilities for multilingual support automation.",
};

export default async function FeaturesPage() {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get(languageCookieName)?.value);
  const t = getDictionary(language);

  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-20">
        <h1 className="text-4xl font-semibold text-white">{t.pages.features.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-300">{t.pages.features.subtitle}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {coreFeatures.map((feature) => (
            <article key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
              <h2 className="text-xl font-semibold text-white">{feature.title}</h2>
              <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
            </article>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
