import type { Metadata } from "next";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { coreFeatures } from "@/features/marketing/components/content";

export const metadata: Metadata = {
  title: "Features | Voice2Action",
  description: "Explore Voice2Action capabilities for multilingual support automation.",
};

export default function FeaturesPage() {
  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-7xl px-6 py-20">
        <h1 className="text-4xl font-semibold text-white">Feature Stack</h1>
        <p className="mt-3 max-w-3xl text-slate-300">
          Voice2Action provides a complete AI-powered workflow from voice complaint capture to ticket resolution analytics.
        </p>
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
