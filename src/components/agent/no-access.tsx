import Link from "next/link";

import { SkipLink } from "@/components/skip-link";

/** 403 view (S7: an agent opening the dashboard). */
export function NoAccess() {
  return (
    <>
      <SkipLink />
      <main
        id="main"
        tabIndex={-1}
        className="mx-auto flex w-full max-w-xl flex-1 flex-col justify-center gap-4 p-6 outline-none"
      >
        <h1 className="text-2xl font-semibold">You don&apos;t have access to this page</h1>
        <p className="text-muted-foreground">The dashboard is for team leads.</p>
        <p>
          <Link className="font-medium underline underline-offset-4" href="/agent/queue">
            Back to the queue
          </Link>
        </p>
      </main>
    </>
  );
}
