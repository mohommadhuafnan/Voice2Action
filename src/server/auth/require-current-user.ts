import { auth } from "@clerk/nextjs/server";
import { fail } from "@/lib/http/api-response";
import { getUserByClerkId } from "@/server/services/ticket-automation";

export async function requireCurrentUser() {
  const { userId } = await auth();

  if (!userId) {
    return { error: fail("Unauthorized.", 401), user: null };
  }

  const currentUser = await getUserByClerkId(userId);

  if (!currentUser) {
    return { error: fail("User not found.", 404), user: null };
  }

  return { error: null, user: currentUser };
}
