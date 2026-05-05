import { z } from "zod";
import { AUDIO_MIME_TYPES, MAX_AUDIO_UPLOAD_SIZE_BYTES } from "@/lib/constants/audio";

export const audioUploadSchema = z.object({
  source: z.enum(["BROWSER_RECORDING", "FILE_UPLOAD"]),
  durationSec: z.coerce.number().int().min(1).max(1200).optional(),
  waveform: z.string().optional(),
  transcriptHint: z.string().trim().max(6000).optional(),
});

export function validateAudioFile(file: File) {
  const normalizedMimeType = file.type.split(";")[0]?.trim().toLowerCase();

  if (!normalizedMimeType || !AUDIO_MIME_TYPES.includes(normalizedMimeType as (typeof AUDIO_MIME_TYPES)[number])) {
    throw new Error("Unsupported audio format.");
  }

  if (file.size > MAX_AUDIO_UPLOAD_SIZE_BYTES) {
    throw new Error("Audio exceeds 20MB upload limit.");
  }
}
