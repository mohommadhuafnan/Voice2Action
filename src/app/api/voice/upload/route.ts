import { auth } from "@clerk/nextjs/server";
import { Prisma } from "@prisma/client";
import { NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { storeAudioFile } from "@/lib/storage/audio-storage";
import { audioUploadSchema, validateAudioFile } from "@/lib/validators/audio";
import { getUserByClerkId } from "@/server/services/ticket-automation";

export async function POST(request: Request) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const user = await getUserByClerkId(userId);

    if (!user) {
      return NextResponse.json({ error: "Authenticated user record not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const file = formData.get("audio");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Audio file is required." }, { status: 400 });
    }

    validateAudioFile(file);

    const parsed = audioUploadSchema.safeParse({
      source: formData.get("source"),
      durationSec: formData.get("durationSec"),
      waveform: formData.get("waveform"),
      transcriptHint: formData.get("transcriptHint"),
    });

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid upload payload." }, { status: 400 });
    }

    let waveformData: Prisma.InputJsonValue | null = null;

    if (parsed.data.waveform) {
      try {
        waveformData = JSON.parse(parsed.data.waveform) as Prisma.InputJsonValue;
      } catch {
        return NextResponse.json({ error: "Invalid waveform payload." }, { status: 400 });
      }
    }

    const transcriptHint = parsed.data.transcriptHint?.trim();

    const uploadMetadata: Prisma.InputJsonValue | null =
      transcriptHint && waveformData
        ? ({
            peaks: waveformData,
            transcriptHint,
          } as Prisma.InputJsonValue)
        : transcriptHint
          ? ({
              transcriptHint,
            } as Prisma.InputJsonValue)
          : waveformData;

    const stored = await storeAudioFile(file, user.id);

    const upload = await db.audioUpload.create({
      data: {
        userId: user.id,
        source: parsed.data.source,
        fileName: file.name,
        mimeType: file.type,
        sizeBytes: file.size,
        durationSec: parsed.data.durationSec,
        storageProvider: stored.storageProvider,
        storageKey: stored.storageKey,
        publicUrl: stored.publicUrl,
        waveform: uploadMetadata,
      },
      select: {
        id: true,
        fileName: true,
        source: true,
        uploadedAt: true,
        durationSec: true,
        publicUrl: true,
      },
    });

    return NextResponse.json({ upload }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
