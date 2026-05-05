import { auth } from "@clerk/nextjs/server";
import { SystemRole } from "@prisma/client";
import { DashboardCharts } from "@/features/analytics/components/dashboard-charts";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { getTicketAnalytics } from "@/server/services/analytics";
import { getUserByClerkId } from "@/server/services/ticket-automation";

export default async function AnalyticsPage() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    return null;
  }

  const scope =
    currentUser.role === SystemRole.ADMIN
      ? {}
      : currentUser.role === SystemRole.SUPPORT_AGENT
        ? { assigneeId: currentUser.id }
        : { reporterId: currentUser.id };

  const analytics = await getTicketAnalytics(scope);

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-indigo-300">Analytics</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Performance insights</h1>
        <p className="mt-2 text-slate-300">Ticket volume, urgency, sentiment, language, and issue distribution in one view.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total" value={analytics.totalTickets} />
        <KpiCard label="Pending" value={analytics.pendingTickets} />
        <KpiCard label="Resolved" value={analytics.resolvedTickets} />
        <KpiCard label="Urgent" value={analytics.urgentTickets} />
      </div>

      <DashboardCharts
        volumeTrend={analytics.volumeTrend}
        languageDistribution={analytics.languageDistribution}
        sentimentDistribution={analytics.sentimentDistribution}
        priorityDistribution={analytics.priorityDistribution}
        issueDistribution={analytics.issueDistribution}
      />
    </section>
  );
}
