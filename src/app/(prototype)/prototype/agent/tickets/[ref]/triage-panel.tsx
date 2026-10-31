"use client";

import { CheckIcon, ChevronRightIcon, Loader2Icon } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AiStateBadge, ConfidenceLabel } from "../../../_components/badges";
import { AGENT, CATEGORIES, PRIORITIES, type Ticket } from "../../../_data/sample";

type Props = { ticket: Ticket; pending: boolean };

/** Right-hand triage panel (S6): AI values pre-selected; changing one is an override (US-06). */
export function TriagePanel({ ticket, pending }: Props) {
  const ai = pending ? null : ticket.triage;
  const [category, setCategory] = useState<string>(ai?.category ?? "");
  const [priority, setPriority] = useState<string>(ai?.priority ?? "");
  const [confirmedBy, setConfirmedBy] = useState<string | null>(ai?.confirmedBy ?? null);
  const [saved, setSaved] = useState<{ category: string; priority: string } | null>(
    ai?.confirmedBy ? { category: ai.category, priority: ai.priority } : null,
  );
  const [message, setMessage] = useState("");
  const [error, setError] = useState<string | null>(null);

  const catChanged = !!ai && category !== ai.category;
  const priChanged = !!ai && priority !== ai.priority;
  const dirty = !saved || saved.category !== category || saved.priority !== priority;

  function save() {
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

  function fieldNote(changed: boolean, aiValue: string | undefined, confidence: number | undefined) {
    if (!ai || aiValue === undefined || confidence === undefined) {
      return <span className="text-xs text-muted-foreground">Set by you</span>;
    }
    if (changed) {
      return (
        <span className="text-xs font-medium text-amber-900">
          Changed by you · AI suggested {aiValue}
          {saved ? " · override logged" : " · logged when you save"}
        </span>
      );
    }
    return <ConfidenceLabel value={confidence} />;
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
          <SelectTrigger id="category" className="h-9 w-full">
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
        {fieldNote(catChanged, ai?.category, ai?.confidence.category)}
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="priority">Priority</Label>
        <Select value={priority} onValueChange={setPriority}>
          <SelectTrigger id="priority" className="h-9 w-full">
            <SelectValue placeholder={ticket.triage ? "Choose a priority" : "High (default)"} />
          </SelectTrigger>
          <SelectContent>
            {PRIORITIES.map((p) => (
              <SelectItem key={p} value={p}>
                {p}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {fieldNote(priChanged, ai?.priority, ai?.confidence.priority)}
      </div>

      {ai && (
        <div className="flex flex-col gap-1">
          <p className="text-sm font-medium">Sentiment</p>
          <p className="text-sm">
            {ai.sentiment} <span className="text-xs text-muted-foreground">(AI-suggested, read-only)</span>
          </p>
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
              {Math.round(ai.confidence.priority * 100)}% · Prompt triage.v1
            </p>
          </CollapsibleContent>
        </Collapsible>
      )}

      {error && (
        <p className="text-sm font-medium text-destructive" role="alert">
          {error}
        </p>
      )}

      <Button onClick={save} variant={dirty ? "default" : "outline"} disabled={!dirty} className="h-9">
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
