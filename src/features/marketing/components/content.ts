import type { AppLanguage } from "@/lib/i18n/config";

export const marketingNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

export const stats = [
  { label: "Avg. triage time reduction", value: "68%" },
  { label: "Supported languages", value: "4" },
  { label: "AI urgency precision", value: "91%" },
] as const;

export const coreFeatures = [
  {
    title: "Multilingual voice intelligence",
    description:
      "Capture Sinhala, Tamil, English, or mixed speech and convert it into reliable transcripts and support-ready context.",
  },
  {
    title: "AI complaint understanding",
    description:
      "Run intent classification, sentiment detection, urgency scoring, and entity extraction in one orchestrated pipeline.",
  },
  {
    title: "Ticket automation engine",
    description:
      "Auto-generate structured tickets, assign priority, and trigger escalations with audit-friendly workflow events.",
  },
  {
    title: "Operations analytics",
    description:
      "Track ticket volumes, sentiment shifts, language mix, and agent throughput through real-time dashboards.",
  },
] as const;

export const howItWorks = [
  {
    title: "Capture Voice",
    detail: "Users upload or record voice complaints directly from web or mobile browser.",
  },
  {
    title: "Analyze with AI",
    detail: "Valsea STT + NLP models detect language, intent, urgency, sentiment, and entities.",
  },
  {
    title: "Trigger Workflow",
    detail: "The platform creates a ticket, prioritizes it, assigns agents, and escalates critical cases.",
  },
  {
    title: "Monitor & Improve",
    detail: "Admin and support dashboards surface operational KPIs and bottlenecks in real time.",
  },
] as const;

export const testimonials = [
  {
    quote:
      "Voice2Action reduced our first-response time dramatically and gave us clear visibility into urgent complaints.",
    name: "Operations Lead",
    company: "LankaExpress",
  },
  {
    quote:
      "Mixed-language complaint handling used to be chaotic. Now every voice note becomes a clean, actionable ticket.",
    name: "Customer Success Manager",
    company: "NovaCommerce",
  },
  {
    quote:
      "Our agents spend less time triaging and more time resolving real issues that matter to customers.",
    name: "Support Director",
    company: "SwiftParcel",
  },
] as const;

export const pricingPlans = [
  {
    name: "Starter",
    price: "$49",
    period: "/month",
    description: "For growing support teams validating voice automation.",
    features: ["2,000 voice minutes", "Basic analytics", "Email support"],
    highlighted: false,
  },
  {
    name: "Growth",
    price: "$149",
    period: "/month",
    description: "For scaling operations handling multilingual complaint volume.",
    features: [
      "10,000 voice minutes",
      "Advanced analytics",
      "Workflow automation",
      "Priority support",
    ],
    highlighted: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    description: "For high-volume support operations requiring tailored controls.",
    features: ["Unlimited seats", "SLA & SSO", "Dedicated success engineer"],
    highlighted: false,
  },
] as const;

export const faqs = [
  {
    q: "Does Voice2Action support mixed-language complaints?",
    a: "Yes. The pipeline detects English, Sinhala, Tamil, and mixed inputs, then normalizes output into structured workflows.",
  },
  {
    q: "Can I route urgent complaints automatically?",
    a: "Yes. Urgency thresholds can auto-escalate tickets and notify relevant agents instantly.",
  },
  {
    q: "Is this suitable for enterprise support operations?",
    a: "Yes. The architecture is built for role-based dashboards, audit logs, scalable data handling, and deployment on modern cloud infrastructure.",
  },
] as const;

type MarketingContent = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  incomingVoiceLabel: string;
  recommendedActionPrefix: string;
  demoTitle: string;
  demoDescription: string;
  featuresTitle: string;
  featuresDescription: string;
  howTitle: string;
  howDescription: string;
  trustedTitle: string;
  trustedDescription: string;
  pricingTitle: string;
  pricingDescription: string;
  faqTitle: string;
  faqDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
  stats: ReadonlyArray<{ label: string; value: string }>;
  coreFeatures: ReadonlyArray<{ title: string; description: string }>;
  howItWorks: ReadonlyArray<{ title: string; detail: string }>;
  testimonials: ReadonlyArray<{ quote: string; name: string; company: string }>;
  pricingPlans: ReadonlyArray<{ name: string; price: string; period: string; description: string; features: ReadonlyArray<string>; highlighted: boolean }>;
  faqs: ReadonlyArray<{ q: string; a: string }>;
};

