import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { markAllNotificationsRead } from "@/server/services/notifications";

export async function PATCH() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  await markAllNotificationsRead(currentUser.id);

  return NextResponse.json({ success: true });
}
