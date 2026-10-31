import { redirect } from "next/navigation";
import { Suspense } from "react";

import { requireAgent } from "@/lib/auth/guards";

// After sign-in: agents land on the queue, leads on the dashboard (S4). proxy.ts usually does
// this first; this is the fallback.
async function RouteByRole(): Promise<never> {
  const agent = await requireAgent();
  redirect(agent.role === "lead" ? "/agent/dashboard" : "/agent/queue");
}

export default function AgentHome() {
  return (
    <Suspense fallback={null}>
      <RouteByRole />
    </Suspense>
  );
}
