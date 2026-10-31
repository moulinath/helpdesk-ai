"use client";

import { ChevronRightIcon } from "lucide-react";
import { useEffect, useId, useRef, useState, type FormEvent } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { useProtoState } from "../../_components/prototype-bar";
import { StatusStepper } from "../../_components/status-stepper";
import type { Ticket } from "../../_data/sample";

const SCALE = ["Very dissatisfied", "Dissatisfied", "Neutral", "Satisfied", "Very satisfied"] as const;

export function StatusSkeleton() {
  return (
    <div aria-busy="true" className="flex flex-col gap-4">
      <h1 className="sr-only">Loading your request…</h1>
      <Skeleton className="h-8 w-3/4" />
      <Skeleton className="h-4 w-1/3" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-40 w-full" />
    </div>
  );
}

// Customers never see AI labels, priority, sentiment, summary or unapproved drafts (US-07 AC2).
export function StatusView({ ticket }: { ticket: Ticket }) {
  const state = useProtoState();
  if (state === "loading") return <StatusSkeleton />;

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold">
          {ticket.ref} · {ticket.subject}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">Submitted {ticket.receivedAt}</p>
      </div>

      <StatusStepper status={ticket.status} />

      <Collapsible>
        <CollapsibleTrigger className="group inline-flex min-h-6 items-center gap-1 font-medium">
          <ChevronRightIcon aria-hidden="true" className="size-4 transition-transform group-data-[state=open]:rotate-90" />
          Your message
        </CollapsibleTrigger>
        <CollapsibleContent>
          <p className="mt-2 rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-line">{ticket.description}</p>
        </CollapsibleContent>
      </Collapsible>

      <section aria-labelledby="reply-heading" className="flex flex-col gap-3">
        <h2 id="reply-heading" className="text-lg font-semibold">
          Reply
        </h2>
        {ticket.reply ? (
          <Card>
            <CardContent className="flex flex-col gap-2">
              <p className="text-sm text-muted-foreground">
                Reply from {ticket.reply.agent} · {ticket.reply.sentAt}
              </p>
              <p className="whitespace-pre-line">{ticket.reply.body}</p>
            </CardContent>
          </Card>
        ) : (
          <p className="text-muted-foreground">No reply yet. We&apos;ll post it here as soon as an agent has replied.</p>
        )}
      </section>

      {ticket.reply && <Rating ticket={ticket} failSave={state === "rating-error"} />}
    </div>
  );
}

function Rating({ ticket, failSave }: { ticket: Ticket; failSave: boolean }) {
  const id = useId();
  const [score, setScore] = useState<string>("");
  const [comment, setComment] = useState("");
  const [saved, setSaved] = useState(ticket.rating ?? null);
  const [error, setError] = useState<string | null>(null);
  const [justSaved, setJustSaved] = useState(false);
  const thanksRef = useRef<HTMLHeadingElement>(null);

  // The form (and its focused button) disappears on save, so move focus to the confirmation (P4, SC 4.1.3).
  useEffect(() => {
    if (justSaved) thanksRef.current?.focus();
  }, [justSaved]);

  if (saved) {
    return (
      <section aria-labelledby={`${id}-h`} className="rounded-lg border p-4">
        <h2 id={`${id}-h`} ref={thanksRef} tabIndex={-1} className="font-semibold">
          Thanks for your feedback.
        </h2>
        <p className="mt-1 text-sm">
          You rated this reply {saved.score} out of 5 ({SCALE[saved.score - 1]}).
        </p>
        {saved.comment && <p className="mt-1 text-sm text-muted-foreground">Your comment: “{saved.comment}”</p>}
      </section>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!score) {
      setError("Please choose a rating from 1 to 5.");
      return;
    }
    if (failSave) {
      setError("We couldn't save your rating. Please try again.");
      return;
    }
    setError(null);
    setSaved({ score: Number(score), comment: comment.trim() || undefined });
    setJustSaved(true);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-lg border p-4" noValidate>
      <fieldset className="flex flex-col gap-3" aria-describedby={error ? `${id}-err` : undefined}>
        <legend id={`${id}-legend`} className="mb-2 font-semibold">How satisfied are you with this reply?</legend>
        <RadioGroup aria-labelledby={`${id}-legend`} value={score} onValueChange={setScore} className="grid grid-cols-1 gap-2 sm:grid-cols-5">
          {SCALE.map((label, i) => (
            <div key={label} className="flex items-center gap-2 rounded-md border p-2 sm:flex-col sm:text-center">
              <RadioGroupItem value={String(i + 1)} id={`${id}-r${i + 1}`} />
              <Label htmlFor={`${id}-r${i + 1}`} className="text-sm font-normal sm:flex-col">
                <span className="font-semibold">{i + 1}</span> {label}
              </Label>
            </div>
          ))}
        </RadioGroup>
      </fieldset>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-comment`}>Comment (optional)</Label>
        <Textarea id={`${id}-comment`} value={comment} onChange={(e) => setComment(e.target.value)} maxLength={500} rows={3} />
        <p className="text-right text-sm text-muted-foreground">{comment.length} of 500 characters</p>
      </div>
      <div aria-live="assertive">
        {error && (
          <Alert variant="destructive" role={undefined}>
            <AlertTitle id={`${id}-err`}>{error}</AlertTitle>
          </Alert>
        )}
      </div>
      <Button type="submit" size="lg" className="h-11 w-full sm:w-auto sm:self-start">
        Send rating
      </Button>
    </form>
  );
}
