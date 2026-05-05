import { redirect } from "next/navigation";
import { getCurrentUserRole } from "@/lib/auth/get-user-role";
import { hasRole, type AppRole } from "@/lib/auth/roles";

export async function requireRole(allowedRoles: AppRole[]) {
  const role = await getCurrentUserRole();

  if (!hasRole(allowedRoles, role)) {
    redirect("/unauthorized");
  }

  return role;
}