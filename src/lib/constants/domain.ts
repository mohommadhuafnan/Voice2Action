export const roles = ["ADMIN", "SUPPORT_AGENT", "USER"] as const;
export type UserRole = (typeof roles)[number];

export const ticketStatuses = [
  "OPEN",
  "IN_PROGRESS",
  "PENDING_CUSTOMER",
  "ESCALATED",
  "RESOLVED",
  "CLOSED",
] as const;

export const ticketPriorities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"] as const;
