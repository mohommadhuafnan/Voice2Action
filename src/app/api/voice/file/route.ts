import { readFile } from "fs/promises";
import { extname, join } from "path";
import { NextResponse } from "next/server";

const MIME_BY_EXT: Record<string, string> = {
  ".webm": "audio/webm",
  ".wav": "audio/wav",
  ".mp3": "audio/mpeg",
  ".m4a": "audio/mp4",
  ".ogg": "audio/ogg",
  ".flac": "audio/flac",
};

export async function GET(request: Request) {
  const url = new URL(request.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return NextResponse.json({ error: "Missing key query parameter." }, { status: 400 });
  }

  const decodedKey = decodeURIComponent(key);
  const filePath = join(process.cwd(), ".uploads", decodedKey);

  try {
    const file = await readFile(filePath);
    const ext = extname(decodedKey).toLowerCase();
    const mimeType = MIME_BY_EXT[ext] ?? "application/octet-stream";

    return new NextResponse(file, {
      status: 200,
      headers: {
        "Content-Type": mimeType,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Audio file not found." }, { status: 404 });
  }
}
