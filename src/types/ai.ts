import { z } from "zod";

export type LanguageCode = "en" | "si" | "ta" | "mixed";

export const pipelineResultSchema = z.object({
  transcript: z.string(),
  translatedTranscript: z.string().optional(),
  language: z.string(),
  intent: z.string(),
  sentiment: z.string(),
  urgencyScore: z.number().min(0).max(1),
  priority: z.enum(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  entities: z.record(z.string(), z.string()),
  recommendedAction: z.string(),
  summary: z.string().optional(),
  ticketId: z.string(),
  audioUploadId: z.string(),
});

export type PipelineResult = z.infer<typeof pipelineResultSchema>;
