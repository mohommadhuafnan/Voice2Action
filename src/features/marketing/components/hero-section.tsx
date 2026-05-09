"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { BadgeCheck, Mic, Sparkles } from "lucide-react";
import { useLanguage } from "@/components/i18n/language-provider";
import { getMarketingContent } from "@/features/marketing/components/content";

export function HeroSection() {
  const { language } = useLanguage();
  const content = getMarketingContent(language);

  return (
    <section className="relative overflow-hidden px-6 py-20 md:py-28">
      <div className="mx-auto grid w-full max-w-7xl gap-12 lg:grid-cols-[1.2fr,0.8fr] lg:items-center">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="space-y-7"
        >
          <span className="inline-flex items-center gap-2 rounded-full border border-sky-400/30 bg-sky-500/10 px-4 py-2 text-xs font-medium uppercase tracking-[0.2em] text-sky-200">
            <Sparkles className="h-4 w-4" />
            {content.heroBadge}
          </span>

          <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-white md:text-6xl">
            {content.heroTitle}
          </h1>

          <p className="max-w-2xl text-lg text-slate-300 md:text-xl">
            {content.heroSubtitle}
          </p>

          <div className="flex flex-wrap gap-4">
            <Link
              href="/dashboard"
              className="rounded-xl bg-sky-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-400"
            >
              {content.heroPrimaryCta}
            </Link>
            <Link
              href="/features"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm font-medium text-slate-100 transition hover:border-sky-400/70"
            >
              {content.heroSecondaryCta}
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-[0_20px_60px_-30px_rgba(14,165,233,0.45)] backdrop-blur"
        >
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-slate-400">{content.incomingVoiceLabel}</p>
              <p className="mt-2 text-sm text-slate-200">{content.heroSampleTranscript}</p>
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
              <Kpi icon={Mic} label={content.heroKpiLangLabel} value={content.heroKpiLangValue} />
              <Kpi icon={BadgeCheck} label={content.heroKpiIntentLabel} value={content.heroKpiIntentValue} />
              <Kpi icon={Sparkles} label={content.heroKpiUrgencyLabel} value={content.heroKpiUrgencyValue} />
            </div>

            <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4 text-sm text-emerald-100">
              {content.recommendedActionPrefix} {content.heroRecommendedContinuation}
            </div>
          </div>
        </motion.div>
      </div>

      <div className="mx-auto mt-14 grid w-full max-w-7xl gap-4 sm:grid-cols-3">
        {content.stats.map((item) => (
          <div key={item.label} className="rounded-xl border border-white/10 bg-white/5 px-5 py-4">
            <p className="text-2xl font-semibold text-white">{item.value}</p>
            <p className="mt-1 text-sm text-slate-400">{item.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

type KpiProps = {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
};

function Kpi({ icon: Icon, label, value }: KpiProps) {
  return (
    <div className="rounded-xl border border-white/10 bg-slate-900/70 p-3">
      <Icon className="h-4 w-4 text-sky-300" />
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-slate-500">{label}</p>
      <p className="mt-1 text-sm text-slate-200">{value}</p>
    </div>
  );
}
