import type { AgentRole } from "@/generated/prisma/client";

/**
 * Seeded demo accounts for reviewers (US-12 AC5). The passwords are public by design (RAID R19):
 * the demo holds fictional data only. Override them with DEMO_AGENT_PASSWORD / DEMO_LEAD_PASSWORD.
 */
export type EnvVars = Readonly<Record<string, string | undefined>>;

export type DemoAccount = { email: string; name: string; role: AgentRole; password: string };

export function demoAccounts(env: EnvVars = process.env): DemoAccount[] {
  return [
    {
      email: "daniel@larkfield.example",
      name: "Daniel Kim",
      role: "agent",
      password: env["DEMO_AGENT_PASSWORD"] || "demo-agent-2026",
    },
    {
      email: "priya@larkfield.example",
      name: "Priya Shah",
      role: "lead",
      password: env["DEMO_LEAD_PASSWORD"] || "demo-lead-2026",
    },
  ];
}

/**
 * The public default passwords are fine on the demo and locally, never on a production deployment
 * that isn't the demo (review C12).
 */
export function assertSafeToSeed(env: EnvVars = process.env): void {
  const usingDefaults = !env["DEMO_AGENT_PASSWORD"] || !env["DEMO_LEAD_PASSWORD"];
  if (env["NODE_ENV"] === "production" && env["DEMO_MODE"] !== "true" && usingDefaults) {
    throw new Error(
      "Refusing to seed the public default passwords in production without DEMO_MODE=true. " +
        "Set DEMO_AGENT_PASSWORD and DEMO_LEAD_PASSWORD, or DEMO_MODE=true for the demo.",
    );
  }
}
