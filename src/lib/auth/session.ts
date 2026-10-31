import type { AgentRole } from "@/generated/prisma/client";

/** Absolute session lifetime (ADR 0005, architecture §7.1). */
export const SESSION_MAX_AGE_MS = 8 * 60 * 60 * 1000;

export type AgentToken = {
  agentId?: string;
  role?: AgentRole;
  /** When the agent signed in (ms). Auth.js re-signs the JWT on every read, so its own expiry slides. */
  signedInAt?: number;
};

export function isSessionExpired(signedInAt: number | undefined, now: number): boolean {
  return signedInAt === undefined || now - signedInAt > SESSION_MAX_AGE_MS;
}

/**
 * Auth.js `jwt` callback logic. Stamps the sign-in time once, then ends the session 8 hours later
 * however often it is used: returning null clears the session cookie.
 */
export function nextToken<T extends AgentToken>(
  token: T,
  user: { id?: string; role: AgentRole } | undefined,
  now: number = Date.now(),
): T | null {
  if (user?.id) {
    return { ...token, agentId: user.id, role: user.role, signedInAt: now };
  }
  if (isSessionExpired(token.signedInAt, now)) {
    return null;
  }
  return token;
}
