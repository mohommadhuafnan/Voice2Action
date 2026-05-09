import { z } from "zod";
import {
  AUDIO_MIME_TYPES,
  MAX_AUDIO_UPLOAD_SIZE_BYTES,
  MAX_MEDIA_UPLOAD_SIZE_BYTES,
  MEDIA_MIME_TYPES,
} from "@/lib/constants/audio";

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

export function validateMediaFile(file: File) {
  const normalizedMimeType = file.type.split(";")[0]?.trim().toLowerCase();

  if (!normalizedMimeType || !MEDIA_MIME_TYPES.includes(normalizedMimeType as (typeof MEDIA_MIME_TYPES)[number])) {
    throw new Error("Unsupported media format. Use JPG/PNG/WEBP or MP4/WEBM/OGG.");
  }

  if (file.size > MAX_MEDIA_UPLOAD_SIZE_BYTES) {
    throw new Error("Media exceeds 30MB upload limit.");
  }
}
