import { randomUUID } from "crypto";
import { putBinaryFile } from "@/server/db/mongo-binary";

type StoredAudio = {
  storageProvider: string;
  storageKey: string;
  publicUrl: string;
};

async function storeBinaryFile(file: File, userId: string, folder: "voice" | "evidence"): Promise<StoredAudio> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "voice-uploads";

  const ext = file.name.split(".").pop() ?? "webm";
  const objectKey = `${folder}/${userId}/${Date.now()}-${randomUUID()}.${ext}`;

  if (supabaseUrl && serviceRoleKey) {
    const arrayBuffer = await file.arrayBuffer();
    const uploadUrl = `${supabaseUrl}/storage/v1/object/${bucket}/${objectKey}`;

    const response = await fetch(uploadUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        "Content-Type": file.type || "application/octet-stream",
        "x-upsert": "false",
      },
      body: Buffer.from(arrayBuffer),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Supabase upload failed: ${errorText}`);
    }

    const publicUrl = `${supabaseUrl}/storage/v1/object/public/${bucket}/${objectKey}`;

    return {
      storageProvider: "supabase",
      storageKey: objectKey,
      publicUrl,
    };
  }

  const arrayBuffer = await file.arrayBuffer();
  await putBinaryFile({
    key: objectKey,
    contentType: file.type || "application/octet-stream",
    payload: Buffer.from(arrayBuffer),
  });

  return {
    storageProvider: "mongodb",
    storageKey: objectKey,
    publicUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/voice/file?key=${encodeURIComponent(objectKey)}`,
  };
}

export async function storeAudioFile(file: File, userId: string): Promise<StoredAudio> {
  return storeBinaryFile(file, userId, "voice");
}

export async function storeEvidenceFile(file: File, userId: string): Promise<StoredAudio> {
  return storeBinaryFile(file, userId, "evidence");
}
