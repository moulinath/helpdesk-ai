import type { AgentRole } from "@/generated/prisma/client";

/**
 * Seeded demo accounts for reviewers (US-12 AC5). The passwords are public by design (RAID R19):
 * the demo holds fictional data only. Override them with DEMO_AGENT_PASSWORD / DEMO_LEAD_PASSWORD.
 */
export type DemoAccount = { email: string; name: string; role: AgentRole; password: string };

export function demoAccounts(env: NodeJS.ProcessEnv = process.env): DemoAccount[] {
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
