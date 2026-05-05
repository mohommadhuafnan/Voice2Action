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
