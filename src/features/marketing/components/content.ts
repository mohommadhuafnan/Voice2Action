import type { AppLanguage } from "@/lib/i18n/config";

export const marketingNavLinks = [
  { href: "/features", label: "Features" },
  { href: "/about", label: "About" },
  { href: "/pricing", label: "Pricing" },
  { href: "/contact", label: "Contact" },
] as const;

/** English marketing statistics (also used by English bundle). */
export const stats = [
  { label: "Avg. triage time reduction", value: "68%" },
  { label: "Supported languages", value: "4" },
  { label: "AI urgency precision", value: "91%" },
] as const;

/** English-only feature bullets (pricing/features pages fallback). */
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
    detail: "ValSea STT + NLP models detect language, intent, urgency, sentiment, and entities.",
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

const statsSi = [
  { label: "සාමාන්‍ය වර්ගීකරණ කාලය අඩු වීම", value: "68%" },
  { label: "සහාය දක්වන භාෂා", value: "4" },
  { label: "AI අත්‍යවශ්‍යතා නිරවද්‍යතාව", value: "91%" },
];

const statsTa = [
  { label: "சராசரி வகைப்பாட்டு நேரக் குறைப்பு", value: "68%" },
  { label: "ஆதரவளிக்கும் மொழிகள்", value: "4" },
  { label: "செயற்கை நுண்ணறிவு அவசர மதிப்பீட்டுத் துல்லியம்", value: "91%" },
];

const coreFeaturesSi = [
  {
    title: "බහුභාෂා හඬ බුද්ධිය",
    description:
      "සිංහල, දමිළ, ඉංග්‍රීසි හෝ මිශ්‍ර කථනය ලබා ගෙන විශ්වාසදායක පිටපත් සහ සහාය සඳහා සූදානම් සන්දර්භයක් සාදන්න.",
  },
  {
    title: "AI පැමිණිලි තේරුම් ගැනීම",
    description:
      "කරුණැති වර්ගීකරණය, හැඟීම් විශ්ලේෂණය, හදිසිත්ව ලකුණු කිරීම සහ ආයතන උද්ධරණය එක් සම්බන්ධීත ක්‍රියාවලියක.",
  },
  {
    title: "ටිකට් ස්වයංක්‍රීයකරණ එන්ජිම",
    description:
      "ව්‍යුහගත ටිකට් ස්වයං නිර්මාණය කර, ප්‍රමුඛත්වය හිමි කර දී, සංවීක්ෂණ-හිතකාරී සිදුවීම් සමඟ උසස්වීම් ක්‍රියාත්මක කරන්න.",
  },
  {
    title: "මෙහෙයුම් විශ්ලේෂණ",
    description:
      "රියල්-ටයිම් උපකරණ මඟින් ටිකට් ප්‍රමාණය, හැඟීම් වෙනස් වීම්, භාෂා මිශ්‍රණය සහ නියෝජිත ක්‍රියාකාරිත්වය නිරීක්ෂණය කරන්න.",
  },
];

const coreFeaturesTa = [
  {
    title: "பலமொழி குரல் நுண்ணறிவு",
    description:
      "சிங்களம், தமிழ், ஆங்கிலம் அல்லது கலப்பு பேச்சை பதிவு செய்து நம்பகமான உரையாக்கமும் ஆதரவுக்கு ஆயத்தமான சூழலும் உருவாக்குக.",
  },
  {
    title: "செயற்கை நுண்ணறிவுடன் புகார் விளக்கம்",
    description:
      "நோக்கம் வகைப்பாடு, உணர்வுப் பகுப்பாய்வு, அவசர மதிப்பீடு, நிகழிடச் சுருக்கம் ஆகியவற்றை ஒரே ஒழுங்கமைந்த குழாயில் இயக்குக.",
  },
  {
    title: "டிக்கெட் தானியங்கு இயந்திரம்",
    description:
      "கட்டமைக்கப்பட்ட டிக்கெட்டுகளைத் தானாக உருவாக்கி, முன்னுரிமை ஒதுக்கி, தணிக்கைக்கு உகந்த நிகழ்வுகளுடன் உயர்த்தல்களைத் தொடங்குக.",
  },
  {
    title: "செயல்பாட்டுப் பகுப்பாய்வு",
    description:
      "நிகழ்நேர அட்டவணைகள் மூலம் டிக்கெட் பரிமாணம், உணர்வு மாற்றம், மொழி கலவை, முகவர் புலப்பாடு ஆகியவற்றைக் கண்காணி.",
  },
];