const marketingContentByLanguage: Record<AppLanguage, MarketingContent> = {
  en: {
    heroBadge: "Voice AI for Support Ops",
    heroTitle: "Convert multilingual voice complaints into structured business actions.",
    heroSubtitle:
      "Voice2Action transforms English, Sinhala, Tamil, and mixed-language voice messages into intent-aware tickets, urgency-based escalation, and operational analytics.",
    heroPrimaryCta: "Start Free Trial",
    heroSecondaryCta: "Explore Features",
    incomingVoiceLabel: "Incoming voice",
    recommendedActionPrefix: "Recommended action:",
    demoTitle: "Live Workflow Demo",
    demoDescription: "Voice in, structured action out.",
    featuresTitle: "Core Features",
    featuresDescription: "Built for customer support teams at scale.",
    howTitle: "How It Works",
    howDescription: "Four-step flow from voice to action.",
    trustedTitle: "Trusted by Support Teams",
    trustedDescription: "Real impact from teams handling high complaint volume.",
    pricingTitle: "Simple Pricing",
    pricingDescription: "Plans that grow with your support operation.",
    faqTitle: "Frequently Asked Questions",
    faqDescription: "Everything you need before launching.",
    ctaTitle: "Ready to turn voice complaints into measurable support outcomes?",
    ctaDescription: "Deploy Voice2Action and empower your teams with multilingual AI workflow automation.",
    ctaButton: "Start Building",
    stats,
    coreFeatures,
    howItWorks,
    testimonials,
    pricingPlans,
    faqs,
  },
  si: {
    heroBadge: "සහාය සඳහා හඬ AI",
    heroTitle: "බහුභාෂා හඬ පැමිණිලි ව්‍යුහගත ව්‍යාපාරික ක්‍රියා වලට පරිවර්තනය කරන්න.",
    heroSubtitle:
      "Voice2Action මඟින් English, Sinhala, Tamil සහ මිශ්‍ර හඬ පණිවිඩ intent-aware tickets, urgency escalation සහ analytics බවට පත් කරයි.",
    heroPrimaryCta: "නොමිලේ ආරම්භ කරන්න",
    heroSecondaryCta: "විශේෂාංග බලන්න",
    incomingVoiceLabel: "ලැබුණු හඬ",
    recommendedActionPrefix: "නිර්දේශිත ක්‍රියාව:",
    demoTitle: "සජීවී ක්‍රියාදාම පෙන්නුම",
    demoDescription: "හඬ ඇතුල් කර ක්‍රියාවක් ලබාගන්න.",
    featuresTitle: "ප්‍රධාන විශේෂාංග",
    featuresDescription: "පාරිභෝගික සහාය කණ්ඩායම් සඳහා.",
    howTitle: "එය ක්‍රියා කරන ආකාරය",
    howDescription: "හඬ සිට ක්‍රියාව දක්වා පියවර 4 ක්.",
    trustedTitle: "සහාය කණ්ඩායම් විශ්වාස කරන විසඳුම",
    trustedDescription: "ඉහළ පැමිණිලි ප්‍රමාණ සඳහා සැලකිය යුතු ප්‍රතිඵල.",
    pricingTitle: "සරල මිල ගණන්",
    pricingDescription: "ඔබගේ සහාය මෙහෙයුමට වර්ධනය වන සැලසුම්.",
    faqTitle: "නිතර අසන ප්‍රශ්න",
    faqDescription: "ආරම්භයට අවශ්‍ය සියල්ල.",
    ctaTitle: "හඬ පැමිණිලි මැනිය හැකි ප්‍රතිඵල බවට පත් කිරීමට සූදානම්ද?",
    ctaDescription: "Voice2Action සමඟ බහුභාෂා AI ක්‍රියාවලිය ඔබගේ කණ්ඩායමට ලබාදෙන්න.",
    ctaButton: "දැන් ආරම්භ කරන්න",
    stats: [
      { label: "සාමාන්‍ය triage කාල අඩු වීම", value: "68%" },
      { label: "සහාය දක්වන භාෂා", value: "4" },
      { label: "AI urgency නිරවද්‍යතාවය", value: "91%" },
    ],
    coreFeatures,
    howItWorks,
    testimonials,
    pricingPlans,
    faqs,
  },
  ta: {
    heroBadge: "ஆதரவுக்கான குரல் AI",
    heroTitle: "பலமொழி குரல் புகார்களை கட்டமைக்கப்பட்ட வணிகச் செயல்களாக மாற்றுங்கள்.",
    heroSubtitle:
      "Voice2Action ஆங்கிலம், சிங்களம், தமிழ் மற்றும் கலப்பு குரல் செய்திகளை intent-aware tickets, urgency escalation மற்றும் analytics ஆக மாற்றுகிறது.",
    heroPrimaryCta: "இலவசமாக தொடங்கு",
    heroSecondaryCta: "அம்சங்கள் பார்க்க",
    incomingVoiceLabel: "வரும் குரல்",
    recommendedActionPrefix: "பரிந்துரைக்கப்பட்ட நடவடிக்கை:",
    demoTitle: "நேரடி வேலைநெறி டெமோ",
    demoDescription: "குரல் உள்ளீடு, கட்டமைக்கப்பட்ட செயல் வெளியீடு.",
    featuresTitle: "முக்கிய அம்சங்கள்",
    featuresDescription: "அளவிலான வாடிக்கையாளர் ஆதரவு அணிகளுக்காக.",
    howTitle: "இது எப்படி செயல்படுகிறது",
    howDescription: "குரலிலிருந்து செயலுக்கு நான்கு படிகள்.",
    trustedTitle: "ஆதரவு அணிகள் நம்பும் தளம்",
    trustedDescription: "அதிக புகார் அளவை கையாளும் அணிகளின் உண்மை விளைவு.",
    pricingTitle: "எளிய விலை திட்டங்கள்",
    pricingDescription: "உங்கள் ஆதரவு செயல்பாட்டுடன் வளரும் திட்டங்கள்.",
    faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faqDescription: "தொடங்குவதற்கு முன் தேவையான அனைத்தும்.",
    ctaTitle: "குரல் புகார்களை அளவிடக்கூடிய ஆதரவு முடிவுகளாக மாற்ற தயாரா?",
    ctaDescription: "Voice2Action உடன் பலமொழி AI வேலைநெறியை உங்கள் அணிக்கு வழங்குங்கள்.",
    ctaButton: "இப்போது தொடங்கு",
    stats: [
      { label: "சராசரி triage நேரக் குறைப்பு", value: "68%" },
      { label: "ஆதரிக்கும் மொழிகள்", value: "4" },
      { label: "AI urgency துல்லியம்", value: "91%" },
    ],
    coreFeatures,
    howItWorks,
    testimonials,
    pricingPlans,
    faqs,
  },
};

export function getMarketingContent(language: AppLanguage) {
  return marketingContentByLanguage[language] ?? marketingContentByLanguage.en;
}
