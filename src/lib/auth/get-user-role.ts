import { auth } from "@clerk/nextjs/server";
import { getUserByClerkId } from "@/server/services/ticket-automation";
import { normalizeRole, type AppRole } from "@/lib/auth/roles";

type SessionClaim = {
  publicMetadata?: {
    role?: string;
  };
  metadata?: {
    role?: string;
  };
};

export async function getCurrentUserRole(): Promise<AppRole> {
  const { userId, sessionClaims } = await auth();

  if (userId) {
    const currentUser = await getUserByClerkId(userId);

    if (currentUser?.role) {
      return normalizeRole(currentUser.role);
    }
  }

  const claims = (sessionClaims ?? {}) as SessionClaim;

  const roleFromClaims = claims.metadata?.role ?? claims.publicMetadata?.role;

  return normalizeRole(roleFromClaims);
}