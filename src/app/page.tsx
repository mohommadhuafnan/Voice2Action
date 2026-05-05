import type { Metadata } from "next";
import { MarketingFooter } from "@/components/layout/marketing-footer";
import { MarketingNavbar } from "@/components/layout/marketing-navbar";
import { HeroSection } from "@/features/marketing/components/hero-section";
import {
  CtaSection,
  DemoSection,
  FaqSection,
  FeaturesSection,
  HowItWorksSection,
  PricingPreviewSection,
  TestimonialsSection,
} from "@/features/marketing/components/sections";

export const metadata: Metadata = {
  title: "Voice2Action | AI Voice-to-Workflow Platform",
  description:
    "Multilingual AI-powered voice complaint automation platform for support operations.",
};

export default function MarketingHomePage() {
  return (
    <div className="min-h-screen">
      <MarketingNavbar />
      <HeroSection />
      <DemoSection />
      <FeaturesSection />
      <HowItWorksSection />
      <TestimonialsSection />
      <PricingPreviewSection />
      <FaqSection />
      <CtaSection />
      <MarketingFooter />
    </div>
  );
}
