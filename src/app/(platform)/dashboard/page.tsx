import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { SystemRole } from "@prisma/client";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { TicketStatusBadge } from "@/features/dashboard/components/ticket-status-badge";
import { DashboardCharts } from "@/features/analytics/components/dashboard-charts";
import { db } from "@/server/db/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { getTicketAnalytics } from "@/server/services/analytics";

export default async function UserDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    return null;
  }

  const analytics = await getTicketAnalytics(
    currentUser.role === SystemRole.USER ? { reporterId: currentUser.id } : {},
  );

  const myTickets = await db.ticket.findMany({
    where: { reporterId: currentUser.id },
    orderBy: { createdAt: "desc" },
    take: 8,
  });

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-sky-300">User Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Track your voice complaints</h1>
        <p className="mt-2 text-slate-300">Real-time visibility into your submitted tickets and complaint outcomes.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total tickets" value={analytics.totalTickets} />
        <KpiCard label="Pending" value={analytics.pendingTickets} />
        <KpiCard label="Resolved" value={analytics.resolvedTickets} />
        <KpiCard label="Urgent" value={analytics.urgentTickets} hint="High + critical" />
      </div>

      <DashboardCharts
        volumeTrend={analytics.volumeTrend}
        languageDistribution={analytics.languageDistribution}
        sentimentDistribution={analytics.sentimentDistribution}
        priorityDistribution={analytics.priorityDistribution}
        issueDistribution={analytics.issueDistribution}
      />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-white">Recent complaints</h3>
        <div className="mt-4 space-y-3">
          {myTickets.length === 0 ? (
            <p className="text-sm text-slate-400">No complaints submitted yet.</p>
          ) : (
            myTickets.map((ticket) => (
              <Link
                key={ticket.id}
                href={`/tickets/${ticket.id}`}
                className="block rounded-xl border border-white/10 bg-slate-900/60 p-3 transition hover:border-sky-500/40 hover:bg-slate-900/90"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-medium text-white">{ticket.ticketNo}</p>
                    <p className="mt-1 text-xs text-slate-400">{ticket.title}</p>
                    <p className="mt-2 text-xs font-medium text-sky-400">View complaint →</p>
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
