import "server-only";

import { forbidden, redirect } from "next/navigation";
import { connection } from "next/server";
import { cache } from "react";

import { auth } from "@/auth";
import { db } from "@/lib/db";

import type { SignedInAgent } from "./credentials";

/**
 * The signed-in, active agent, or null. Looks the agent up on every request, so deactivating one
 * takes effect on their next request rather than when the 8-hour session ends (ADR 0005).
 * `cache` shares one lookup between a layout and its page.
 */
export const currentAgent = cache(async (): Promise<SignedInAgent | null> => {
  // Request time only: Auth.js uses crypto before it reads cookies, which Cache Components
  // refuses during prerendering.
  await connection();
  const session = await auth();
  const agentId = session?.user?.id;
  if (!agentId) {
    return null;
  }
  const agent = await db.agent.findUnique({
    where: { id: agentId },
    select: { id: true, name: true, email: true, role: true, active: true },
  });
  if (!agent?.active) {
    return null;
  }
  return { id: agent.id, name: agent.name, email: agent.email, role: agent.role };
});

/** For agent pages and Server Actions: signed-out users go to sign-in (US-12 AC1). */
export async function requireAgent(): Promise<SignedInAgent> {
  const agent = await currentAgent();
  if (!agent) {
    redirect("/agent/sign-in");
  }
  return agent;
}

/** For lead-only pages: agents get the 403 page (US-12 AC4, S7). */
export async function requireLead(): Promise<SignedInAgent> {
  const agent = await requireAgent();
  if (agent.role !== "lead") {
    forbidden();
  }
  return agent;
}

/** For agent Route Handlers: a 401 response instead of a redirect (US-12 AC1). */
export async function agentOrUnauthorized(): Promise<SignedInAgent | Response> {
  const agent = await currentAgent();
  return agent ?? Response.json({ error: "unauthorized" }, { status: 401 });
}
