"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  Cell,
} from "recharts";

type Item = { name: string; value: number };

type DashboardChartsProps = {
  volumeTrend: Array<{ date: string; count: number }>;
  languageDistribution: Item[];
  sentimentDistribution: Item[];
  priorityDistribution: Item[];
  issueDistribution: Item[];
};

const colors = ["#38bdf8", "#22c55e", "#f59e0b", "#a78bfa", "#fb7185", "#f97316"];

export function DashboardCharts({
  volumeTrend,
  languageDistribution,
  sentimentDistribution,
  priorityDistribution,
  issueDistribution,
}: DashboardChartsProps) {
  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ChartCard title="Ticket volume trend">
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={volumeTrend}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="date" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#38bdf8" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Language distribution">
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={languageDistribution} dataKey="value" nameKey="name" outerRadius={86}>
              {languageDistribution.map((item, idx) => (
                <Cell key={item.name} fill={colors[idx % colors.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Sentiment trend">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sentimentDistribution}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Bar dataKey="value" fill="#22c55e" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <ChartCard title="Priority and issue categories">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={mergeTwoSeries(priorityDistribution, issueDistribution)}>
            <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
            <XAxis dataKey="name" stroke="#94a3b8" />
            <YAxis stroke="#94a3b8" />
            <Tooltip />
            <Legend />
            <Bar dataKey="priority" fill="#a78bfa" radius={[8, 8, 0, 0]} />
            <Bar dataKey="issues" fill="#fb7185" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function mergeTwoSeries(priority: Item[], issues: Item[]) {
  const max = Math.max(priority.length, issues.length);
  return Array.from({ length: max }).map((_, idx) => ({
    name: priority[idx]?.name ?? issues[idx]?.name ?? `item-${idx + 1}`,
    priority: priority[idx]?.value ?? 0,
    issues: issues[idx]?.value ?? 0,
  }));
}

function ChartCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <h3 className="mb-4 text-base font-semibold text-white">{title}</h3>
      {children}
    </div>
  );
}
