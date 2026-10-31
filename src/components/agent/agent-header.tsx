import { signOut } from "@/auth";
import { requireAgent } from "@/lib/auth/guards";

import { AgentNavLinks } from "./nav-links";

async function signOutAction() {
  "use server";
  await signOut({ redirectTo: "/agent/sign-in" });
}

/** Signed-in name, nav and Sign out (S4). Reads the session, so it renders inside Suspense. */
export async function AgentHeaderContent() {
  const agent = await requireAgent();
  const isLead = agent.role === "lead";
  return (
    <>
      <AgentNavLinks isLead={isLead} />
      <div className="flex items-center gap-3 text-sm">
        <span>
          {agent.name}
          {isLead && <span className="text-muted-foreground"> · Team lead</span>}
        </span>
        <form action={signOutAction}>
          <button
            type="submit"
            className="inline-flex min-h-6 items-center underline underline-offset-4"
          >
            Sign out
          </button>
        </form>
      </div>
    </>
  );
}
