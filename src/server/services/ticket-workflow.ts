import { Prisma, SystemRole, TicketStatus } from "@prisma/client";
import { db } from "@/server/db/client";
import type { DbUserWithRole } from "@/server/services/ticket-automation";

const ALLOWED_STATUS_TRANSITIONS: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "ESCALATED", "CLOSED"],
  IN_PROGRESS: ["PENDING_CUSTOMER", "RESOLVED", "ESCALATED"],
  PENDING_CUSTOMER: ["IN_PROGRESS", "RESOLVED", "ESCALATED"],
  ESCALATED: ["IN_PROGRESS", "RESOLVED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
};

export async function updateTicketStatusWorkflow(params: {
  ticketId: string;
  nextStatus: TicketStatus;
  actor: DbUserWithRole;
  note?: string;
}) {
  const ticket = await db.ticket.findUnique({ where: { id: params.ticketId } });

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  const canTransition = ALLOWED_STATUS_TRANSITIONS[ticket.status].includes(params.nextStatus);

  if (!canTransition) {
    throw new Error(`Invalid status transition: ${ticket.status} -> ${params.nextStatus}`);
  }

  const isActorAssigned = ticket.assigneeId === params.actor.id;
  const isReporter = ticket.reporterId === params.actor.id;
  const isAdmin = params.actor.role === SystemRole.ADMIN;

  if (!isAdmin && !isActorAssigned && !isReporter) {
    throw new Error("You do not have permission to update this ticket.");
  }

  const updated = await db.ticket.update({
    where: { id: ticket.id },
    data: {
      status: params.nextStatus,
      resolvedAt: params.nextStatus === "RESOLVED" ? new Date() : ticket.resolvedAt,
      closedAt: params.nextStatus === "CLOSED" ? new Date() : ticket.closedAt,
    },
  });

  await db.activityLog.create({
    data: {
      actorId: params.actor.id,
      ticketId: ticket.id,
      action:
        params.nextStatus === "RESOLVED"
          ? "TICKET_RESOLVED"
          : params.nextStatus === "CLOSED"
            ? "TICKET_CLOSED"
            : "TICKET_UPDATED",
      targetType: "Ticket",
      targetId: ticket.id,
      summary: `Ticket status changed from ${ticket.status} to ${params.nextStatus}.`,
      metadata: {
        from: ticket.status,
        to: params.nextStatus,
      } as Prisma.InputJsonValue,
    },
  });

  if (params.note) {
    await db.ticketMessage.create({
      data: {
        ticketId: ticket.id,
        senderId: params.actor.id,
        type: "STATUS_CHANGE",
        content: params.note,
        isInternal: params.actor.role !== SystemRole.USER,
      },
    });
  }

  await db.notification.createMany({
    data: [
      {
        userId: ticket.reporterId,
        ticketId: ticket.id,
        senderId: params.actor.id,
        type: "TICKET_UPDATED",
        title: "Ticket status updated",
        message: `Your ticket ${ticket.ticketNo} is now ${params.nextStatus}.`,
      },
      ...(ticket.assigneeId
        ? [
            {
              userId: ticket.assigneeId,
              ticketId: ticket.id,
              senderId: params.actor.id,
              type: "TICKET_UPDATED" as const,
              title: "Ticket workflow update",
              message: `Ticket ${ticket.ticketNo} status changed to ${params.nextStatus}.`,
            },
          ]
        : []),
    ],
  });

  return updated;
}

export async function assignTicketWorkflow(params: {
  ticketId: string;
  assigneeId: string;
  actor: DbUserWithRole;
}) {
  if (params.actor.role !== SystemRole.ADMIN) {
    throw new Error("Only admins can assign tickets.");
  }

  const [ticket, assignee] = await Promise.all([
    db.ticket.findUnique({ where: { id: params.ticketId } }),
    db.user.findUnique({
      where: { id: params.assigneeId },
      include: {
        roles: { include: { role: true } },
      },
    }),
  ]);

  if (!ticket) {
    throw new Error("Ticket not found.");
  }

  if (!assignee) {
    throw new Error("Assignee not found.");
  }

  const isSupportAgent = assignee.roles.some((item) => item.role.name === SystemRole.SUPPORT_AGENT);

  if (!isSupportAgent) {
    throw new Error("Assignee must have SUPPORT_AGENT role.");
  }

  const updated = await db.ticket.update({
    where: { id: ticket.id },
    data: {
      assigneeId: assignee.id,
    },
  });

  await db.activityLog.create({
    data: {
      actorId: params.actor.id,
      ticketId: ticket.id,
      action: "TICKET_ASSIGNED",
      targetType: "Ticket",
      targetId: ticket.id,
      summary: `Ticket assigned to ${assignee.firstName} ${assignee.lastName}.`,
      metadata: {
        assigneeId: assignee.id,
      } as Prisma.InputJsonValue,
    },
  });

  await db.notification.create({
    data: {
      userId: assignee.id,
      ticketId: ticket.id,
      senderId: params.actor.id,
      type: "TICKET_ASSIGNED",
      title: "Ticket assigned to you",
      message: `Ticket ${ticket.ticketNo} has been assigned to your queue.`,
    },
  });

  return updated;
}
