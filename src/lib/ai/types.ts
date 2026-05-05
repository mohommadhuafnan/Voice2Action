import { z } from "zod";

export const aiStructuredOutputSchema = z.object({
  transcript: z.string().min(1),
  language: z.string().min(1),
  intent: z.string().min(1),
  sentiment: z.string().min(1),
  urgency_score: z.number().min(0).max(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  entities: z.record(z.string(), z.string()),
  recommended_action: z.string().min(1),
  confidence: z.number().min(0).max(1).optional(),
  model_version: z.string().optional(),
});

export type AIStructuredOutput = z.infer<typeof aiStructuredOutputSchema>;

export type TranscriptionResult = {
  transcript: string;
  language: "English" | "Sinhala" | "Tamil" | "Mixed";
  confidence?: number;
  rawResponse?: unknown;
};

export type AnalyzeTextInput = {
  transcript: string;
  detectedLanguage: string;
};
