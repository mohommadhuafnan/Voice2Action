import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { SystemRole, TicketStatus } from "@prisma/client";
import { db } from "@/server/db/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { updateTicketStatusWorkflow } from "@/server/services/ticket-workflow";

export async function PATCH(
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
  const body = (await request.json()) as { status?: TicketStatus; note?: string };

  if (!body.status) {
    return NextResponse.json({ error: "status is required." }, { status: 400 });
  }

  const ticket = await db.ticket.findUnique({ where: { id: ticketId } });

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

  try {
    const updated = await updateTicketStatusWorkflow({
      ticketId,
      nextStatus: body.status,
      actor: currentUser,
      note: body.note,
    });

    return NextResponse.json({ ticket: updated });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Status update failed." },
      { status: 400 },
    );
  }
}