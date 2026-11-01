import type { Metadata } from "next";
import { Suspense } from "react";

import { requireAgent } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Queue" };

// Placeholder until US-05 builds the queue (S5). The guard is real.
async function Queue() {
  await requireAgent();
  return <p className="text-muted-foreground">No tickets to show yet.</p>;
}

export default function QueuePage() {
  return (
    <>
      <h1 className="mb-4 text-2xl font-semibold">Queue</h1>
      <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
        <Queue />
      </Suspense>
    </>
  );
}
