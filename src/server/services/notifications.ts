import { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";

export async function getUserNotifications(userId: string) {
  const [notifications, unreadCount] = await Promise.all([
    db.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: 50,
      include: {
        ticket: {
          select: {
            ticketNo: true,
            status: true,
          },
        },
      },
    }),
    db.notification.count({ where: { userId, isRead: false } }),
  ]);

  return { notifications, unreadCount };
}

export async function markNotificationRead(userId: string, notificationId: string) {
  return db.notification.updateMany({
    where: {
      id: notificationId,
      userId,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

export async function markAllNotificationsRead(userId: string) {
  return db.notification.updateMany({
    where: {
      userId,
      isRead: false,
    },
    data: {
      isRead: true,
      readAt: new Date(),
    },
  });
}

export async function createInAppNotification(input: {
  userId: string;
  title: string;
  message: string;
  type: Prisma.NotificationUncheckedCreateInput["type"];
  ticketId?: string;
  senderId?: string;
  metadata?: Prisma.InputJsonValue;
}) {
  return db.notification.create({
    data: {
      userId: input.userId,
      title: input.title,
      message: input.message,
      type: input.type,
      ticketId: input.ticketId,
      senderId: input.senderId,
      metadata: input.metadata,
    },
  });
}
