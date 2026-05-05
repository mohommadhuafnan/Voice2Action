import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { assignTicketWorkflow } from "@/server/services/ticket-workflow";

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
  const body = (await request.json()) as { assigneeId?: string };

  if (!body.assigneeId) {
    return NextResponse.json({ error: "assigneeId is required." }, { status: 400 });
  }

  try {
    const ticket = await assignTicketWorkflow({
      ticketId,
      assigneeId: body.assigneeId,
      actor: currentUser,
    });

    return NextResponse.json({ ticket });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Ticket assignment failed." },
      { status: 400 },
    );
  }
}