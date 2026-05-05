import { Prisma } from "@prisma/client";
import { db } from "@/server/db/client";

export type UserSettingsPayload = {
  timezone: string;
  preferredLang: string;
  emailNotifications: boolean;
  inAppNotifications: boolean;
  darkMode: boolean;
};

const DEFAULT_SETTINGS: UserSettingsPayload = {
  timezone: "Asia/Colombo",
  preferredLang: "en",
  emailNotifications: true,
  inAppNotifications: true,
  darkMode: true,
};

export async function getUserSettings(userId: string): Promise<UserSettingsPayload> {
  const [user, settings] = await Promise.all([
    db.user.findUnique({ where: { id: userId } }),
    db.setting.findMany({ where: { userId } }),
  ]);

  if (!user) {
    return DEFAULT_SETTINGS;
  }

  const settingMap = new Map(settings.map((item) => [item.key, item.value]));

  return {
    timezone: user.timezone,
    preferredLang: user.preferredLang,
    emailNotifications:
      (settingMap.get("notifications.email.enabled") as boolean | undefined) ??
      DEFAULT_SETTINGS.emailNotifications,
    inAppNotifications:
      (settingMap.get("notifications.inApp.enabled") as boolean | undefined) ??
      DEFAULT_SETTINGS.inAppNotifications,
    darkMode: (settingMap.get("appearance.darkMode") as boolean | undefined) ?? DEFAULT_SETTINGS.darkMode,
  };
}

export async function updateUserSettings(userId: string, payload: UserSettingsPayload) {
  await db.user.update({
    where: { id: userId },
    data: {
      timezone: payload.timezone,
      preferredLang: payload.preferredLang,
    },
  });

  const settingsToUpsert: Array<{ key: string; value: Prisma.InputJsonValue; description?: string }> = [
    {
      key: "notifications.email.enabled",
      value: payload.emailNotifications,
      description: "Email notification preference",
    },
    {
      key: "notifications.inApp.enabled",
      value: payload.inAppNotifications,
      description: "In-app notification preference",
    },
    {
      key: "appearance.darkMode",
      value: payload.darkMode,
      description: "Preferred dark mode",
    },
  ];

  await Promise.all(
    settingsToUpsert.map((item) =>
      db.setting.upsert({
        where: {
          userId_key: {
            userId,
            key: item.key,
          },
        },
        create: {
          userId,
          key: item.key,
          value: item.value,
          scope: "user",
          description: item.description,
        },
        update: {
          value: item.value,
          description: item.description,
        },
      }),
    ),
  );

  return getUserSettings(userId);
}
