"use client";

import { CloudOffIcon, LanguagesIcon, SearchXIcon, SparklesIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { PriorityBadge } from "../../../_components/badges";
import { useProtoState } from "../../../_components/prototype-bar";
import { useSubmission, withSubmission } from "../../../_components/submission";
import { AGENT, SUMMARY_WORD_THRESHOLD, isLowConfidence, wordCount, type Ticket } from "../../../_data/sample";
import { AskKb, ReplyPanel } from "./reply-panel";
import { TriagePanel } from "./triage-panel";

export function DetailSkeleton() {
  return (
    <div aria-busy="true" className="grid gap-6 lg:grid-cols-[1fr_22rem]">
      <h1 className="sr-only">Loading the ticket…</h1>
      <Skeleton className="h-72" />
      <Skeleton className="h-72" />
      <Skeleton className="h-56 lg:col-span-2" />
    </div>
  );
}

function Banner({ icon, children, tone = "amber" }: { icon: ReactNode; children: ReactNode; tone?: "amber" | "grey" }) {
  return (
    <Alert role="note" className={tone === "amber" ? "border-amber-400 bg-amber-50 text-amber-950" : "border-slate-300 bg-slate-100 text-slate-900"}>
      {icon}
      <AlertDescription className="text-current">{children}</AlertDescription>
    </Alert>
  );
}

function Contact({ ticket }: { ticket: Ticket }) {
  const [revealedAt, setRevealedAt] = useState<string | null>(null);
  const revealedRef = useRef<HTMLSpanElement>(null);
  // The button disappears on reveal, so move focus to what it revealed.
  useEffect(() => {
    if (revealedAt) revealedRef.current?.focus();
  }, [revealedAt]);
  if (!revealedAt) {
    return (
      <Button
        variant="link"
        className="h-6 p-0"
        onClick={() => setRevealedAt(new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit" }))}
      >
        Show contact
      </Button>
    );
  }
  return (
    <span ref={revealedRef} tabIndex={-1} className="flex flex-col text-sm outline-none focus-visible:outline-2">
      <span>
        {ticket.customerFullName} · {ticket.customerEmail}
      </span>
      <span className="text-xs text-muted-foreground">
        Reveal logged: {AGENT.firstName}, {revealedAt}
      </span>
    </span>
  );
}

function TicketHeader({ ticket }: { ticket: Ticket }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="text-sm">
        <Link href="/prototype/agent/queue" className="underline underline-offset-4">
          Back to queue
        </Link>
      </p>
      <h1 className="text-2xl font-semibold">
        {ticket.ref} · {ticket.subject}
      </h1>
      <div className="flex flex-wrap items-center gap-x-2 text-sm text-muted-foreground">
        <span>Received {ticket.receivedAt}</span>
        <span aria-hidden="true">·</span>
        <span className="text-foreground">{ticket.customerFirstName}</span>
        <Contact ticket={ticket} />
      </div>
    </div>
  );
}

function Message({ ticket }: { ticket: Ticket }) {
  const showSummary = !!ticket.triage?.summary && wordCount(ticket.description) > SUMMARY_WORD_THRESHOLD;
  return (
    <section aria-labelledby="message-heading" className="flex flex-col gap-3">
      {showSummary && (
        <div className="rounded-lg border border-dashed p-3">
          <p className="mb-1 flex items-center gap-1 text-xs font-medium text-muted-foreground">
            <SparklesIcon aria-hidden="true" className="size-3" /> AI summary · check the full message
          </p>
          <p className="text-sm">{ticket.triage?.summary}</p>
        </div>
      )}
      <h2 id="message-heading" className="font-semibold">
        Full message
      </h2>
      <p className="text-sm leading-relaxed whitespace-pre-line">{ticket.description}</p>
      <p className="text-xs text-muted-foreground">{wordCount(ticket.description)} words</p>
    </section>
  );
}

export function TicketDetail({ ticket: sample }: { ticket: Ticket }) {
  const submission = useSubmission();
  const ticket = withSubmission(sample, submission);
  // Remount once the reviewer's own text arrives after hydration, so the editor starts from it (F6).
  return <TicketDetailView key={ticket === sample ? "sample" : "submission"} ticket={ticket} />;
}

function TicketDetailView({ ticket }: { ticket: Ticket }) {
  const state = useProtoState();
  const [labelsConfirmed, setLabelsConfirmed] = useState(false);
  const onConfirmedChange = useCallback((c: boolean) => setLabelsConfirmed(c), []);
  if (state === "loading") return <DetailSkeleton />;
  if (ticket.reply) return <ReadOnly ticket={ticket} />;

  const pending = state === "pending";
  const t = ticket.triage;

  return (
    <div className="flex flex-col gap-6">
      <TicketHeader ticket={ticket} />

      {!pending && (
        <div className="flex flex-col gap-2">
          {!t && (
            <Banner tone="grey" icon={<CloudOffIcon aria-hidden="true" />}>
              <strong>AI unavailable:</strong> set the category and priority yourself. No draft was generated.
            </Banner>
          )}
          {t && isLowConfidence(t) && (
            <Banner icon={<TriangleAlertIcon aria-hidden="true" />}>
              <strong>Low confidence:</strong> the AI wasn&apos;t sure about this one. Read the full message before marking the labels as checked.
            </Banner>
          )}
          {t?.flag === "non-english" && (
            <Banner icon={<LanguagesIcon aria-hidden="true" />}>
              <strong>Non-English ticket:</strong> no draft generated. Reply manually.
            </Banner>
          )}
          {t?.flag === "no-faq-match" && (
            <Banner icon={<SearchXIcon aria-hidden="true" />}>
              <strong>No FAQ match:</strong> write a personal reply.
            </Banner>
          )}
        </div>
      )}

      {/* DOM order = tab order: ticket → triage → reply (§6). Stacks below 1024 px (§7). */}
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Message ticket={ticket} />
        <TriagePanel ticket={ticket} pending={pending} onConfirmedChange={onConfirmedChange} />
      </div>
      <ReplyPanel ticket={ticket} pending={pending} failSend={state === "send-error"} labelsConfirmed={labelsConfirmed} />
      <AskKb />
    </div>
  );
}

const EDIT_LEVEL = {
  none: "AI draft sent unchanged",
  minor: "AI draft sent with minor edits",
  major: "AI draft sent with major edits",
} as const;

function ReadOnly({ ticket }: { ticket: Ticket }) {
  const reply = ticket.reply;
  const t = ticket.triage;
  if (!reply) return null;
  return (
    <div className="flex flex-col gap-6">
      <TicketHeader ticket={ticket} />
      <p className="rounded-md border bg-muted/40 p-3 text-sm">This ticket has been replied to. The view is read-only.</p>
      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <Message ticket={ticket} />
        <section aria-labelledby="labels-heading" className="flex flex-col gap-3 rounded-lg border p-4 text-sm">
          <h2 id="labels-heading" className="text-lg font-semibold">
            Labels
          </h2>
          {t ? (
            <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
              <dt className="text-muted-foreground">Category</dt>
              <dd>{t.category}</dd>
              <dt className="text-muted-foreground">Priority</dt>
              <dd>
                <PriorityBadge priority={t.priority} />
              </dd>
              <dt className="text-muted-foreground">Sentiment</dt>
              <dd>{t.sentiment}</dd>
            </dl>
          ) : (
            <p>Set manually.</p>
          )}
          <h3 className="mt-2 font-medium">Label history</h3>
          <ul className="list-disc pl-4">
            {(ticket.labelHistory ?? []).map((h) => (
              <li key={h}>{h}</li>
            ))}
          </ul>
          <h3 className="mt-2 font-medium">Contact reveals</h3>
          {ticket.contactReveals?.length ? (
            <ul className="list-disc pl-4">
              {ticket.contactReveals.map((r) => (
                <li key={r}>{r}</li>
              ))}
            </ul>
          ) : (
            <p className="text-muted-foreground">None</p>
          )}
        </section>
      </div>
      <section aria-labelledby="sent-heading" className="flex flex-col gap-2 rounded-lg border p-4">
        <h2 id="sent-heading" className="text-lg font-semibold">
          Sent reply
        </h2>
        <p className="text-sm text-muted-foreground">
          Sent by {reply.agent} · {reply.sentAt} · {EDIT_LEVEL[reply.editLevel]}
        </p>
        <p className="text-sm whitespace-pre-line">{reply.body}</p>
      </section>
    </div>
  );
}
