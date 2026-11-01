import type { Metadata } from "next";

import { NoAccess } from "@/components/agent/no-access";

export const metadata: Metadata = { title: "No access", robots: { index: false } };

// Static 403 view. proxy.ts serves it with HTTP 403 to agents on lead-only pages: a guard inside a
// Suspense boundary can't change the status once streaming has started. Outside /agent so the
// proxy's own fetch of it isn't intercepted.
export default function NoAccessPage() {
  return <NoAccess />;
}
