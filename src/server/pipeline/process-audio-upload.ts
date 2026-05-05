import {
  AnalysisStatus,
  Prisma,
  TicketPriority,
} from "@prisma/client";
import { db } from "@/server/db/client";
import { analyzeTextViaValsea, transcribeAudioViaValsea } from "@/lib/ai/valsea-client";
import { detectLanguageFromText } from "@/lib/ai/heuristic-nlp";
import { createAutomatedTicket } from "@/server/services/ticket-automation";
import type { PipelineResult } from "@/types/ai";

function isFallbackTranscription(rawResponse: unknown): boolean {
  if (!rawResponse || typeof rawResponse !== "object") {
    return false;
  }

  const provider = (rawResponse as { provider?: unknown }).provider;
  return provider === "mock" || provider === "fallback";
}

function getFallbackErrorReason(rawResponse: unknown): string {
  if (!rawResponse || typeof rawResponse !== "object") {
    return "VALSEA transcription unavailable. Please verify API key and endpoint.";
  }

  const reason = (rawResponse as { reason?: unknown }).reason;
  if (typeof reason !== "string") {
    return "VALSEA transcription unavailable. Please verify API key and endpoint.";
  }

  if (reason.includes("status_401")) {
    return "VALSEA authentication failed (401). Please use a valid active API key.";
  }

  if (reason.includes("source_audio_unreachable_status_404")) {
    return "Uploaded audio file is not reachable (404). Please re-upload the audio and run pipeline again.";
  }

  if (reason.includes("source_audio_fetch_failed")) {
    return "Could not fetch uploaded audio for transcription. Please re-upload and try again.";
  }

  if (reason.includes("status_404")) {
    return "VALSEA endpoint not found (404). Please verify VALSEA_API_URL.";
  }

  return `VALSEA transcription unavailable (${reason}).`;
}

function mapPriority(priority: string): TicketPriority {
  if (priority === "CRITICAL") return TicketPriority.CRITICAL;
  if (priority === "HIGH") return TicketPriority.HIGH;
  if (priority === "MEDIUM") return TicketPriority.MEDIUM;
  return TicketPriority.LOW;
}

function getTranscriptHintFromUploadWaveform(waveform: unknown): string | null {
  if (!waveform || typeof waveform !== "object") {
    return null;
  }
  const transcriptHint = (waveform as { transcriptHint?: unknown }).transcriptHint;
  if (typeof transcriptHint !== "string") {
    return null;
  }
  const trimmed = transcriptHint.trim();
  return trimmed.length > 0 ? trimmed : null;
}

export async function processAudioUpload(
  audioUploadId: string,
  languageHint: "auto" | "english" | "sinhala" | "tamil" = "auto",
): Promise<PipelineResult> {
  const upload = await db.audioUpload.findUnique({
    where: { id: audioUploadId },
    include: {
      user: true,
      ticket: true,
    },
  });

  if (!upload) {
    throw new Error("Audio upload not found.");
  }

  const transcriptHint = getTranscriptHintFromUploadWaveform(upload.waveform);

  const existingAnalysis = await db.aiAnalysis.findFirst({
    where: { audioUploadId: upload.id, status: AnalysisStatus.COMPLETED },
    orderBy: { createdAt: "desc" },
  });

  if (
    existingAnalysis &&
    upload.ticketId &&
    !isFallbackTranscription(
      (existingAnalysis.rawResponse as { transcription?: unknown } | null)?.transcription,
    )
  ) {
    return {
      transcript: existingAnalysis.transcript,
      language: existingAnalysis.language,
      intent: existingAnalysis.intent,
      sentiment: existingAnalysis.sentiment,
      urgencyScore: existingAnalysis.urgencyScore,
      priority: existingAnalysis.priority,
      entities: existingAnalysis.entities as Record<string, string>,
      recommendedAction: existingAnalysis.recommendedAction,
      ticketId: upload.ticketId,
      audioUploadId: upload.id,
    };
  }

  try {
    let transcriptData = await transcribeAudioViaValsea(
      upload.publicUrl ??
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/mock-audio/${upload.storageKey}`,
      languageHint,
    );

    if (isFallbackTranscription(transcriptData.rawResponse)) {
      if (transcriptHint) {
        transcriptData = {
          transcript: transcriptHint,
          language: detectLanguageFromText(transcriptHint),
          confidence: 0.6,
          rawResponse: {
            provider: "browser-live",
            reason: "used_transcript_hint",
          },
        };
      } else {
        throw new Error(getFallbackErrorReason(transcriptData.rawResponse));
      }
    }

    const analysis = await analyzeTextViaValsea({
      transcript: transcriptData.transcript,
      detectedLanguage: transcriptData.language,
    });

    const automatedTicket = await createAutomatedTicket({
      reporterId: upload.userId,
      transcript: transcriptData.transcript,
      language: analysis.language,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      urgencyScore: analysis.urgency_score,
      priority: mapPriority(analysis.priority),
      recommendedAction: analysis.recommended_action,
      entities: analysis.entities,
    });

    await db.audioUpload.update({
      where: { id: audioUploadId },
      data: {
        ticketId: automatedTicket.id,
      },
    });

    await db.aiAnalysis.create({
      data: {
        ticketId: automatedTicket.id,
        audioUploadId: upload.id,
        status: AnalysisStatus.COMPLETED,
        transcript: analysis.transcript,
        language: analysis.language,
        intent: analysis.intent,
        sentiment: analysis.sentiment,
        urgencyScore: analysis.urgency_score,
        priority: mapPriority(analysis.priority),
        entities: analysis.entities as Prisma.InputJsonValue,
        confidence: analysis.confidence,
        modelVersion: analysis.model_version,
        rawResponse: {
          transcription: transcriptData.rawResponse,
          nlp: analysis,
        } as Prisma.InputJsonValue,
        recommendedAction: analysis.recommended_action,
        processedAt: new Date(),
      },
    });

    await db.activityLog.create({
      data: {
        actorId: upload.userId,
        ticketId: automatedTicket.id,
        action: "ANALYSIS_COMPLETED",
        targetType: "AiAnalysis",
        targetId: upload.id,
        summary: "AI pipeline completed and ticket workflow was triggered.",
      },
    });

    return {
      transcript: analysis.transcript,
      language: analysis.language,
      intent: analysis.intent,
      sentiment: analysis.sentiment,
      urgencyScore: analysis.urgency_score,
      priority: analysis.priority,
      entities: analysis.entities,
      recommendedAction: analysis.recommended_action,
      ticketId: automatedTicket.id,
      audioUploadId: upload.id,
    };
  } catch (error) {
    if (upload.ticketId) {
      await db.aiAnalysis.create({
        data: {
          ticketId: upload.ticketId,
          audioUploadId: upload.id,
          status: AnalysisStatus.FAILED,
          transcript: "",
          language: "Unknown",
          intent: "analysis_failed",
          sentiment: "unknown",
          urgencyScore: 0,
          priority: TicketPriority.LOW,
          entities: {} as Prisma.InputJsonValue,
          recommendedAction: "manual_review_required",
          errorMessage: error instanceof Error ? error.message : "AI pipeline failed.",
        },
      });
    }
    throw error;
  }
}