const howItWorksSi = [
  {
    title: "හඬ පටිගත කිරීම හෝ උඩුගත කිරීම",
    detail: "පරිශීලකයින් වියමන හෝ ජංගම වියමනෙන් සෘජුව හඬ පැමිණිලි උඩුගත කරති හෝ පටිගත කරති.",
  },
  {
    title: "AI සමඟ විශ්ලේෂණය",
    detail: "ValSea STT සහ NLP ආකෘති මඟින් භාෂාව, කරුණ, හදිසිත්වය, හැඟීම් සහ සංයුති අන්තර්ගතය හඳුනාගනී.",
  },
  {
    title: "ක්‍රියාවලිය ආරම්භ කරන්න",
    detail: "වේදිකාව ටිකට් එකක් සාදා, ප්‍රමුඛත්වය දෙයි, නියෝජිතයින් පවරයි, බරපතළ සිද්ධි වලදී උසස් කරයි.",
  },
  {
    title: "නිරීක්ෂණය සහ වැඩිදියුණුව",
    detail: "පරිපාලක හා සහාය උපකරණ මඟින් මෙහෙයුම් KPI සහ ප්‍රතිබාධ නිරන්තරයෙන් පෙන්වයි.",
  },
];

const howItWorksTa = [
  {
    title: "குரலைப் பதிவு செய்",
    detail: "பயனர்கள் வலை அல்லது மொபைல் உலாவியில் நேரடியாக குரல் புகார்களை பதிவேற்றலாம் அல்லது பதிவு செய்யலாம்.",
  },
  {
    title: "செயற்கை நுண்ணறிவுடன் பகுப்பாய்வு",
    detail: "ValSea STT மற்றும் NLP மாதிரிகள் மொழி, நோக்கம், அவசரம், உணர்வு, நிகழிடங்களைக் கண்டறிகின்றன.",
  },
  {
    title: "வேலைநெறியைத் தொடங்கு",
    detail: "மேடை டிக்கெட்டை உருவாக்கி, முன்னுரிமைப்படுத்தி, முகவர்களை ஒதுக்கி, முக்கிய சம்பவங்களை உயர்த்துகிறது.",
  },
  {
    title: "கண்காணித்தல் மற்றும் மேம்பாடு",
    detail: "நிர்வாக மற்றும் ஆதரவு கட்டுப்பாட்டுப்பலகைகள் செயல்பாட்டு அளவு காட்டிகளையும் தடைகளையும் உடனுக்குடன் காட்டுகின்றன.",
  },
];

const testimonialsSi = [
  {
    quote:
      "පළමු ප්‍රතිචාර කාලය සැලකිය යුතු පරිදි අඩු වූ අතර හදිසි පැමිණිලි පිළිබඳ නිරවද්‍ය දර්ශනයක් ලැබුණි.",
    name: "මෙහෙයුම් අධීක්ෂක",
    company: "ලංකාඑක්ස්ප්‍රස්",
  },
  {
    quote:
      "මිශ්‍ර භාෂා පැමිණිලි කළමනාකරණය ව්‍යවසනයෙන් තොරව සංවිධානය විය. දැන් සෑම හඬ සටහනක්ම පැහැදිලි, ක්‍රියාමය ටිකට් එකක් බවට පත් වේ.",
    name: "පාරිභෝගික සාර්ථකතා කළමනාකරු",
    company: "නෝවා වාණිජ්‍ය",
  },
  {
    quote:
      "අපගේ නියෝජිතයන් දැන් වැඩිපුර කාලය ගත කරන්නේ වර්ගීකරණය කිරීමට නොව ගනුදෙනුකරුවන්ට සැබෑ වැදගත් ගැටලු විසඳීමටයි.",
    name: "සහාය නායක",
    company: "ස්විෆ්ට්පාර්සල්",
  },
];

