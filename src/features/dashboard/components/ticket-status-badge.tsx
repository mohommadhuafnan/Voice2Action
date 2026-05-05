import { TicketStatus } from "@prisma/client";

const statusClasses: Record<TicketStatus, string> = {
  OPEN: "bg-sky-500/20 text-sky-200",
  IN_PROGRESS: "bg-indigo-500/20 text-indigo-200",
  PENDING_CUSTOMER: "bg-amber-500/20 text-amber-200",
  ESCALATED: "bg-rose-500/20 text-rose-200",
  RESOLVED: "bg-emerald-500/20 text-emerald-200",
  CLOSED: "bg-slate-500/20 text-slate-200",
};

export function TicketStatusBadge({ status }: { status: TicketStatus }) {
  return (
    <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[status]}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}
