"use client";

import { useState } from "react";
import { toast } from "sonner";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  ticket?: {
    ticketNo: string;
    status: string;
  } | null;
};

type Props = {
  initialNotifications: NotificationItem[];
  initialUnreadCount: number;
};

export function NotificationInbox({ initialNotifications, initialUnreadCount }: Props) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [unreadCount, setUnreadCount] = useState(initialUnreadCount);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  async function markRead(notificationId: string) {
    setLoadingId(notificationId);

    try {
      const response = await fetch(`/api/notifications/${notificationId}/read`, {
        method: "PATCH",
      });

      if (!response.ok) {
        throw new Error("Failed to update notification.");
      }

      setNotifications((prev) =>
        prev.map((item) => (item.id === notificationId ? { ...item, isRead: true } : item)),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update notification.");
    } finally {
      setLoadingId(null);
    }
  }

  async function markAllRead() {
    try {
      const response = await fetch("/api/notifications/read-all", { method: "PATCH" });

      if (!response.ok) {
        throw new Error("Failed to mark all notifications as read.");
      }

      setNotifications((prev) => prev.map((item) => ({ ...item, isRead: true })));
      setUnreadCount(0);
      toast.success("All notifications marked as read.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to update notifications.");
    }
  }

  return (
    <section className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-amber-300">Notifications</p>
          <h1 className="mt-2 text-3xl font-semibold text-white">Inbox</h1>
          <p className="mt-1 text-sm text-slate-300">Unread notifications: {unreadCount}</p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          disabled={unreadCount === 0}
          className="rounded-xl border border-white/20 px-4 py-2 text-sm text-slate-100 disabled:opacity-50"
        >
          Mark all as read
        </button>
      </div>

      <div className="space-y-3">
        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-6 text-sm text-slate-400">
            No notifications yet.
          </div>
        ) : (
          notifications.map((item) => (
            <article
              key={item.id}
              className={[
                "rounded-2xl border p-4",
                item.isRead ? "border-white/10 bg-white/5" : "border-sky-400/40 bg-sky-500/10",
              ].join(" ")}
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-base font-semibold text-white">{item.title}</h3>
                <span className="text-xs text-slate-400">{new Date(item.createdAt).toLocaleString()}</span>
              </div>
              <p className="mt-2 text-sm text-slate-300">{item.message}</p>
              {item.ticket ? (
                <p className="mt-2 text-xs text-slate-500">
                  Ticket: {item.ticket.ticketNo} | {item.ticket.status.replace(/_/g, " ")}
                </p>
              ) : null}

              {!item.isRead ? (
                <button
                  type="button"
                  onClick={() => {
                    void markRead(item.id);
                  }}
                  disabled={loadingId === item.id}
                  className="mt-3 rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-medium text-white disabled:opacity-50"
                >
                  {loadingId === item.id ? "Updating..." : "Mark as read"}
                </button>
              ) : null}
            </article>
          ))
        )}
      </div>
    </section>
  );
}