const testimonialsTa = [
  {
    quote:
      "முதல் பதிலளிப்பு நேரம் வெகுவாக சுருங்கியது; அவசரப் புகார்களைத் தெளிவாகக் கண்டுகொள்ள முடிகிறது.",
    name: "செயல்பாட்டுத் தலைவர்",
    company: "லங்காஎக்ஸ்பிரஸ்",
  },
  {
    quote:
      "கலப்பு மொழிப் புகார்கள் முன்பு குழப்பமாக இருந்தது. இப்போது ஒவ்வொரு குரல் குறிப்பும் தெளிவான, செயற்படுத்தக்கூடிய டிக்கெட்டாகிறது.",
    name: "வாடிக்கையாளர் வெற்றி மேலாளர்",
    company: "நோவாகாமெர்ச்",
  },
  {
    quote:
      "முகவர்கள் வகைப்பாட்டுக்கு அதிக நேரம் செலவழியாமல், வாடிக்கையாளர்களுக்கு முக்கியமான உண்மைப் பிரச்சினைகளைத் தீர்ப்பதில் அதிகம் ஈடுபடுகின்றனர்.",
    name: "ஆதரவுத் தலைவர்",
    company: "ஸ்விஃப்ட்பார்சல்",
  },
];

const pricingPlansSi = [
  {
    name: "ආරම්භක",
    price: "$49",
    period: "/මස",
    description: "හඬ ස්වයංක්‍රියකරණය තහවුරු කරන වර්ධනය වන සහාය කණ්ඩායම් සඳහා.",
    features: ["හඬ මිනිත්තු 2,000", "මූලික විශ්ලේෂණ", "ඊමේල් සහාය"],
    highlighted: false,
  },
  {
    name: "වර්ධනය",
    price: "$149",
    period: "/මස",
    description: "බහුභාෂා පැමිණිලි ප්‍රමාණය හසුරු කරන පරිමාණ ගත මෙහෙයුම් සඳහා.",
    features: [
      "හඬ මිනිත්තු 10,000",
      "උසස් විශ්ලේෂණ",
      "ක්‍රියාවලි ස්වයංක්‍රියකරණය",
      "ප්‍රමුඛ සහාය",
    ],
    highlighted: true,
  },
  {
    name: "ව්‍යවසාය",
    price: "අභිරුචි",
    period: "",
    description: "හිතකාරී පාලන සඳහා ඉහළ පරිමාණ සහාය මෙහෙයුම් සඳහා.",
    features: ["අසීමිත ආසන", "SLA සහ SSO", "විශේෂගත සාර්ථකතා ඉංජිනේරු"],
    highlighted: false,
  },
];

const pricingPlansTa = [
  {
    name: "தொடக்கம்",
    price: "$49",
    period: "/மாதம்",
    description: "குரல் தானியங்குப் பாதையைச் சோதிக்கும் வளரும் ஆதரவு அணிகளுக்கு.",
    features: ["2,000 குரல் நிமிடங்கள்", "அடிப்படை பகுப்பாய்வு", "மின்னஞ்சல் ஆதரவு"],
    highlighted: false,
  },
  {
    name: "வளர்ச்சி",
    price: "$149",
    period: "/மாதம்",
    description: "பலமொழி புகார் பரிமாணத்தைக் கையாளும் பெரிய அளவிலான செயல்பாடுகளுக்கு.",
    features: [
      "10,000 குரல் நிமிடங்கள்",
      "மேம்பட்ட பகுப்பாய்வு",
      "வேலைநெறித் தானியங்கு",
      "முன்னுரிமை ஆதரவு",
    ],
    highlighted: true,
  },
  {
    name: "தொழில்முனைவர்",
    price: "தனிப்பயன்",
    period: "",
    description: "தனிப்பயனான கட்டுப்பாடுகளை விரும்பும் அதிக பரிமாண ஆதரவுச் செயல்பாடுகளுக்கு.",
    features: ["வரம்பற்ற இருக்கைகள்", "SLA மற்றும் SSO", "முழுநேர் வெற்றி பொறியாளர்"],
    highlighted: false,
  },
];

