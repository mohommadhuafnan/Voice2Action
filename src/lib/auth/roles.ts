export const appRoles = ["ADMIN", "SUPPORT_AGENT", "USER"] as const;

export type AppRole = (typeof appRoles)[number];

export function normalizeRole(value: unknown): AppRole {
  if (typeof value !== "string") {
    return "USER";
  }

  const upper = value.toUpperCase();

  if (upper === "ADMIN" || upper === "SUPPORT_AGENT" || upper === "USER") {
    return upper;
  }

  return "USER";
}

export function hasRole(allowed: AppRole[], role: AppRole) {
  return allowed.includes(role);
}