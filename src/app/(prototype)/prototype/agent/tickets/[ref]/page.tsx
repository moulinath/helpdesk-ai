import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AgentShell } from "../../../_components/shells";
import { INCOMING_NEW, INCOMING_URGENT, TICKETS } from "../../../_data/sample";
import { DetailSkeleton, TicketDetail } from "./ticket-detail";

export const metadata: Metadata = { title: "Ticket (prototype S6)" };

const ALL = [...TICKETS, INCOMING_URGENT, ...INCOMING_NEW];

export function generateStaticParams() {
  return ALL.map((t) => ({ ref: t.ref }));
}

const STATES = [
  { value: "loading", label: "Loading" },
  { value: "pending", label: "AI still running" },
  { value: "send-error", label: "Send fails" },
];

export default async function TicketPage({ params }: PageProps<"/prototype/agent/tickets/[ref]">) {
  const { ref } = await params;
  const ticket = ALL.find((t) => t.ref === ref);
  if (!ticket) notFound();

  return (
    <AgentShell states={STATES}>
      <Suspense fallback={<DetailSkeleton />}>
        <TicketDetail ticket={ticket} />
      </Suspense>
    </AgentShell>
  );
}
