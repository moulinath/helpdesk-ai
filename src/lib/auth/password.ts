import "server-only";

import { randomBytes } from "node:crypto";

import { hash, verify } from "@node-rs/argon2";

// @node-rs/argon2 defaults to Argon2id (ADR 0005).
export function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return verify(passwordHash, password);
}

let dummyHash: Promise<string> | undefined;

/**
 * Checked when no agent matches the email, so an unknown email takes as long as a wrong
 * password and the timing doesn't reveal which accounts exist (US-12 AC3).
 */
export async function verifyAgainstDummy(password: string): Promise<false> {
  dummyHash ??= hash(randomBytes(32).toString("hex"));
  await verify(await dummyHash, password);
  return false;
}
