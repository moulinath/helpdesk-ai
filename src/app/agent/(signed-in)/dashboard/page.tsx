import type { Metadata } from "next";
import { Suspense } from "react";

import { requireLead } from "@/lib/auth/guards";

export const metadata: Metadata = { title: "Dashboard" };

// Placeholder until US-08 builds the dashboard (S7). Lead only: agents get the 403 page.
async function Dashboard() {
  await requireLead();
  return <p className="text-muted-foreground">No data to show yet.</p>;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <h1 className="mb-4 text-2xl font-semibold">Dashboard</h1>
      <Dashboard />
    </Suspense>
  );
}
