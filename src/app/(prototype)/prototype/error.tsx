"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { CustomerShell } from "./_components/shells";

// S8 "generic error": same calm copy, plus a retry.
export default function PrototypeError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <CustomerShell>
      <title>Something went wrong · Larkfield Goods</title>
      <h1 className="text-2xl font-semibold">Something went wrong</h1>
      <p className="mt-3">Please try again. If you&apos;re looking for a support request, use the link from your confirmation.</p>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Button onClick={reset}>Try again</Button>
        <Link href="/prototype/support" className="font-medium underline underline-offset-4">
          Contact support
        </Link>
      </div>
    </CustomerShell>
  );
}
