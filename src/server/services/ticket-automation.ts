import { currentUser } from "@clerk/nextjs/server";
import { SystemRole, type Prisma, type User } from "@prisma/client";
import { db } from "@/server/db/client";
import { sendTicketCreatedEmail } from "@/server/services/email-notifier";

export type DbUserWithRole = User & {
  role: SystemRole;
};

export async function getUserByClerkId(clerkId: string): Promise<DbUserWithRole | null> {
  let user = await db.user.findUnique({
    where: { clerkId },
    include: {
      roles: {
        include: {
          role: true,
        },
      },
    },
  });

  if (!user) {
    const clerkUser = await currentUser();

    if (!clerkUser || clerkUser.id !== clerkId) {
      return null;
    }

    const primaryEmail =
      clerkUser.primaryEmailAddress?.emailAddress ?? clerkUser.emailAddresses[0]?.emailAddress;

    if (!primaryEmail) {
      return null;
    }

    const firstName = clerkUser.firstName?.trim() || "User";
    const lastName = clerkUser.lastName?.trim() || "Member";

    user = await db.user.upsert({
      where: { clerkId },
      update: {
        email: primaryEmail,
        firstName,
        lastName,
        avatarUrl: clerkUser.imageUrl ?? null,
        lastLoginAt: new Date(),
      },
      create: {
        clerkId,
        email: primaryEmail,
        firstName,
        lastName,
        avatarUrl: clerkUser.imageUrl ?? null,
        lastLoginAt: new Date(),
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    const userRole = await db.role.findUnique({
      where: { name: SystemRole.USER },
      select: { id: true },
    });

    if (userRole) {
      await db.userRole.upsert({
        where: {
          userId_roleId: {
            userId: user.id,
            roleId: userRole.id,
          },
        },
        update: {},
        create: {
          userId: user.id,
          roleId: userRole.id,
        },
      });

      user = await db.user.findUnique({
        where: { clerkId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });
    }
  }

  if (!user) {
    return null;
  }

  const resolvedRole =
    user.roles.find((item) => item.role.name === SystemRole.ADMIN)?.role.name ??
    user.roles.find((item) => item.role.name === SystemRole.SUPPORT_AGENT)?.role.name ??
    SystemRole.USER;

  return {
    id: user.id,
    clerkId: user.clerkId,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    avatarUrl: user.avatarUrl,
    isActive: user.isActive,
    timezone: user.timezone,
    preferredLang: user.preferredLang,
    lastLoginAt: user.lastLoginAt,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    role: resolvedRole,
  };
}

function mapIntentToCategory(intent: string): Prisma.TicketUncheckedCreateInput["category"] {
  if (intent.includes("delivery")) return "DELIVERY";
  if (intent.includes("billing")) return "BILLING";
  if (intent.includes("technical")) return "TECHNICAL";
  if (intent.includes("account")) return "ACCOUNT";
  if (intent.includes("refund")) return "REFUND";
  return "OTHER";
}

export type AutomatedTicketInput = {
  reporterId: string;
  transcript: string;
  language: string;
  intent: string;
  sentiment: string;
  urgencyScore: number;
  priority: Prisma.TicketUncheckedCreateInput["priority"];
  recommendedAction: string;
  entities: Record<string, string>;
};

export async function createAutomatedTicket(input: AutomatedTicketInput) {
  let agents = await db.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: SystemRole.SUPPORT_AGENT,
          },
        },
      },
      isActive: true,
    },
    include: {
      assignedTickets: {
        where: {
          status: {
            in: ["OPEN", "IN_PROGRESS", "PENDING_CUSTOMER", "ESCALATED"],
          },
        },
        select: { id: true },
      },
    },
  });

  if (agents.length === 0) {
    agents = await db.user.findMany({
      where: {
        roles: {
          some: {
            role: {
              name: SystemRole.ADMIN,
            },
          },
        },
        isActive: true,
      },
      include: {
        assignedTickets: {
          where: {
            status: {
              in: ["OPEN", "IN_PROGRESS", "PENDING_CUSTOMER", "ESCALATED"],
            },
          },
          select: { id: true },
        },
      },
    });
  }

  const selectedAgent = agents.sort(
    (a, b) => a.assignedTickets.length - b.assignedTickets.length,
  )[0];

  const shouldEscalate =
    input.priority === "CRITICAL" || input.priority === "HIGH" || input.urgencyScore >= 0.8;

  const ticketNo = `V2A-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 899999)}`;

  const dueAt = new Date(Date.now() + (shouldEscalate ? 2 : 24) * 60 * 60 * 1000);

  const ticket = await db.ticket.create({
    data: {
      ticketNo,
      title: `Voice complaint: ${input.intent.replace(/_/g, " ")}`,
      description: input.transcript,
      category: mapIntentToCategory(input.intent),
      channel: "VOICE",
      status: shouldEscalate ? "ESCALATED" : "OPEN",
      priority: input.priority,
      urgencyScore: input.urgencyScore,
      language: input.language,
      intent: input.intent,
      sentiment: input.sentiment,
      recommendedAction: input.recommendedAction,
      reporterId: input.reporterId,
      assigneeId: selectedAgent?.id,
      dueAt,
    },
  });

  await db.activityLog.createMany({
    data: [
      {
        actorId: input.reporterId,
        ticketId: ticket.id,
        action: "TICKET_CREATED",
        targetType: "Ticket",
        targetId: ticket.id,
        summary: "Ticket generated automatically from voice complaint.",
        metadata: {
          entities: input.entities,
          urgencyScore: input.urgencyScore,
        } as Prisma.InputJsonValue,
      },
      ...(selectedAgent
        ? [
            {
              actorId: selectedAgent.id,
              ticketId: ticket.id,
              action: "TICKET_ASSIGNED" as const,
              targetType: "Ticket",
              targetId: ticket.id,
              summary: "Ticket auto-assigned by workload balancing.",
            },
          ]
        : []),
      ...(shouldEscalate
        ? [
            {
              actorId: null,
              ticketId: ticket.id,
              action: "TICKET_ESCALATED" as const,
              targetType: "Ticket",
              targetId: ticket.id,
              summary: "Ticket auto-escalated due to high urgency or priority.",
            },
          ]
        : []),
    ],
  });

  if (selectedAgent) {
    await db.notification.create({
      data: {
        userId: selectedAgent.id,
        ticketId: ticket.id,
        senderId: input.reporterId,
        type: shouldEscalate ? "TICKET_ESCALATED" : "TICKET_ASSIGNED",
        title: shouldEscalate ? "Urgent ticket assigned" : "New ticket assigned",
        message: `Ticket ${ticket.ticketNo} has been routed to your queue.`,
        metadata: {
          urgencyScore: input.urgencyScore,
          priority: input.priority,
        } as Prisma.InputJsonValue,
      },
    });
  }

  await db.notification.create({
    data: {
      userId: input.reporterId,
      ticketId: ticket.id,
      type: "TICKET_CREATED",
      title: "Complaint received",
      message: `Your complaint has been converted into ticket ${ticket.ticketNo}.`,
      metadata: {
        status: ticket.status,
        priority: ticket.priority,
      } as Prisma.InputJsonValue,
    },
  });

  try {
    await sendTicketCreatedEmail({
      userId: input.reporterId,
      ticketNo: ticket.ticketNo,
    });
  } catch {
    // Do not block workflow if email provider fails.
  }

  return ticket;
}
