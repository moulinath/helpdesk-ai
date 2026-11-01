import "server-only";

import { createHmac } from "node:crypto";

import { db } from "@/lib/db";
import { serverEnv } from "@/lib/env";

export type RateLimitRule = {
  /** Names the limit in the key, e.g. "signin" or "submit". */
  bucket: string;
  limit: number;
  windowMs: number;
};

export type RateLimitResult = { allowed: boolean; count: number };

/**
 * Key for a rate-limit row. The identifying parts (IP, email) are HMAC-ed with a server secret,
 * because a plain hash of an IPv4 address is easy to reverse (architecture §3).
 */
export function rateLimitKey(bucket: string, parts: readonly string[], secret: string): string {
  const digest = createHmac("sha256", secret).update(parts.join("\n")).digest("hex");
  return `${bucket}:${digest}`;
}

/** Start of the fixed window that `now` falls in. */
export function windowStart(now: Date, windowMs: number): Date {
  return new Date(Math.floor(now.getTime() / windowMs) * windowMs);
}

/** Counts one attempt and says whether it is within the limit. One atomic statement, no race. */
export async function hitRateLimit(
  rule: RateLimitRule,
  parts: readonly string[],
  now: Date = new Date(),
): Promise<RateLimitResult> {
  const key = rateLimitKey(rule.bucket, parts, serverEnv().RATE_LIMIT_SECRET);
  const start = windowStart(now, rule.windowMs);
  const rows = await db.$queryRaw<{ count: number }[]>`
    INSERT INTO "RateLimit" ("key", "windowStart", "count")
    VALUES (${key}, ${start}, 1)
    ON CONFLICT ("key", "windowStart") DO UPDATE SET "count" = "RateLimit"."count" + 1
    RETURNING "count"`;
  const count = rows[0]?.count ?? 1;
  return { allowed: count <= rule.limit, count };
}

/** Forgets the attempts in the current window, e.g. after a successful sign-in. */
export async function clearRateLimit(
  rule: RateLimitRule,
  parts: readonly string[],
  now: Date = new Date(),
): Promise<void> {
  const key = rateLimitKey(rule.bucket, parts, serverEnv().RATE_LIMIT_SECRET);
  await db.rateLimit.deleteMany({ where: { key, windowStart: windowStart(now, rule.windowMs) } });
}

/** Gives back one attempt, e.g. when the work it counted for failed on our side. */
export async function releaseRateLimit(
  rule: RateLimitRule,
  parts: readonly string[],
  now: Date = new Date(),
): Promise<void> {
  const key = rateLimitKey(rule.bucket, parts, serverEnv().RATE_LIMIT_SECRET);
  await db.rateLimit.updateMany({
    where: { key, windowStart: windowStart(now, rule.windowMs), count: { gt: 0 } },
    data: { count: { decrement: 1 } },
  });
}
