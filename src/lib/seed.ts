import { hash } from "@node-rs/argon2";

import type { PrismaClient } from "@/generated/prisma/client";

import { demoAccounts } from "./demo-accounts";

/**
 * Creates or refreshes the demo agent and lead (US-12 AC5). Safe to run repeatedly: accounts are
 * matched by email, re-activated and given the current demo password. Argon2id by default.
 */
export async function seedDemoAccounts(db: PrismaClient, env: NodeJS.ProcessEnv = process.env) {
  const accounts = demoAccounts(env);
  for (const account of accounts) {
    const passwordHash = await hash(account.password);
    await db.agent.upsert({
      where: { email: account.email },
      create: { email: account.email, name: account.name, role: account.role, passwordHash },
      update: { name: account.name, role: account.role, passwordHash, active: true },
    });
  }
  return accounts.map((account) => account.email);
}
