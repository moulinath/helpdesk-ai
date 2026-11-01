import "server-only";

import { hash, verify } from "@node-rs/argon2";

// @node-rs/argon2 defaults to Argon2id (ADR 0005).
export function hashPassword(password: string): Promise<string> {
  return hash(password);
}

export function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return verify(passwordHash, password);
}

/**
 * An Argon2id hash (default parameters) of a random string nobody knows. Checked when no agent
 * matches the email, so an unknown email takes as long as a wrong password, including on the
 * first request after a cold start (US-12 AC3).
 */
const DUMMY_HASH =
  "$argon2id$v=19$m=19456,t=2,p=1$ZwPmzvAH5qtTNCokOGknNw$t458ZLMg7LaWX38AtgTPuRr6Yr/DlOIMdUDpVz/D90w";

export async function verifyAgainstDummy(password: string): Promise<false> {
  await verify(DUMMY_HASH, password);
  return false;
}
