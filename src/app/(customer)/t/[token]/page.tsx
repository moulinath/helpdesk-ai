import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { db } from "@/lib/db";
import { formatRef } from "@/lib/tickets/ref";
import { hashToken } from "@/lib/tickets/token";

export const metadata: Metadata = { title: "Your request", robots: { index: false } };

// Minimal landing page for US-01. US-02 adds the private link, copy button, "What happens next"
// and the full not-found behaviour (S2, S3).
async function Confirmation({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  const ticket = await db.ticket.findUnique({
    where: { statusTokenHash: hashToken(token) },
    select: { refNumber: true },
  });
  if (!ticket) {
    notFound();
  }
  return (
    <>
      <h1 className="text-2xl font-semibold">Thanks, we&apos;ve got your request</h1>
      <p className="mt-4 text-muted-foreground">Reference</p>
      <p className="text-3xl font-semibold tracking-tight">{formatRef(ticket.refNumber)}</p>
    </>
  );
}

export default function TicketPage({ params }: PageProps<"/t/[token]">) {
  return (
    <Suspense fallback={<p className="text-muted-foreground">Loading…</p>}>
      <Confirmation params={params} />
    </Suspense>
  );
}
