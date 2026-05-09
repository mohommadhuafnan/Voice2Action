import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { storeEvidenceFile } from "@/lib/storage/audio-storage";
import { validateMediaFile } from "@/lib/validators/audio";
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
    const file = formData.get("media");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Media file is required." }, { status: 400 });
    }

    validateMediaFile(file);
    const stored = await storeEvidenceFile(file, user.id);

    return NextResponse.json(
      {
        media: {
          fileName: file.name,
          mimeType: file.type,
          sizeBytes: file.size,
          storageKey: stored.storageKey,
          publicUrl: stored.publicUrl,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Media upload failed.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
