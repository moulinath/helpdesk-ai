"use client";

import { CheckIcon, ChevronRightIcon, Loader2Icon } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiStateBadge, ConfidenceLabel } from "../../../_components/badges";
import { AGENT, CATEGORIES, PRIORITIES, type Ticket } from "../../../_data/sample";

type Props = { ticket: Ticket; pending: boolean; onConfirmedChange: (confirmed: boolean) => void };

/** Right-hand triage panel (S6): AI values pre-selected; changing one is an override (US-06). */
export function TriagePanel({ ticket, pending, onConfirmedChange }: Props) {
  const ai = pending ? null : ticket.triage;
  const [category, setCategory] = useState<string>(ai?.category ?? "");
  const [priority, setPriority] = useState<string>(ai?.priority ?? (ticket.triage ? "" : "High"));
  const [confirmedBy, setConfirmedBy] = useState<string | null>(ai?.confirmedBy ?? null);
  const [saved, setSaved] = useState<{ category: string; priority: string } | null>(
    ai?.confirmedBy ? { category: ai.category, priority: ai.priority } : null,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const catChanged = !!ai && category !== ai.category;
  const priChanged = !!ai && priority !== ai.priority;
  const dirty = !saved || saved.category !== category || saved.priority !== priority;

  useEffect(() => onConfirmedChange(!dirty), [dirty, onConfirmedChange]);

  function save() {
    if (!dirty) return; // aria-disabled keeps the button focusable after confirming.
    if (!category || !priority) {
      setError("Choose a category and a priority first.");
      return;
    }
    setError(null);
    setConfirmedBy(AGENT.firstName);
    setSaved({ category, priority });
    setMessage(
      catChanged || priChanged
        ? `Override saved and logged. Labels confirmed by ${AGENT.firstName}.`
        : `Labels confirmed by ${AGENT.firstName}.`,
    );
  }

  // Each note is linked to its Select with aria-describedby, so screen readers hear the AI label (P3).
  function fieldNote(id: string, changed: boolean, aiValue: string | undefined, confidence: number | undefined, fallback = "Set by you") {
    if (!ai || aiValue === undefined || confidence === undefined) {
      return (
        <span id={id} className="text-xs text-muted-foreground">
          {fallback}
        </span>
      );
    }
    if (changed) {
      return (
        <span id={id} className="text-xs font-medium text-amber-900">
          Changed by you · AI suggested {aiValue}
          {saved ? " · override logged" : " · logged when you save"}
        </span>
      );
    }
    return <ConfidenceLabel id={id} value={confidence} />;
  }

  return (
    <section aria-labelledby="triage-heading" className="flex flex-col gap-4 rounded-lg border p-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h2 id="triage-heading" className="text-lg font-semibold">
          Triage
        </h2>
        {!ticket.triage ? (
          <AiStateBadge state={{ kind: "unavailable" }} />
        ) : confirmedBy && !dirty ? (
          <AiStateBadge state={{ kind: "confirmed", by: confirmedBy }} />
        ) : pending ? null : (
          <AiStateBadge state={{ kind: "unconfirmed" }} />
        )}
      </div>

      {pending && (
        <p className="flex items-center gap-2 text-sm text-muted-foreground" role="status">
          <Loader2Icon aria-hidden="true" className="size-4 animate-spin" />
          AI is reviewing this ticket… You can set the labels yourself without waiting.
        </p>
      )}

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="category">Category</Label>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger id="category" aria-describedby="category-note" className="h-9 w-full">
            <SelectValue placeholder="Choose a category" />
          </SelectTrigger>
          <SelectContent>
            {CATEGORIES.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldNote("category-note", catChanged, ai?.category, ai?.confidence.category)}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="priority" aria-describedby="priority-note" className="h-9 w-full">
            <SelectValue placeholder="Choose a priority" />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldNote(
          "priority-note",
          priChanged,
          ai?.priority,
          ai?.confidence.priority,
          ticket.triage ? "Set by you" : "High by default while the AI is unavailable",
        )}
      </div>

      {ai && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Sentiment</p>
          <p className="text-sm">
            {ai.sentiment} <span className="text-xs text-muted-foreground">(read-only)</span>
          </p>
          <ConfidenceLabel value={ai.confidence.sentiment} />
        </div>
      )}

      {ai && (
        <Collapsible>
          <CollapsibleTrigger className="group inline-flex min-h-6 items-center gap-1 text-sm font-medium">
            <ChevronRightIcon aria-hidden="true" className="size-4 transition-transform group-data-[state=open]:rotate-90" />
            Why?
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2 flex flex-col gap-1 rounded-md bg-muted/50 p-3 text-sm">
            <p>“{ai.reason}”</p>
            <p className="text-xs text-muted-foreground">
              Category confidence {Math.round(ai.confidence.category * 100)}% · Priority confidence{" "}
              {Math.round(ai.confidence.priority * 100)}% · Sentiment confidence{" "}
              {Math.round(ai.confidence.sentiment * 100)}% · Prompt triage.v1
            </p>
          </CollapsibleContent>
        </Collapsible>
      )}

      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button onClick={save} variant={dirty ? "default" : "outline"} aria-disabled={!dirty} className="h-9">
        {!dirty ? (
          <>
            <CheckIcon aria-hidden="true" /> Labels confirmed
          </>
        ) : catChanged || priChanged || !ai ? (
          "Save labels"
        ) : (
          "Confirm labels"
        )}
      </Button>
      <p aria-live="polite" className="sr-only">
        {message}
      </p>
    </section>
  );
}
