"use client";

import { BookOpenIcon, ChevronRightIcon, SparklesIcon, TriangleAlertIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Alert, AlertTitle } from "@/components/ui/alert";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { FAQ, type FaqEntry, type Ticket } from "../../../_data/sample";

type Props = { ticket: Ticket; pending: boolean; failSend: boolean; labelsConfirmed: boolean };

/** Reply editor (S6). AI text only reaches the customer after Approve → confirm (P2). */
export function ReplyPanel({ ticket, pending, failSend, labelsConfirmed }: Props) {
  const router = useRouter();
  const draft = pending ? null : (ticket.triage?.draft ?? null);
  const [text, setText] = useState(draft ?? "");
  const [usingDraft, setUsingDraft] = useState(draft !== null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faq, setFaq] = useState<FaqEntry | null>(null);
  const sources = usingDraft ? FAQ.filter((f) => ticket.triage?.sources.includes(f.id)) : [];

  function discard() {
    setText("");
    setUsingDraft(false);
    document.getElementById("reply")?.focus();
  }

  function restore() {
    setText(draft ?? "");
    setUsingDraft(true);
    document.getElementById("reply")?.focus();
  }

  function approve() {
    if (!text.trim()) {
      setError("Write a reply before sending.");
      document.getElementById("reply")?.focus();
      return;
    }
    setError(null);
    setConfirmOpen(true);
  }

  function send() {
    if (failSend) {
      setError("Reply not sent. Please try again.");
      return;
    }
    // UX-4: back to the queue with a toast.
    router.push(`/prototype/agent/queue?sent=${ticket.ref}`);
  }

  return (
    <section aria-labelledby="reply-heading" className="flex flex-col gap-3 rounded-lg border p-4">
      <div className="flex flex-wrap items-center gap-2">
        <h2 id="reply-heading" className="text-lg font-semibold">
          <Label htmlFor="reply" className="text-lg">
            Reply
          </Label>
        </h2>
        {usingDraft && (
          <Badge id="draft-label" variant="outline" className="h-6 text-muted-foreground">
            <SparklesIcon aria-hidden="true" /> AI-suggested draft
          </Badge>
        )}
      </div>
      {pending && <p className="text-sm text-muted-foreground">The AI draft will appear here when triage finishes.</p>}

      <Textarea
        id="reply"
        value={text}
        onChange={(e) => setText(e.target.value)}
        rows={10}
        aria-invalid={error === "Write a reply before sending." ? true : undefined}
        aria-describedby={
          [error && "reply-error", usingDraft && "draft-label", sources.length > 0 && "reply-sources"].filter(Boolean).join(" ") ||
          undefined
        }
        placeholder={usingDraft ? undefined : `Hi ${ticket.customerFirstName},`}
      />

      {sources.length > 0 && (
        <div id="reply-sources" className="flex flex-wrap items-center gap-2 text-sm">
          <span>Sources:</span>
          {sources.map((f) => (
            <Button key={f.id} variant="outline" size="sm" onClick={() => setFaq(f)}>
              <BookOpenIcon aria-hidden="true" />
              {f.id} · {f.title}
            </Button>
          ))}
        </div>
      )}

      <div aria-live="assertive">
        {error && (
          <Alert variant="destructive" role={undefined}>
            <TriangleAlertIcon aria-hidden="true" />
            <AlertTitle id="reply-error">{error}</AlertTitle>
          </Alert>
        )}
      </div>

      <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-between">
        {usingDraft ? (
          <Button variant="outline" onClick={discard} className="h-9">
            Discard draft and write my own
          </Button>
        ) : draft !== null ? (
          <Button variant="outline" onClick={restore} className="h-9">
            Restore AI draft
          </Button>
        ) : (
          <span />
        )}
        <Button onClick={approve} className="h-9">
          Approve and send
        </Button>
      </div>

      <AlertDialog open={confirmOpen} onOpenChange={setConfirmOpen}>
        <AlertDialogContent className="sm:max-w-lg">
          <AlertDialogHeader>
            <AlertDialogTitle>Send this reply to the customer?</AlertDialogTitle>
            <AlertDialogDescription>They&apos;ll see it on their status page.</AlertDialogDescription>
          </AlertDialogHeader>
          {!labelsConfirmed && (
            <p className="rounded-md border border-amber-400 bg-amber-50 p-2 text-sm text-amber-950">
              The labels aren&apos;t checked yet. Sending will mark them as checked as they are, and that&apos;s logged.
            </p>
          )}
          <div className="max-h-64 overflow-y-auto rounded-md border bg-muted/40 p-3 text-sm whitespace-pre-line">{text}</div>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep editing</AlertDialogCancel>
            <AlertDialogAction onClick={send}>Send reply</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Sheet open={faq !== null} onOpenChange={(open) => !open && setFaq(null)}>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>
              {faq?.id} · {faq?.title}
            </SheetTitle>
            <SheetDescription>Knowledge base entry cited by the AI draft.</SheetDescription>
          </SheetHeader>
          <p className="px-4 text-sm">{faq?.body}</p>
        </SheetContent>
      </Sheet>
    </section>
  );
}

const KB_ANSWERS: readonly { match: RegExp; answer: string; source: string }[] = [
  { match: /refund|money back/i, answer: "Refunds go to the original payment method within 2 working days of approval; banks can take 3–5 more working days.", source: "FAQ 3 · Refund timelines" },
  { match: /return/i, answer: "Unworn items can be returned within 30 days using a free label from the order page.", source: "FAQ 5 · Returns policy" },
  { match: /deliver|parcel|courier/i, answer: "If a parcel marked delivered hasn't arrived after 48 hours, open a courier claim and offer a replacement or refund.", source: "FAQ 4 · Parcel not arrived" },
  { match: /size|fit/i, answer: "Jackets follow standard UK sizing; between sizes, choose the larger for layering.", source: "FAQ 6 · Size guide" },
];

/** US-11 (Could): agent-only question box over the FAQ. Canned answers in the prototype. */
export function AskKb() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<{ text: string; source?: string } | null>(null);

  function ask(e: FormEvent) {
    e.preventDefault();
    if (!question.trim()) return;
    const hit = KB_ANSWERS.find((a) => a.match.test(question));
    setAnswer(hit ? { text: hit.answer, source: hit.source } : { text: "Not in the knowledge base. Check with your team lead." });
  }

  return (
    <Collapsible className="rounded-lg border p-4">
      <CollapsibleTrigger className="group inline-flex min-h-6 items-center gap-1 font-semibold">
        <ChevronRightIcon aria-hidden="true" className="size-4 transition-transform group-data-[state=open]:rotate-90" />
        Ask the knowledge base
      </CollapsibleTrigger>
      <CollapsibleContent className="mt-3 flex flex-col gap-3">
        <form onSubmit={ask} className="flex flex-col gap-2 sm:flex-row sm:items-end">
          <div className="flex flex-1 flex-col gap-1.5">
            <Label htmlFor="kb-q">Question</Label>
            <Input id="kb-q" value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="e.g. How long do refunds take?" className="h-9" />
          </div>
          <Button type="submit" variant="outline" className="h-9">
            Ask
          </Button>
        </form>
        <div aria-live="polite" className="text-sm">
          {answer && (
            <div className="rounded-md bg-muted/50 p-3">
              {answer.source && (
                <p className="mb-1 text-xs text-muted-foreground">AI-suggested answer from the FAQ · check before using</p>
              )}
              <p>{answer.text}</p>
              {answer.source && <p className="mt-1 text-xs">Source: {answer.source}</p>}
            </div>
          )}
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
