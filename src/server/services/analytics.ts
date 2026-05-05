import { TicketPriority, TicketStatus } from "@prisma/client";
import { db } from "@/server/db/client";

export type TicketAnalytics = {
  totalTickets: number;
  pendingTickets: number;
  resolvedTickets: number;
  urgentTickets: number;
  statusDistribution: Array<{ name: TicketStatus; value: number }>;
  languageDistribution: Array<{ name: string; value: number }>;
  priorityDistribution: Array<{ name: TicketPriority; value: number }>;
  sentimentDistribution: Array<{ name: string; value: number }>;
  issueDistribution: Array<{ name: string; value: number }>;
  volumeTrend: Array<{ date: string; count: number }>;
  recentActivity: Array<{
    id: string;
    action: string;
    summary: string;
    createdAt: Date;
  }>;
};

export async function getTicketAnalytics(scope?: { reporterId?: string; assigneeId?: string }) {
  const where = scope ?? {};

  const tickets = await db.ticket.findMany({ where, orderBy: { createdAt: "asc" } });
  const ticketIds = tickets.map((ticket) => ticket.id);

  const activityLogs =
    ticketIds.length === 0
      ? []
      : await db.activityLog.findMany({
          where: { ticketId: { in: ticketIds } },
          orderBy: { createdAt: "desc" },
          take: 8,
        });

  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter((item) => ["OPEN", "IN_PROGRESS", "PENDING_CUSTOMER", "ESCALATED"].includes(item.status)).length;
  const resolvedTickets = tickets.filter((item) => item.status === "RESOLVED" || item.status === "CLOSED").length;
  const urgentTickets = tickets.filter((item) => item.priority === "HIGH" || item.priority === "CRITICAL").length;

  const statusDistribution = countBy(tickets.map((item) => item.status));
  const languageDistribution = countBy(tickets.map((item) => item.language || "Unknown"));
  const priorityDistribution = countBy(tickets.map((item) => item.priority));
  const sentimentDistribution = countBy(tickets.map((item) => item.sentiment || "unknown"));
  const issueDistribution = countBy(tickets.map((item) => item.intent || "general_complaint"));

  const volumeMap = new Map<string, number>();
  for (const ticket of tickets) {
    const key = ticket.createdAt.toISOString().slice(0, 10);
    volumeMap.set(key, (volumeMap.get(key) ?? 0) + 1);
  }

  const volumeTrend = Array.from(volumeMap.entries())
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => (a.date > b.date ? 1 : -1));

  return {
    totalTickets,
    pendingTickets,
    resolvedTickets,
    urgentTickets,
    statusDistribution: statusDistribution as TicketAnalytics["statusDistribution"],
    languageDistribution,
    priorityDistribution: priorityDistribution as TicketAnalytics["priorityDistribution"],
    sentimentDistribution,
    issueDistribution,
    volumeTrend,
    recentActivity: activityLogs.map((log) => ({
      id: log.id,
      action: log.action,
      summary: log.summary,
      createdAt: log.createdAt,
    })),
  } satisfies TicketAnalytics;
}

export async function getAgentPerformance() {
  const agents = await db.user.findMany({
    where: {
      roles: {
        some: {
          role: {
            name: "SUPPORT_AGENT",
          },
        },
      },
    },
    include: {
      assignedTickets: true,
    },
  });

  return agents.map((agent) => {
    const totalAssigned = agent.assignedTickets.length;
    const resolved = agent.assignedTickets.filter(
      (ticket) => ticket.status === "RESOLVED" || ticket.status === "CLOSED",
    ).length;
    const urgent = agent.assignedTickets.filter(
      (ticket) => ticket.priority === "HIGH" || ticket.priority === "CRITICAL",
    ).length;

    return {
      id: agent.id,
      name: `${agent.firstName} ${agent.lastName}`,
      totalAssigned,
      resolved,
      urgent,
      resolutionRate: totalAssigned ? Number(((resolved / totalAssigned) * 100).toFixed(1)) : 0,
    };
  });
}

function countBy(values: string[]) {
  const map = new Map<string, number>();

  for (const value of values) {
    map.set(value, (map.get(value) ?? 0) + 1);
  }

  return Array.from(map.entries()).map(([name, value]) => ({ name, value }));
}
