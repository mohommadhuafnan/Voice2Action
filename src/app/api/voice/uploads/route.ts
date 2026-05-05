import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { db } from "@/server/db/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const user = await getUserByClerkId(userId);

  if (!user) {
    return NextResponse.json({ uploads: [] });
  }

  const uploads = await db.audioUpload.findMany({
    where: { userId: user.id },
    orderBy: { uploadedAt: "desc" },
    take: 10,
    select: {
      id: true,
      fileName: true,
      source: true,
      uploadedAt: true,
      durationSec: true,
      publicUrl: true,
      ticketId: true,
      analyses: {
        orderBy: { createdAt: "desc" },
        take: 1,
        select: {
          status: true,
        },
      },
      ticket: {
        select: {
          language: true,
        },
      },
    },
  });

  return NextResponse.json({
    uploads: uploads.map((item) => ({
      id: item.id,
      fileName: item.fileName,
      source: item.source,
      uploadedAt: item.uploadedAt,
      durationSec: item.durationSec,
      languageHint: item.ticket?.language ?? null,
      publicUrl: item.publicUrl,
      ticketId: item.ticketId,
      analysisStatus: item.analyses[0]?.status ?? "PENDING",
    })),
  });
}
