import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { NotificationInbox } from "@/features/notifications/components/notification-inbox";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { getUserNotifications } from "@/server/services/notifications";

export default async function NotificationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    redirect("/sign-in");
  }

  const { notifications, unreadCount } = await getUserNotifications(currentUser.id);

  const serializedNotifications = notifications.map((item) => ({
    id: item.id,
    type: item.type,
    title: item.title,
    message: item.message,
    isRead: item.isRead,
    createdAt: item.createdAt.toISOString(),
    ticket: item.ticket
      ? {
          ticketNo: item.ticket.ticketNo,
          status: item.ticket.status,
        }
      : null,
  }));

  return (
    <NotificationInbox
      initialNotifications={serializedNotifications}
      initialUnreadCount={unreadCount}
    />
  );
}
