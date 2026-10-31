import type { Metadata } from "next";
import { Suspense } from "react";
import { AgentShell } from "../../_components/shells";
import { Dashboard } from "./dashboard";

export const metadata: Metadata = { title: "Dashboard (prototype S7)" };

const STATES = [
  { value: "empty", label: "Empty period" },
  { value: "widget-error", label: "One widget fails" },
  { value: "forbidden", label: "Agent (403)" },
];

export default function DashboardPage() {
  return (
    <AgentShell states={STATES}>
      <Suspense fallback={null}>
        <Dashboard />
      </Suspense>
    </AgentShell>
  );
}