const faqsSi = [
  {
    q: "Voice2Action මිශ්‍ර භාෂා පැමිණිලි සහාය දක්වනවාද?",
    a: "ඔව්. ක්‍රියාවලිය ඉංග්‍රීසි, සිංහල, දමිළ සහ මිශ්‍ර ආදෝහන හඳුනා ගෙන ප්‍රතිදානය ව්‍යුහගත ක්‍රියාවලි වලට සාමාංචි කරයි.",
  },
  {
    q: "හදිසි පැමිණිලි ස්වයංක්‍රියව මාරු කළ හැකිද?",
    a: "ඔව්. හදිසි සීමාවන් ටිකට් ස්වයං උසස් කර සම්බන්ධ නියෝජිතයින් වහාම දැනුම් දිය හැකිය.",
  },
  {
    q: "ව්‍යවසාය සහාය මෙහෙයුම් සඳහා මෙය සුදුසුද?",
    a: "ඔව්. ආකෘතිය භූමිකා-මූලික උපකරණ, සංවීක්ෂණ ලේඛන, පරිමාණ ගත දත්ත සැකැස්ම සහ නවීන වලාකුළු යට බෙදා හැරීම සඳහා නිර්මාණය කර ඇත.",
  },
];

const faqsTa = [
  {
    q: "Voice2Action கலப்பு மொழிப் புகார்களை ஆதரிக்குமா?",
    a: "ஆம். குழாய் ஆங்கிலம், சிங்களம், தமிழ் மற்றும் கலப்புப் உள்ளீடுகளைக் கண்டுபிடித்து வெளியீட்டை கட்டமைக்கப்பட்ட வேலைநெறிகளாக சீரமைக்கிறது.",
  },
  {
    q: "அவசர புகார்களைத் தானாகத் திருப்பி விட முடியுமா?",
    a: "ஆம். அவசர வரம்புகள் டிக்கெட்டுகளைத் தானியங்கியாக உயர்த்தி, சம்பந்தப்பட்ட முகவர்களுக்கு உடனே அறிவிக்கின்றன.",
  },
  {
    q: "தொழில்முனைவர் ஆதரவுச் செயல்பாடுகளுக்கு இது பொருத்தமா?",
    a: "ஆம். கட்டமைப்பு பாத்திரங்களை அடிப்படையான கட்டுப்பாட்டுப்பலகைகள், தணிக்கைப் பதிவேடுகள், விரிவாக்கக்கூடிய தரவுக் கையாளுதல், நவீன மேகத்தில் செயல்படுத்தல் ஆகியவற்றிற்காக உருவாக்கப்பட்டுள்ளது.",
  },
];

