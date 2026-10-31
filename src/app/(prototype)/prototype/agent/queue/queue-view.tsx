"use client";

import { RefreshCwIcon, SparklesIcon, TriangleAlertIcon } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AiStateBadge, PriorityBadge } from "../../_components/badges";
import { useProtoState } from "../../_components/prototype-bar";
import {
  INCOMING_NEW,
  INCOMING_URGENT,
  SUMMARY_WORD_THRESHOLD,
  TICKETS,
  effectivePriority,
  isLowConfidence,
  sortQueue,
  wordCount,
  type Ticket,
} from "../../_data/sample";

type Tab = "open" | "needs-triage" | "replied";

function agentStatus(t: Ticket) {
  if (t.reply) return "Replied";
  if (!t.triage) return "Needs triage";
  return "Open";
}

export function QueueSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-3">
      <span className="sr-only">Loading the queue…</span>
      <Skeleton className="h-8 w-80" />
      {Array.from({ length: 5 }, (_, i) => (
        <Skeleton key={i} className="h-12 w-full" />
      ))}
    </div>
  );
}

export function QueueView() {
  const state = useProtoState();
  const sent = useSearchParams().get("sent");
  const [tab, setTab] = useState<Tab>("open");
  const [extra, setExtra] = useState<Ticket[]>([]);
  const [notice, setNotice] = useState<"new" | "urgent" | null>(null);
  const [refreshed, setRefreshed] = useState(false);
  const toasted = useRef(false);

  // UX-4: after sending, the agent lands back here with a toast.
  useEffect(() => {
    if (sent && !toasted.current) {
      toasted.current = true;
      toast.success(`Reply sent · ${sent}`, { duration: 6000 });
    }
  }, [sent]);

  // UX-3: stands in for the 30 s check. The list never re-orders until the agent clicks Refresh.
  useEffect(() => {
    if (state !== "new" && state !== "new-urgent") return;
    const timer = window.setTimeout(() => setNotice(state === "new" ? "new" : "urgent"), 2500);
    return () => window.clearTimeout(timer);
  }, [state]);

  if (state === "loading") return <QueueSkeleton />;

  const all = state === "empty" ? TICKETS.filter((t) => t.reply) : [...extra, ...TICKETS];
  const open = sortQueue(all.filter((t) => !t.reply && t.ref !== sent));
  const needsTriage = open.filter((t) => !t.triage);
  const replied = all.filter((t) => t.reply);

  function refresh() {
    setExtra((prev) => [...(notice === "urgent" ? [INCOMING_URGENT] : INCOMING_NEW), ...prev]);
    setNotice(null);
    setRefreshed(true);
    // The focused Refresh button disappears, so put focus somewhere predictable (§6).
    document.getElementById("queue-heading")?.focus();
  }

  return (
    <div className="flex flex-col gap-4">
      {state === "error" && (
        <Alert variant="destructive">
          <TriangleAlertIcon aria-hidden="true" />
          <AlertTitle>Couldn&apos;t load the queue.</AlertTitle>
          <AlertDescription>
            Showing the list from 10:41. <Button variant="link" className="h-6 p-0">Try again</Button>
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={tab} onValueChange={(v) => setTab(v as Tab)}>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="open" className="min-h-6">Open ({open.length})</TabsTrigger>
            <TabsTrigger value="needs-triage" className="min-h-6">Needs triage ({needsTriage.length})</TabsTrigger>
            <TabsTrigger value="replied" className="min-h-6">Replied</TabsTrigger>
          </TabsList>

          <div aria-live="polite" className="text-sm">
            {notice === "new" && (
              <p className="flex items-center gap-2">
                3 new tickets ·
                <Button variant="outline" size="sm" onClick={refresh}>
                  <RefreshCwIcon aria-hidden="true" /> Refresh
                </Button>
              </p>
            )}
            {refreshed && !notice && <p className="text-muted-foreground">Queue refreshed.</p>}
          </div>
        </div>

        <div aria-live="assertive">
          {notice === "urgent" && (
            <Alert role={undefined} className="mt-3 border-amber-400 bg-amber-50 text-amber-950">
              <TriangleAlertIcon aria-hidden="true" />
              <AlertTitle className="flex flex-wrap items-center gap-2">
                1 new urgent ticket ·
                <Button size="sm" onClick={refresh}>
                  <RefreshCwIcon aria-hidden="true" /> Refresh
                </Button>
              </AlertTitle>
            </Alert>
          )}
        </div>

        <TabsContent value="open">
          {open.length === 0 ? (
            <div className="rounded-lg border p-8 text-center">
              <p className="font-medium">No open tickets. Nice work.</p>
              <Button
                variant="link"
                onClick={() => {
                  setTab("replied");
                  // This button unmounts with the panel; keep focus on the tab the agent moved to.
                  window.setTimeout(() => document.querySelector<HTMLElement>('[role="tab"][data-state="active"]')?.focus(), 0);
                }}
              >
                See replied tickets
              </Button>
            </div>
          ) : (
            <QueueTable tickets={open} caption="Open tickets, most urgent first, then oldest first" />
          )}
        </TabsContent>
        <TabsContent value="needs-triage">
          {needsTriage.length === 0 ? (
            <p className="rounded-lg border p-8 text-center">Nothing needs manual triage.</p>
          ) : (
            <QueueTable tickets={needsTriage} caption="Tickets where the AI was unavailable" />
          )}
        </TabsContent>
        <TabsContent value="replied">
          <QueueTable tickets={replied} caption="Replied tickets" />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function QueueTable({ tickets, caption }: { tickets: readonly Ticket[]; caption: string }) {
  return (
    <div className="rounded-lg border">
      <Table>
        <TableCaption className="sr-only">{caption}</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Priority</TableHead>
            <TableHead scope="col">Reference</TableHead>
            <TableHead scope="col">Subject</TableHead>
            <TableHead scope="col">Category</TableHead>
            <TableHead scope="col" className="hidden md:table-cell">Sentiment</TableHead>
            <TableHead scope="col" className="hidden md:table-cell">Age</TableHead>
            <TableHead scope="col">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tickets.map((t) => {
            const showSummary = t.triage?.summary && wordCount(t.description) > SUMMARY_WORD_THRESHOLD;
            return (
              <TableRow key={t.ref}>
                <TableCell className="align-top">
                  <div className="flex flex-col items-start gap-1">
                    <PriorityBadge priority={effectivePriority(t)} defaulted={!t.triage} />
                    {!t.triage ? (
                      <AiStateBadge state={{ kind: "unavailable" }} />
                    ) : t.triage.confirmedBy ? (
                      <AiStateBadge state={{ kind: "confirmed", by: t.triage.confirmedBy }} />
                    ) : isLowConfidence(t.triage) ? (
                      <AiStateBadge state={{ kind: "low-confidence" }} />
                    ) : (
                      <AiStateBadge state={{ kind: "unconfirmed" }} />
                    )}
                  </div>
                </TableCell>
                <TableCell className="align-top">
                  <Link href={`/prototype/agent/tickets/${t.ref}`} className="inline-flex min-h-6 items-center font-medium underline underline-offset-4">
                    {t.ref}
                  </Link>
                </TableCell>
                <TableCell className="max-w-xs align-top whitespace-normal">
                  {t.subject}
                  {showSummary && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      <SparklesIcon aria-hidden="true" className="mr-1 inline size-3" />
                      AI summary: “{t.triage?.summary}”
                    </p>
                  )}
                </TableCell>
                <TableCell className="align-top">{t.triage?.category ?? "—"}</TableCell>
                <TableCell className="hidden align-top md:table-cell">{t.triage?.sentiment ?? "—"}</TableCell>
                <TableCell className="hidden align-top md:table-cell">{t.age}</TableCell>
                <TableCell className="align-top">{agentStatus(t)}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
