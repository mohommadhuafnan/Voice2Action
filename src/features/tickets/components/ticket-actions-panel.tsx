"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { TicketStatus } from "@prisma/client";
import { toast } from "sonner";

const statusTransitions: Record<TicketStatus, TicketStatus[]> = {
  OPEN: ["IN_PROGRESS", "ESCALATED", "CLOSED"],
  IN_PROGRESS: ["PENDING_CUSTOMER", "RESOLVED", "ESCALATED"],
  PENDING_CUSTOMER: ["IN_PROGRESS", "RESOLVED", "ESCALATED"],
  ESCALATED: ["IN_PROGRESS", "RESOLVED"],
  RESOLVED: ["CLOSED", "IN_PROGRESS"],
  CLOSED: [],
};

type Props = {
  ticketId: string;
  currentStatus: TicketStatus;
  canInternalNote: boolean;
};

export function TicketActionsPanel({ ticketId, currentStatus, canInternalNote }: Props) {
  const router = useRouter();
  const [nextStatus, setNextStatus] = useState<TicketStatus | "">("");
  const [statusNote, setStatusNote] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isInternal, setIsInternal] = useState(false);
  const [isSavingStatus, setIsSavingStatus] = useState(false);
  const [isPostingReply, setIsPostingReply] = useState(false);

  async function updateStatus() {
    if (!nextStatus) {
      toast.error("Select a status first.");
      return;
    }

    setIsSavingStatus(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: nextStatus,
          note: statusNote.trim() || undefined,
        }),
      });

      if (!response.ok) {
        const err = (await response.json()) as { error?: string };
        throw new Error(err.error ?? "Failed to update status.");
      }

      toast.success(`Ticket moved to ${nextStatus.replace(/_/g, " ")}.`);
      setNextStatus("");
      setStatusNote("");
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update status.");
    } finally {
      setIsSavingStatus(false);
    }
  }

  async function sendReply() {
    const content = replyText.trim();
    if (!content) {
      toast.error("Reply message cannot be empty.");
      return;
    }

    setIsPostingReply(true);
    try {
      const response = await fetch(`/api/tickets/${ticketId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content,
          isInternal: canInternalNote ? isInternal : false,
        }),
      });

      if (!response.ok) {
        const err = (await response.json()) as { error?: string };
        throw new Error(err.error ?? "Failed to send reply.");
      }

      toast.success("Reply sent.");
      setReplyText("");
      setIsInternal(false);
      router.refresh();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to send reply.");
    } finally {
      setIsPostingReply(false);
    }
  }

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Update status</h2>
        <p className="mt-2 text-sm text-slate-400">Current: {currentStatus.replace(/_/g, " ")}</p>
        <select
          value={nextStatus}
          onChange={(event) => setNextStatus(event.target.value as TicketStatus | "")}
          className="mt-4 block w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
        >
          <option value="">Select next status</option>
          {statusTransitions[currentStatus].map((status) => (
            <option key={status} value={status}>
              {status.replace(/_/g, " ")}
            </option>
          ))}
        </select>
        <textarea
          value={statusNote}
          onChange={(event) => setStatusNote(event.target.value)}
          placeholder="Optional note for this status change"
          className="mt-3 min-h-20 w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
        />
        <button
          type="button"
          onClick={() => {
            void updateStatus();
          }}
          disabled={isSavingStatus || !nextStatus}
          className="mt-3 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isSavingStatus ? "Updating..." : "Update status"}
        </button>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
        <h2 className="text-lg font-semibold text-white">Reply</h2>
        <textarea
          value={replyText}
          onChange={(event) => setReplyText(event.target.value)}
          placeholder="Write a reply to this complaint..."
          className="mt-3 min-h-24 w-full rounded-lg border border-white/20 bg-slate-900/70 px-3 py-2 text-sm text-slate-100"
        />
        {canInternalNote ? (
          <label className="mt-3 inline-flex items-center gap-2 text-xs text-slate-300">
            <input
              type="checkbox"
              checked={isInternal}
              onChange={(event) => setIsInternal(event.target.checked)}
            />
            Send as internal note (hidden from customer)
          </label>
        ) : null}
        <button
          type="button"
          onClick={() => {
            void sendReply();
          }}
          disabled={isPostingReply || !replyText.trim()}
          className="mt-3 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {isPostingReply ? "Sending..." : "Send reply"}
        </button>
      </div>
    </div>
  );
}
