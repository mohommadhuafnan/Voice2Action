import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import { dirname, join } from "path";

type StoredAudio = {
  storageProvider: string;
  storageKey: string;
  publicUrl: string;
};

export async function storeAudioFile(file: File, userId: string): Promise<StoredAudio> {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const bucket = process.env.SUPABASE_STORAGE_BUCKET ?? "voice-uploads";

  const ext = file.name.split(".").pop() ?? "webm";
  const objectKey = `voice/${userId}/${Date.now()}-${randomUUID()}.${ext}`;

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
  const localPath = join(process.cwd(), ".uploads", objectKey);
  await mkdir(dirname(localPath), { recursive: true });
  await writeFile(localPath, Buffer.from(arrayBuffer));

  return {
    storageProvider: "local",
    storageKey: objectKey,
    publicUrl: `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000"}/api/voice/file?key=${encodeURIComponent(objectKey)}`,
  };
}
