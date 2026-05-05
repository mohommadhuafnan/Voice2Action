import type { Metadata } from "next";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";

export const metadata: Metadata = {
  title: "About | Voice2Action",
  description: "Learn about Voice2Action mission and product vision.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <main className="mx-auto w-full max-w-5xl px-6 py-20">
        <h1 className="text-4xl font-semibold text-white">Built for modern customer support teams</h1>
        <div className="mt-8 space-y-6 text-slate-300">
          <p>
            Voice2Action is a multilingual AI platform designed to transform unstructured voice complaints into structured support workflows.
          </p>
          <p>
            Our mission is to help support teams reduce response time, prioritize urgent issues accurately, and operate with data-driven clarity.
          </p>
          <p>
            The platform combines speech-to-text, language detection, sentiment analysis, urgency scoring, and ticket automation in a single production-ready system.
          </p>
        </div>
      </main>
      <MarketingFooter />
    </div>
  );
}
