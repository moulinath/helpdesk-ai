import { Suspense, type ReactNode } from "react";

import { AgentHeaderContent } from "@/components/agent/agent-header";
import { SkipLink } from "@/components/skip-link";

/** S5–S7 shell. Each page still runs its own guard: layouts don't re-render on navigation. */
export default function SignedInLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SkipLink />
      <header className="border-b bg-muted/40">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <span className="font-semibold">HelpDesk</span>
          <Suspense fallback={null}>
            <AgentHeaderContent />
          </Suspense>
        </div>
      </header>
      <main id="main" tabIndex={-1} className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 outline-none">
        {children}
      </main>
    </>
  );
}
