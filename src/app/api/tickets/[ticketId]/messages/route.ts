import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { SystemRole } from "@prisma/client";
import { db } from "@/server/db/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ ticketId: string }> },
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const { ticketId } = await params;
  const body = (await request.json()) as { content?: string; isInternal?: boolean };
  const content = body.content?.trim();

  if (!content) {
    return NextResponse.json({ error: "Message content is required." }, { status: 400 });
  }

  const ticket = await db.ticket.findUnique({
    where: { id: ticketId },
    select: { id: true, reporterId: true, assigneeId: true, ticketNo: true },
  });

  if (!ticket) {
    return NextResponse.json({ error: "Ticket not found." }, { status: 404 });
  }

  const canAccess =
    currentUser.role === SystemRole.ADMIN ||
    ticket.assigneeId === currentUser.id ||
    ticket.reporterId === currentUser.id;

  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden." }, { status: 403 });
  }

  const isInternalRequested = Boolean(body.isInternal);
  const isInternal =
    isInternalRequested &&
    (currentUser.role === SystemRole.ADMIN ||
      (currentUser.role === SystemRole.SUPPORT_AGENT && ticket.assigneeId === currentUser.id));

  const message = await db.ticketMessage.create({
    data: {
      ticketId: ticket.id,
      senderId: currentUser.id,
      type: "COMMENT",
      content,
      isInternal,
    },
  });

  await db.activityLog.create({
    data: {
      actorId: currentUser.id,
      ticketId: ticket.id,
      action: "MESSAGE_ADDED",
      targetType: "TicketMessage",
      targetId: message.id,
      summary: isInternal ? "Internal note added to ticket." : "Reply added to ticket.",
    },
  });

  await db.notification.createMany({
    data: [
      ...(ticket.reporterId !== currentUser.id
        ? [
            {
              userId: ticket.reporterId,
              ticketId: ticket.id,
              senderId: currentUser.id,
              type: "MESSAGE_RECEIVED" as const,
              title: "New update on your ticket",
              message: `Ticket ${ticket.ticketNo} has a new message.`,
            },
          ]
        : []),
      ...(ticket.assigneeId && ticket.assigneeId !== currentUser.id
        ? [
            {
              userId: ticket.assigneeId,
              ticketId: ticket.id,
              senderId: currentUser.id,
              type: "MESSAGE_RECEIVED" as const,
              title: "New ticket message",
              message: `Ticket ${ticket.ticketNo} has a new message.`,
            },
          ]
        : []),
    ],
  });

  return NextResponse.json({ message }, { status: 201 });
}
