import type { Metadata } from "next";
import { Suspense } from "react";
import { AgentShell } from "../../_components/shells";
import { QueueSkeleton, QueueView } from "./queue-view";

export const metadata: Metadata = { title: "Queue (prototype S5)" };

const STATES = [
  { value: "loading", label: "Loading" },
  { value: "empty", label: "Empty" },
  { value: "error", label: "Error" },
  { value: "new", label: "New tickets arrive" },
  { value: "new-urgent", label: "New urgent ticket arrives" },
];

export default function QueuePage() {
  return (
    <AgentShell states={STATES}>
      <h1 id="queue-heading" tabIndex={-1} className="mb-4 text-2xl font-semibold outline-none">
        Queue
      </h1>
      <Suspense fallback={<QueueSkeleton />}>
        <QueueView />
      </Suspense>
    </AgentShell>
  );
}
