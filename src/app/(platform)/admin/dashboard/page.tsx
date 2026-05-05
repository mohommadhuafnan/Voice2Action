import { requireRole } from "@/lib/auth/guards";
import { KpiCard } from "@/features/dashboard/components/kpi-card";
import { DashboardCharts } from "@/features/analytics/components/dashboard-charts";
import { getAgentPerformance, getTicketAnalytics } from "@/server/services/analytics";

export default async function AdminDashboardPage() {
  await requireRole(["ADMIN"]);

  const [analytics, agentPerformance] = await Promise.all([
    getTicketAnalytics(),
    getAgentPerformance(),
  ]);

  return (
    <section className="space-y-8">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-purple-300">Admin Dashboard</p>
        <h1 className="mt-2 text-3xl font-semibold text-white">Support operations control center</h1>
        <p className="mt-2 text-slate-300">Monitor global ticket flow, escalations, languages, and agent performance.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <KpiCard label="Total tickets" value={analytics.totalTickets} />
        <KpiCard label="Pending tickets" value={analytics.pendingTickets} />
        <KpiCard label="Resolved tickets" value={analytics.resolvedTickets} />
        <KpiCard label="Urgent tickets" value={analytics.urgentTickets} />
      </div>

      <DashboardCharts
        volumeTrend={analytics.volumeTrend}
        languageDistribution={analytics.languageDistribution}
        sentimentDistribution={analytics.sentimentDistribution}
        priorityDistribution={analytics.priorityDistribution}
        issueDistribution={analytics.issueDistribution}
      />

      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        <h3 className="text-lg font-semibold text-white">Agent performance</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {agentPerformance.length === 0 ? (
            <p className="text-sm text-slate-400">No support agents found.</p>
          ) : (
            agentPerformance.map((agent) => (
              <div key={agent.id} className="rounded-xl border border-white/10 bg-slate-900/60 p-3">
                <p className="text-sm font-semibold text-white">{agent.name}</p>
                <p className="mt-1 text-xs text-slate-400">
                  Assigned: {agent.totalAssigned} | Resolved: {agent.resolved} | Urgent: {agent.urgent}
                </p>
                <p className="mt-1 text-xs text-emerald-300">Resolution rate: {agent.resolutionRate}%</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