export type MarketingContent = {
  heroBadge: string;
  heroTitle: string;
  heroSubtitle: string;
  heroPrimaryCta: string;
  heroSecondaryCta: string;
  incomingVoiceLabel: string;
  recommendedActionPrefix: string;
  heroSampleTranscript: string;
  heroKpiLangLabel: string;
  heroKpiLangValue: string;
  heroKpiIntentLabel: string;
  heroKpiIntentValue: string;
  heroKpiUrgencyLabel: string;
  heroKpiUrgencyValue: string;
  heroRecommendedContinuation: string;
  demoTitle: string;
  demoDescription: string;
  demoTranscriptHeading: string;
  demoStructuredHeading: string;
  demoStructuredSample: string;
  featuresTitle: string;
  featuresDescription: string;
  howTitle: string;
  howDescription: string;
  howStepLabel: string;
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

const uiHeroDemoEn = {
  heroSampleTranscript:
    "\"My package still has not arrived for three days, please check urgently.\"",
  heroKpiLangLabel: "Language",
  heroKpiLangValue: "English",
  heroKpiIntentLabel: "Intent",
  heroKpiIntentValue: "Delivery complaint",
  heroKpiUrgencyLabel: "Urgency",
  heroKpiUrgencyValue: "High (0.91)",
  heroRecommendedContinuation: "Escalate to logistics support and notify assigned agent.",
  demoTranscriptHeading: "Transcript",
  demoStructuredHeading: "Structured output",
  demoStructuredSample: "intent: delivery_complaint | sentiment: frustrated | priority: high",
  howStepLabel: "Step",
};

const uiHeroDemoSi = {
  heroSampleTranscript:
    "\"මගේ පැකේජය දින තුනක් තිස්සේ තවමත් නොලැබුණා, කරුණාකර හදිසියෙන් පරීක්ෂා කරන්න.\"",
  heroKpiLangLabel: "භාෂාව",
  heroKpiLangValue: "ඉංග්‍රීසි",
  heroKpiIntentLabel: "කරුණ",
  heroKpiIntentValue: "බෙදාහැරීම් පැමිණිල්ල",
  heroKpiUrgencyLabel: "හදිසිත්වය",
  heroKpiUrgencyValue: "ඉහළ (0.91)",
  heroRecommendedContinuation: "ලොජිස්ටික් සහායට උසස් කර පවරන නියෝජිතයාට දැනුම් දෙන්න.",
  demoTranscriptHeading: "පිටපත",
  demoStructuredHeading: "ව්‍යුහගත ප්‍රතිදානය",
  demoStructuredSample: "කරුණ: බෙදාහැරීම්_පැමිණිල්ල | හැඟීම්: කලකිරීම | ප්‍රමුඛත්වය: ඉහළ",
  howStepLabel: "පියවර",
};

const uiHeroDemoTa = {
  heroSampleTranscript:
    "\"என் பார்சல் மூன்று நாட்களாக வரவில்லை, தயவுசெய்து அவசரமாக சரிபார்க்கவும்.\"",
  heroKpiLangLabel: "மொழி",
  heroKpiLangValue: "ஆங்கிலம்",
  heroKpiIntentLabel: "நோக்கம்",
  heroKpiIntentValue: "விநியோகப் புகார்",
  heroKpiUrgencyLabel: "அவசரம்",
  heroKpiUrgencyValue: "அதிகம் (0.91)",
  heroRecommendedContinuation: "போக்குவரத்து ஆதரவுக்கு உயர்த்தி, ஒதுக்கப்பட்ட முகவருக்கு அறிவி.",
  demoTranscriptHeading: "உரை",
  demoStructuredHeading: "கட்டமைக்கப்பட்ட வெளியீடு",
  demoStructuredSample: "நோக்கம்: விநியோக_புகார் | உணர்வு: விரக்தி | முன்னுரிமை: அதிகம்",
  howStepLabel: "படி",
};

const marketingContentByLanguage: Record<AppLanguage, MarketingContent> = {
  en: {
    heroBadge: "Voice AI for Support Ops",
    heroTitle: "Convert multilingual voice complaints into structured business actions.",
    heroSubtitle:
      "Voice2Action turns English, Sinhala, Tamil, and mixed voice messages into tickets that understand intent, route by urgency, and feed operational analytics.",
    heroPrimaryCta: "Start Free Trial",
    heroSecondaryCta: "Explore Features",
    incomingVoiceLabel: "Incoming voice",
    recommendedActionPrefix: "Recommended action:",
    ...uiHeroDemoEn,
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
    heroBadge: "සහාය මෙහෙයුම් සඳහා හඬ බුද්ධිය",
    heroTitle: "බහුභාෂා හඬ පැමිණිලි ව්‍යුහගත ව්‍යාපාරික ක්‍රියාවන් බවට පරිවර්තනය කරන්න.",
    heroSubtitle:
      "Voice2Action හරහා ඉංග්‍රීසි, සිංහල, දමිළ සහ මිශ්‍ර හඬ පණිවිඩ කරුණ තේරෙන ටිකට්, හදිසි මාරුව සහ මෙහෙයුම් විශ්ලේෂණය බවට පත් වේ.",
    heroPrimaryCta: "නොමිලේ ආරම්භ කරන්න",
    heroSecondaryCta: "විශේෂාංග බලන්න",
    incomingVoiceLabel: "ලැබුණු හඬ",
    recommendedActionPrefix: "නිර්දේශිත ක්‍රියාව:",
    ...uiHeroDemoSi,
    demoTitle: "සජීවී ක්‍රියාවලි සාක්ෂිකරණය",
    demoDescription: "හඬ ප්‍රවේශයෙන් පසුව ක්‍රියාමය, ව්‍යුහගත ප්‍රතිදානයක්.",
    featuresTitle: "ප්‍රධාන විශේෂාංග",
    featuresDescription: "පරිමාණය හසුරු කරන පාරිභෝගික සහාය කණ්ඩායම් සඳහා.",
    howTitle: "එය ක්‍රියා කරන ආකාරය",
    howDescription: "හඬ සිට ක්‍රියාව දක්වා පියවර හතරයි.",
    trustedTitle: "සහාය කණ්ඩායම් විශ්වාස කරන විසඳුම",
    trustedDescription: "ඉහළ පැමිණිලි ප්‍රමාණ හසුරු කරන කණ්ඩායම් විසින් සැබෑ වෙනස්කම්.",
    pricingTitle: "සරල මිල සැලසුම්",
    pricingDescription: "ඔබගේ සහාය මෙහෙයුම සමඟ වර්ධනය වන සැලසුම්.",
    faqTitle: "නිතර අසන ප්‍රශ්න",
    faqDescription: "යාමට පෙර අවශ්‍ය දැනුම් සම්පූර්ණයෙන්ම.",
    ctaTitle: "හඬ පැමිණිලි මැනිය හැකි සහාය ප්‍රතිපල බවට පත් කරන්න ද?",
    ctaDescription:
      "Voice2Action හරහා බහුභාෂා ස්මාර්ත්ව බුද්ධියෙන් ක්‍රියාවලි ස්වයංක්‍රීය කිරීම් ඔබගේ කණ්ඩායමට ගෙන එන්න.",
    ctaButton: "දැන් නිර්මාණය ආරම්භ කරන්න",
    stats: statsSi,
    coreFeatures: coreFeaturesSi,
    howItWorks: howItWorksSi,
    testimonials: testimonialsSi,
    pricingPlans: pricingPlansSi,
    faqs: faqsSi,
  },
  ta: {
    heroBadge: "ஆதரவு செயல்பாட்டுக்கான குரல் அறிவுத் தொழில்",
    heroTitle: "பலமொழிக் குரல்ப் புகார்களைக் கட்டமைக்கப்பட்ட தொழில்முறைச் செயல்களாக மாற்றுக.",
    heroSubtitle:
      "Voice2Action ஆங்கிலம், சிங்களம், தமிழ் மற்றும் கலப்புக் குரல்களையும் நோக்கம் புரியும் சீட்டுகளாகவும் அவசர வழிகாட்டலாகவும் செயல்பாட்டுப் பகுப்பாய்வுக்கும் மாற்றுகிறது.",
    heroPrimaryCta: "இலவசமாக தொடங்குக",
    heroSecondaryCta: "அம்சங்களைப் பார்",
    incomingVoiceLabel: "வரும் குரல்",
    recommendedActionPrefix: "பரிந்துரைக்கப்பட்ட செயல்:",
    ...uiHeroDemoTa,
    demoTitle: "நேரடி வேலைநெறி செயல்விளக்கம்",
    demoDescription: "குரல் உள்ளே, கட்டமைக்கப்பட்ட செயல் வெளியே.",
    featuresTitle: "முக்கிய அம்சங்கள்",
    featuresDescription: "அளவான வாடிக்கையாளர் ஆதரவுக் குழுக்களுக்கு.",
    howTitle: "இது எவ்வாறு செயல்படுகிறது",
    howDescription: "குரலிலிருந்து செயலுக்கு நான்கு படிகள்.",
    trustedTitle: "ஆதரவு அணிகளால் நம்பப்படும் தளம்",
    trustedDescription: "உயர் புகார் பேரத்தைத் தாங்கும் அணிகளின் நியாயமான பயன்.",
    pricingTitle: "எளிய விலைத் திட்டங்கள்",
    pricingDescription: "உங்கள் ஆதரவுச் செயற்பாடு வளர்வதற்கேற்ப வளரும் திட்டங்கள்.",
    faqTitle: "அடிக்கடி கேட்கப்படும் கேள்விகள்",
    faqDescription: "தொடங்கும் முன் தேவையான அனைத்தும்.",
    ctaTitle: "குரல் புகார்களை அளவுமுடியும் ஆதரவு விளைவுகளாக மாற்றத் தயாரா?",
    ctaDescription:
      "Voice2Action உடன் பலமொழிக் குரல் நுண்ணறிவு சார்ந்த வேலைநெறித் தானியங்குகளை உங்கள் அணிக்குக் கொண்டு வாருங்கள்.",
    ctaButton: "உருவாக்கம் தொடங்கு",
    stats: statsTa,
    coreFeatures: coreFeaturesTa,
    howItWorks: howItWorksTa,
    testimonials: testimonialsTa,
    pricingPlans: pricingPlansTa,
    faqs: faqsTa,
  },
};

export function getMarketingContent(language: AppLanguage) {
  return marketingContentByLanguage[language] ?? marketingContentByLanguage.en;
}
