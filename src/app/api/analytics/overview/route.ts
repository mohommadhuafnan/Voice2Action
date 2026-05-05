import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { SystemRole } from "@prisma/client";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { getAgentPerformance, getTicketAnalytics } from "@/server/services/analytics";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const scope =
    currentUser.role === SystemRole.ADMIN
      ? {}
      : currentUser.role === SystemRole.SUPPORT_AGENT
        ? { assigneeId: currentUser.id }
        : { reporterId: currentUser.id };

  const [analytics, agentPerformance] = await Promise.all([
    getTicketAnalytics(scope),
    currentUser.role === SystemRole.ADMIN ? getAgentPerformance() : Promise.resolve([]),
  ]);

  return NextResponse.json({
    analytics,
    agentPerformance,
  });
}
