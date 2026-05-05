import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { TicketStatusBadge } from "@/features/dashboard/components/ticket-status-badge";
import { requireRole } from "@/lib/auth/guards";
import { db } from "@/server/db/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { getTicketAnalytics } from "@/server/services/analytics";

export default async function AgentDashboardPage() {
  await requireRole(["ADMIN", "SUPPORT_AGENT"]);

  const { userId } = await auth();
  if (!userId) {
    return null;
  }

  const currentUser = await getUserByClerkId(userId);
  if (!currentUser) {
    return null;
  }

  const analytics = await getTicketAnalytics({ assigneeId: currentUser.id });

  const assignedTickets = await db.ticket.findMany({
    where: { assigneeId: currentUser.id },
    orderBy: [{ priority: "desc" }, { createdAt: "desc" }],
    take: 12,
  });

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-emerald-300">Support Agent Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Assigned queue and workload</h1>
        <p className="mt-2 text-slate-300">Focus on urgent complaints and keep response SLAs on track.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Assigned tickets" value={analytics.totalTickets} />
        <KpiCard label="Response queue" value={analytics.pendingTickets} />
        <KpiCard label="Resolved" value={analytics.resolvedTickets} />
        <KpiCard label="Urgent" value={analytics.urgentTickets} />
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-white">Current workload</h3>
        <div className="mt-4 space-y-3">
          {assignedTickets.length === 0 ? (
            <p className="text-sm text-slate-400">No assigned tickets in your queue.</p>
          ) : (
            assignedTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="block rounded-xl border border-white/10 bg-slate-900/60 p-3 transition hover:border-emerald-500/40 hover:bg-slate-900/90"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{ticket.ticketNo}</p>
                    <p className="mt-1 text-xs text-slate-400">{ticket.title}</p>
                    <p className="mt-1 text-xs text-slate-500">Priority: {ticket.priority}</p>
                    <p className="mt-2 text-xs font-medium text-emerald-400">Open ticket →</p>
                  </div>
                  <TicketStatusBadge status={ticket.status} />
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
