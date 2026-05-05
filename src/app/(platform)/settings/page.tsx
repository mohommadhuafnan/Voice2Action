import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { SettingsForm } from "@/features/settings/components/settings-form";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { getUserSettings } from "@/server/services/settings";

export default async function SettingsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    redirect("/sign-in");
  }

  const settings = await getUserSettings(currentUser.id);

  return <SettingsForm initialSettings={settings} />;
}
