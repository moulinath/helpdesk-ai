import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CustomerShell } from "../../_components/shells";
import { TICKETS, findByToken } from "../../_data/sample";
import { StatusSkeleton, StatusView } from "./status-view";

export const metadata: Metadata = { title: { absolute: "Your request · Larkfield Goods" } };

export function generateStaticParams() {
  return TICKETS.map((t) => ({ token: t.token }));
}

const STATES = [
  { value: "loading", label: "Loading" },
  { value: "rating-error", label: "Rating fails" },
];

export default async function StatusPage({ params }: PageProps<"/prototype/t/[token]">) {
  const { token } = await params;
  const ticket = findByToken(token);
  // Invalid, expired or tampered links all get the same S8 page (US-02 AC3).
  if (!ticket) notFound();

  return (
    <CustomerShell states={STATES}>
      <Suspense fallback={<StatusSkeleton />}>
        <StatusView ticket={ticket} />
      </Suspense>
    </CustomerShell>
  );
}
