import "server-only";

import { z } from "zod";

import type { AgentRole } from "@/generated/prisma/client";
import { db } from "@/lib/db";
import { clearRateLimit, hitRateLimit, type RateLimitRule } from "@/lib/rate-limit";

import { verifyAgainstDummy, verifyPassword } from "./password";

export const SignInSchema = z.object({
  // Lowercased so "Amara@Example.com" and "amara@example.com" are one account (review C4).
  email: z.string().trim().toLowerCase().pipe(z.email().max(254)),
  password: z.string().min(1).max(200),
});

export type SignInInput = z.infer<typeof SignInSchema>;

// 5 tries per 15 minutes per IP + email (architecture §5, ADR 0005). A successful sign-in clears
// the count, so in practice it limits failed tries.
export const SIGN_IN_LIMIT: RateLimitRule = { bucket: "signin", limit: 5, windowMs: 15 * 60 * 1000 };

// Against password spraying: 30 tries per 15 minutes from one address, across all emails.
export const SIGN_IN_IP_LIMIT: RateLimitRule = { bucket: "signin-ip", limit: 30, windowMs: 15 * 60 * 1000 };

export type SignedInAgent = { id: string; name: string; email: string; role: AgentRole };

export type CredentialsResult =
  | { ok: true; agent: SignedInAgent }
  | { ok: false; reason: "invalid" | "rate_limited" };

/**
 * Checks a sign-in attempt. Every failure other than the rate limit is the same "invalid",
 * whether the email, the password or the account's active flag was wrong (US-12 AC3).
 */
export async function checkCredentials(raw: unknown, ip: string): Promise<CredentialsResult> {
  const parsed = SignInSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, reason: "invalid" };
  }
  const { email, password } = parsed.data;

  const perEmail = await hitRateLimit(SIGN_IN_LIMIT, [ip, email]);
  const perIp = await hitRateLimit(SIGN_IN_IP_LIMIT, [ip]);
  if (!perEmail.allowed || !perIp.allowed) {
    return { ok: false, reason: "rate_limited" };
  }

  const agent = await db.agent.findUnique({ where: { email } });
  if (!agent) {
    await verifyAgainstDummy(password);
    return { ok: false, reason: "invalid" };
  }

  const passwordOk = await verifyPassword(agent.passwordHash, password);
  if (!passwordOk || !agent.active) {
    return { ok: false, reason: "invalid" };
  }

  await clearRateLimit(SIGN_IN_LIMIT, [ip, email]);
  return { ok: true, agent: { id: agent.id, name: agent.name, email: agent.email, role: agent.role } };
}
