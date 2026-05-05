import { unlink } from "fs/promises";
import { join } from "path";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ uploadId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const { uploadId } = await params;

  const upload = await db.audioUpload.findUnique({
    where: { id: uploadId },
    select: {
      id: true,
      userId: true,
      storageProvider: true,
      storageKey: true,
    },
  });

  if (!upload || upload.userId !== user.id) {
    return NextResponse.json({ error: "Audio upload not found." }, { status: 404 });
  }

  await db.audioUpload.delete({
    where: { id: upload.id },
  });

  if (upload.storageProvider === "local") {
    const localPath = join(process.cwd(), ".uploads", upload.storageKey);
    try {
      await unlink(localPath);
    } catch {
      // Ignore missing local files after DB delete.
    }
  }

  return NextResponse.json({ success: true });
}
