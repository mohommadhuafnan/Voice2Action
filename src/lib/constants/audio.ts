export const AUDIO_MIME_TYPES = [
  "audio/webm",
  "audio/wav",
  "audio/mpeg",
  "audio/mp3",
  "audio/ogg",
  "audio/mp4",
] as const;

export const MAX_AUDIO_UPLOAD_SIZE_BYTES = 20 * 1024 * 1024;

export const MEDIA_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "video/mp4",
  "video/webm",
  "video/ogg",
] as const;

export const MAX_MEDIA_UPLOAD_SIZE_BYTES = 30 * 1024 * 1024;
