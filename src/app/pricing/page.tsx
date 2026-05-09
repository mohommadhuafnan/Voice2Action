import type { Metadata } from "next";
import { cookies } from "next/headers";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { pricingPlans } from "@/features/marketing/components/content";
import { getDictionary } from "@/lib/i18n/dictionary";
import { languageCookieName } from "@/lib/i18n/config";
import { normalizeLanguage } from "@/lib/i18n/resolve-language";

export const metadata: Metadata = {
  title: "Pricing | Voice2Action",
  description: "Transparent Voice2Action pricing for all support team sizes.",
};

export default async function PricingPage() {
  const cookieStore = await cookies();
  const language = normalizeLanguage(cookieStore.get(languageCookieName)?.value);
  const t = getDictionary(language);

  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-20">
        <h1 className="text-4xl font-semibold text-white">{t.pages.pricing.title}</h1>
        <p className="mt-3 max-w-3xl text-slate-300">{t.pages.pricing.subtitle}</p>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {pricingPlans.map((plan) => (
            <article
              key={plan.name}
              className={[
                "rounded-2xl border p-6",
                plan.highlighted ? "border-sky-400/60 bg-sky-500/10" : "border-white/10 bg-white/5",
              ].join(" ")}
            >
              <h2 className="text-xl font-semibold text-white">{plan.name}</h2>
              <p className="mt-3 text-3xl font-bold text-white">{plan.price}</p>
              <p className="text-sm text-slate-300">{plan.description}</p>
              <ul className="mt-4 space-y-2 text-sm text-slate-300">
                {plan.features.map((feature) => (
                  <li key={feature}>- {feature}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
