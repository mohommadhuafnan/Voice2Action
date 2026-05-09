import { aiStructuredOutputSchema, type AIStructuredOutput, type AnalyzeTextInput, type TranscriptionResult } from "@/lib/ai/types";
import { detectLanguageFromText, runHeuristicNlp } from "@/lib/ai/heuristic-nlp";

function mapLanguageToValsea(language: string): string {
  const normalized = language.trim().toLowerCase();
  if (normalized === "auto") return "english";
  if (normalized.includes("sinhala") || normalized === "si") return "sinhala";
  if (normalized.includes("tamil") || normalized === "ta") return "tamil";
  if (normalized.includes("mixed")) return "english";
  return "english";
}

function languageNeedsTranslation(language: string): boolean {
  const normalized = language.trim().toLowerCase();
  return normalized.includes("sinhala") || normalized === "si" || normalized.includes("tamil") || normalized === "ta";
}

/** Translate UI or other English copy into Tamil or Sinhala using ValSea `/v1/translate`. */
export async function translateEnglishToValseaTarget(
  input: string,
  targetLanguage: "sinhala" | "tamil",
): Promise<string> {
  const apiUrl = process.env.VALSEA_API_URL;
  const apiKey = process.env.VALSEA_API_KEY;
  if (!apiUrl || !apiKey || !input.trim()) {
    return input;
  }
  const base = apiUrl.replace(/\/$/, "");
  try {
    const response = await fetch(`${base}/v1/translate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "valsea-translate",
        text: input,
        source_language: "english",
        target_language: targetLanguage,
      }),
    });
    if (!response.ok) {
      return input;
    }
    const json = (await response.json()) as {
      translated_text?: string;
      text?: string;
      translation?: string;
    };
    const translated = json.translated_text ?? json.text ?? json.translation;
    return translated && translated.trim().length > 0 ? translated : input;
  } catch {
    return input;
  }
}

async function translateToEnglishViaValsea(input: string, sourceLanguage: string): Promise<string> {
  const apiUrl = process.env.VALSEA_API_URL;
  const apiKey = process.env.VALSEA_API_KEY;

  if (!apiUrl || !apiKey || !languageNeedsTranslation(sourceLanguage)) {
    return input;
  }

  const base = apiUrl.replace(/\/$/, "");

  try {
    const response = await fetch(`${base}/v1/translate`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "valsea-translate",
        text: input,
        source_language: mapLanguageToValsea(sourceLanguage),
        target_language: "english",
      }),
    });

    if (!response.ok) {
      return input;
    }

    const json = (await response.json()) as {
      translated_text?: string;
      text?: string;
      translation?: string;
    };

    const translated = json.translated_text ?? json.text ?? json.translation;
    return translated && translated.trim().length > 0 ? translated : input;
  } catch {
    return input;
  }
}

export async function transcribeAudioViaValsea(
  audioUrl: string,
  languageHint: "auto" | "english" | "sinhala" | "tamil" = "auto",
): Promise<TranscriptionResult> {
  const apiUrl = process.env.VALSEA_API_URL;
  const apiKey = process.env.VALSEA_API_KEY;

  if (!apiUrl || !apiKey) {
    const fallbackText = "My package still has not arrived, three days now, please check urgently.";
    return {
      transcript: fallbackText,
      language: detectLanguageFromText(fallbackText),
      confidence: 0.72,
      rawResponse: { provider: "mock" },
    };
  }

  const base = apiUrl.replace(/\/$/, "");
  const candidatePaths = ["/v1/audio/transcriptions"];
  let json: {
    transcript?: string;
    text?: string;
    language?: string;
    confidence?: number;
  } | null = null;
  let lastStatus: number | null = null;
  let lastReason: string | null = null;

  for (const path of candidatePaths) {
    let response: Response | null = null;

    if (path === "/v1/audio/transcriptions") {
      try {
        const audioResponse = await fetch(audioUrl);
        if (!audioResponse.ok) {
          lastStatus = audioResponse.status;
          lastReason = "source_audio_unreachable";
          continue;
        }

        const audioBlob = await audioResponse.blob();
        const formData = new FormData();
        formData.append("file", audioBlob, "complaint-audio.webm");
        formData.append("model", "valsea-transcribe");
        formData.append("language", mapLanguageToValsea(languageHint));
        formData.append("response_format", "json");
        formData.append("enable_correction", "true");
        formData.append("enable_tags", "true");

        response = await fetch(`${base}${path}`, {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
          },
          body: formData,
        });
      } catch {
        lastReason = "source_audio_fetch_failed";
        continue;
      }
    }

    if (!response || !response.ok) {
      lastStatus = response?.status ?? lastStatus;
      lastReason = "valsea_stt_http_error";
      continue;
    }

    json = (await response.json()) as {
      transcript?: string;
      text?: string;
      language?: string;
      confidence?: number;
    };
    break;
  }

  if (!json) {
    const fallbackText = "Voice complaint received. Automatic transcription is currently unavailable.";
    return {
      transcript: fallbackText,
      language: detectLanguageFromText(fallbackText),
      confidence: 0.4,
      rawResponse: {
        provider: "fallback",
        reason: `${lastReason ?? "valsea_stt_unavailable"}${lastStatus ? `_status_${lastStatus}` : ""}`,
        audioUrl,
      },
    };
  }

  const transcript = json.transcript ?? json.text ?? "";

  if (!transcript) {
    const fallbackText = "Voice complaint received. Automatic transcription returned empty content.";
    return {
      transcript: fallbackText,
      language: detectLanguageFromText(fallbackText),
      confidence: 0.35,
      rawResponse: {
        provider: "fallback",
        reason: "valsea_stt_empty_transcript",
        audioUrl,
      },
    };
  }

  const language =
    json.language?.toLowerCase() === "si"
      ? "Sinhala"
      : json.language?.toLowerCase() === "ta"
        ? "Tamil"
        : json.language?.toLowerCase() === "mixed"
          ? "Mixed"
          : detectLanguageFromText(transcript);

  return {
    transcript,
    language,
    confidence: json.confidence,
    rawResponse: json,
  };
}

export async function analyzeTextViaValsea(input: AnalyzeTextInput): Promise<AIStructuredOutput> {
  const apiUrl = process.env.VALSEA_API_URL;
  const apiKey = process.env.VALSEA_API_KEY;

  if (!apiUrl || !apiKey) {
    return runHeuristicNlp(input.transcript, input.detectedLanguage);
  }

  const base = apiUrl.replace(/\/$/, "");
  const translatedTranscript = await translateToEnglishViaValsea(input.transcript, input.detectedLanguage);
  const analysisText = translatedTranscript || input.transcript;
  const fallbackBase = runHeuristicNlp(analysisText, input.detectedLanguage);
  const fallback = aiStructuredOutputSchema.parse({
    ...fallbackBase,
    transcript: input.transcript,
    translated_transcript: translatedTranscript !== input.transcript ? translatedTranscript : undefined,
    entities: {
      ...fallbackBase.entities,
      source_language: input.detectedLanguage,
    },
    summary: `Complaint intent: ${fallbackBase.intent}. Priority: ${fallbackBase.priority}.`,
  });

  // Try legacy structured endpoint if available for this account/version.
  const legacyResponse = await fetch(`${base}/analyze-text`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      text: analysisText,
      language_hint: input.detectedLanguage,
      tasks: ["intent", "sentiment", "urgency", "entities", "recommended_action"],
      output_format: "voice2action_v1",
    }),
  });

  if (legacyResponse.ok) {
    const json = await legacyResponse.json();
    const parsed = aiStructuredOutputSchema.safeParse({
      ...json,
      transcript: input.transcript,
      translated_transcript: translatedTranscript !== input.transcript ? translatedTranscript : undefined,
      entities: {
        ...((json as { entities?: Record<string, string> }).entities ?? {}),
        source_language: input.detectedLanguage,
      },
      summary:
        (json as { summary?: string }).summary ??
        `Complaint intent: ${(json as { intent?: string }).intent ?? "general_complaint"}. Priority: ${(json as { priority?: string }).priority ?? "MEDIUM"}.`,
    });
    if (parsed.success) {
      return parsed.data;
    }
  }

  // Fallback to documented sentiment endpoint and enrich heuristic output.
  const sentimentResponse = await fetch(`${base}/v1/sentiment`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "valsea-sentiment",
      transcript: analysisText,
      language: mapLanguageToValsea(input.detectedLanguage),
      response_format: "json",
    }),
  });

  if (!sentimentResponse.ok) {
    return fallback;
  }

  const sentimentJson = (await sentimentResponse.json()) as {
    sentiment?: string;
    label?: string;
    polarity?: string;
  };

  const providerSentiment =
    sentimentJson.sentiment ?? sentimentJson.label ?? sentimentJson.polarity;

  if (!providerSentiment || typeof providerSentiment !== "string") {
    return fallback;
  }

  return aiStructuredOutputSchema.parse({
    ...fallback,
    sentiment: providerSentiment.toLowerCase(),
    summary: fallback.summary ?? `Complaint intent: ${fallback.intent}. Priority: ${fallback.priority}.`,
  });
}
