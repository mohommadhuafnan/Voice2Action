const memoryWindow = new Map<string, number[]>();

export function isRateLimited(key: string, maxRequests: number, windowMs: number) {
  const now = Date.now();
  const existing = memoryWindow.get(key) ?? [];
  const active = existing.filter((time) => now - time <= windowMs);

  if (active.length >= maxRequests) {
    memoryWindow.set(key, active);
    return true;
  }

  active.push(now);
  memoryWindow.set(key, active);
  return false;
}
