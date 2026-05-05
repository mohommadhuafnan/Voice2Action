import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { SystemRole } from "@prisma/client";
import { db } from "@/server/db/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const where =
    currentUser.role === SystemRole.ADMIN
      ? {}
      : currentUser.role === SystemRole.SUPPORT_AGENT
        ? { assigneeId: currentUser.id }
        : { reporterId: currentUser.id };

  const tickets = await db.ticket.findMany({
    where,
    orderBy: { createdAt: "desc" },
    take: 50,
    include: {
      reporter: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
      assignee: {
        select: {
          firstName: true,
          lastName: true,
        },
      },
    },
  });

  return NextResponse.json({ tickets });
}
