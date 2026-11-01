import "server-only";

import { createHash, randomBytes } from "node:crypto";

/** 128 bits of randomness, URL-safe (US-02 AC2, NFR-09). Only ever in the customer's link. */
export function newStatusToken(): string {
  return randomBytes(16).toString("base64url");
}

/** What's stored instead of the token (architecture §7.2). */
export function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}
