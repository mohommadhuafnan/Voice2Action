import { aiStructuredOutputSchema, type AIStructuredOutput } from "@/lib/ai/types";

const INTENT_PATTERNS: Array<{ pattern: RegExp; intent: string; issue: string; category: string }> = [
  { pattern: /(deliver|package|courier|arrive|shipment)/i, intent: "delivery_complaint", issue: "package delay", category: "delivery" },
  { pattern: /(bill|invoice|charge|payment|refund)/i, intent: "billing_dispute", issue: "billing mismatch", category: "billing" },
  { pattern: /(login|password|otp|app|error|bug|crash)/i, intent: "technical_issue", issue: "application issue", category: "technical" },
  { pattern: /(account|profile|verify|verification|blocked)/i, intent: "account_access_issue", issue: "account access", category: "account" },
];

export function detectLanguageFromText(input: string): "English" | "Sinhala" | "Tamil" | "Mixed" {
  const hasSinhala = /[\u0D80-\u0DFF]/.test(input);
  const hasTamil = /[\u0B80-\u0BFF]/.test(input);
  const hasLatin = /[A-Za-z]/.test(input);

  const count = [hasSinhala, hasTamil, hasLatin].filter(Boolean).length;

  if (count > 1) {
    return "Mixed";
  }

  if (hasSinhala) {
    return "Sinhala";
  }

  if (hasTamil) {
    return "Tamil";
  }

  return "English";
}

export function runHeuristicNlp(transcript: string, detectedLanguage: string): AIStructuredOutput {
  const lowered = transcript.toLowerCase();

  const matched =
    INTENT_PATTERNS.find((item) => item.pattern.test(transcript)) ??
    ({ intent: "general_complaint", issue: "service complaint", category: "other" } as const);

  const urgencyKeywords = ["urgent", "immediately", "asap", "quickly", "today", "immediate"];
  const frustrationKeywords = ["frustrat", "angry", "upset", "still", "not", "delay", "failed"];

  const urgencyHits = urgencyKeywords.filter((token) => lowered.includes(token)).length;
  const frustrationHits = frustrationKeywords.filter((token) => lowered.includes(token)).length;

  const urgencyScore = Math.min(0.98, Number((0.35 + urgencyHits * 0.2 + frustrationHits * 0.08).toFixed(2)));

  const priority = urgencyScore > 0.85 ? "CRITICAL" : urgencyScore > 0.7 ? "HIGH" : urgencyScore > 0.5 ? "MEDIUM" : "LOW";

  const sentiment = frustrationHits >= 3 ? "frustrated" : frustrationHits >= 1 ? "concerned" : "neutral";

  const durationMatch = transcript.match(/(\d+\s*(day|days|hour|hours|week|weeks))/i);

  const entities: Record<string, string> = {
    issue_type: matched.issue,
    category: matched.category,
  };

  if (durationMatch?.[1]) {
    entities.duration = durationMatch[1];
  }

  const payload = {
    transcript,
    language: detectedLanguage,
    intent: matched.intent,
    sentiment,
    urgency_score: urgencyScore,
    priority,
    entities,
    recommended_action: priority === "CRITICAL" || priority === "HIGH" ? "escalate_to_support" : "assign_standard_queue",
    confidence: 0.76,
    model_version: "voice2action-heuristic-v1",
  } satisfies AIStructuredOutput;

  return aiStructuredOutputSchema.parse(payload);
}
