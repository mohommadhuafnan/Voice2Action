import Link from "next/link";
import { coreFeatures, faqs, howItWorks, pricingPlans, testimonials } from "@/features/marketing/components/content";

export function DemoSection() {
  return (
    <Section title="Live Workflow Demo" description="Voice in, structured action out.">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl bg-slate-900/80 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Transcript</p>
            <p className="mt-2 text-sm text-slate-200">My package still has not arrived, three days now, please check urgently.</p>
          </div>
          <div className="rounded-xl bg-slate-900/80 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Structured output</p>
            <p className="mt-2 text-sm text-slate-200">intent: delivery_complaint | sentiment: frustrated | priority: high</p>
          </div>
        </div>
      </div>
    </Section>
  );
}

export function FeaturesSection() {
  return (
    <Section title="Core Features" description="Built for customer support teams at scale.">
      <div className="grid gap-4 md:grid-cols-2">
        {coreFeatures.map((feature) => (
          <div key={feature.title} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{feature.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function HowItWorksSection() {
  return (
    <Section title="How It Works" description="Four-step flow from voice to action.">
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {howItWorks.map((step, idx) => (
          <div key={step.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-sky-300">Step {idx + 1}</p>
            <h3 className="mt-2 font-semibold text-white">{step.title}</h3>
            <p className="mt-2 text-sm text-slate-300">{step.detail}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function TestimonialsSection() {
  return (
    <Section title="Trusted by Support Teams" description="Real impact from teams handling high complaint volume.">
      <div className="grid gap-4 md:grid-cols-3">
        {testimonials.map((item) => (
          <blockquote key={item.company} className="rounded-2xl border border-white/10 bg-white/5 p-6">
            <p className="text-sm text-slate-200">&quot;{item.quote}&quot;</p>
            <footer className="mt-4 text-xs text-slate-400">{item.name} - {item.company}</footer>
          </blockquote>
        ))}
      </div>
    </Section>
  );
}

export function PricingPreviewSection() {
  return (
    <Section title="Simple Pricing" description="Plans that grow with your support operation.">
      <div className="grid gap-4 md:grid-cols-3">
        {pricingPlans.map((plan) => (
          <div
            key={plan.name}
            className={[
              "rounded-2xl border p-6",
              plan.highlighted
                ? "border-sky-400/60 bg-sky-500/10"
                : "border-white/10 bg-white/5",
            ].join(" ")}
          >
            <h3 className="text-xl font-semibold text-white">{plan.name}</h3>
            <p className="mt-3 text-3xl font-bold text-white">
              {plan.price}
              <span className="text-base font-normal text-slate-300">{plan.period}</span>
            </p>
            <p className="mt-2 text-sm text-slate-300">{plan.description}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function FaqSection() {
  return (
    <Section title="Frequently Asked Questions" description="Everything you need before launching.">
      <div className="space-y-3">
        {faqs.map((faq) => (
          <div key={faq.q} className="rounded-xl border border-white/10 bg-white/5 p-5">
            <h4 className="font-medium text-white">{faq.q}</h4>
            <p className="mt-2 text-sm text-slate-300">{faq.a}</p>
          </div>
        ))}
      </div>
    </Section>
  );
}

export function CtaSection() {
  return (
    <section className="px-6 py-16">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center rounded-3xl border border-sky-400/30 bg-sky-500/10 px-6 py-12 text-center">
        <h2 className="max-w-2xl text-3xl font-semibold text-white">Ready to turn voice complaints into measurable support outcomes?</h2>
        <p className="mt-3 max-w-2xl text-slate-200">Deploy Voice2Action and empower your teams with multilingual AI workflow automation.</p>
        <Link
          href="/dashboard"
          className="mt-6 rounded-xl bg-sky-500 px-6 py-3 text-sm font-medium text-white transition hover:bg-sky-400"
        >
          Start Building
        </Link>
      </div>
    </section>
  );
}

type SectionProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

function Section({ title, description, children }: SectionProps) {
  return (
    <section className="px-6 py-14">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-8">
          <h2 className="text-3xl font-semibold text-white">{title}</h2>
          <p className="mt-2 text-slate-300">{description}</p>
        </div>
        {children}
      </div>
    </section>
  );
}
