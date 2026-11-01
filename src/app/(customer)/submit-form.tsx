"use client";

import { Loader2Icon } from "lucide-react";
import { startTransition, useActionState, useEffect, useId, useState, type FormEvent } from "react";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  DESCRIPTION_MAX,
  HONEYPOT_FIELD,
  TICKET_FIELDS,
  ticketFieldErrors,
  type TicketField,
  type TicketFieldErrors,
} from "@/lib/tickets/schema";

import { submitTicket, type SubmitState } from "./actions";

const EMPTY: Record<TicketField, string> = { name: "", email: "", subject: "", description: "" };

const SERVER_MESSAGES = {
  server: "We couldn't send your request. Please try again.",
  rate_limited: "You've sent several requests in a short time. Please try again in a few minutes.",
} as const;

/** S1 form (US-01). Checks fields before sending (AC2); input survives every error. */
export function SubmitForm() {
  const id = useId();
  const [state, dispatch, pending] = useActionState<SubmitState, FormData>(submitTicket, {
    status: "idle",
    fieldErrors: {},
    attempt: 0,
  });
  // Controlled, so React's automatic form reset after an action can't clear what Sofia typed.
  const [values, setValues] = useState(EMPTY);
  const [clientErrors, setClientErrors] = useState<TicketFieldErrors | null>(null);

  // The server re-checks; its field errors show if they ever differ from the browser's.
  const errors = clientErrors ?? (state.status === "invalid" ? state.fieldErrors : {});
  const errorList = TICKET_FIELDS.filter((field) => errors[field.name]);
  const serverError = !pending && (state.status === "server" || state.status === "rate_limited") ? state.status : null;
  const descLength = values.description.length;
  const nearLimit = descLength > DESCRIPTION_MAX - 200;

  // After a server-side field error, move focus to the first invalid field, as for browser errors.
  useEffect(() => {
    if (state.status === "invalid") {
      const first = TICKET_FIELDS.find((field) => state.fieldErrors[field.name]);
      if (first) document.getElementById(`${id}-${first.name}`)?.focus();
    }
  }, [state, id]);

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (pending) return; // aria-disabled keeps the button focusable, so guard repeat submits here.
    const found = ticketFieldErrors(values);
    const first = TICKET_FIELDS.find((field) => found[field.name]);
    if (first) {
      setClientErrors(found);
      document.getElementById(`${id}-${first.name}`)?.focus();
      return;
    }
    setClientErrors(null);
    const formData = new FormData(event.currentTarget);
    startTransition(() => dispatch(formData));
  }

  function fieldProps(name: TicketField, hasHint = true) {
    const describedBy = [errors[name] && `${id}-${name}-error`, hasHint && `${id}-${name}-hint`]
      .filter(Boolean)
      .join(" ");
    return {
      id: `${id}-${name}`,
      name,
      value: values[name],
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": describedBy || undefined,
      onChange: (event: { target: { value: string } }) =>
        setValues((current) => ({ ...current, [name]: event.target.value })),
    };
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div aria-live="assertive">
        {errorList.length > 0 && (
          <Alert variant="destructive" role={undefined}>
            <AlertTitle>
              Please fix {errorList.length === 1 ? "1 problem" : `${errorList.length} problems`} before sending
            </AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {errorList.map((field) => (
                  <li key={field.name}>
                    <a
                      href={`#${id}-${field.name}`}
                      className="inline-flex min-h-6 items-center underline underline-offset-2"
                    >
                      {field.label}: {errors[field.name]}
                    </a>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        {serverError && (
          <Alert key={state.attempt} variant="destructive" role={undefined}>
            <AlertTitle>{SERVER_MESSAGES[serverError]}</AlertTitle>
            <AlertDescription className="flex flex-col items-start gap-2">
              Your message is still here, so you won&apos;t need to type it again.
              <Button type="submit" variant="outline" size="sm">
                Try again
              </Button>
            </AlertDescription>
          </Alert>
        )}
      </div>

      <p className="text-sm text-muted-foreground">All fields are required.</p>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-name`}>Name (required)</Label>
        <Input {...fieldProps("name", false)} autoComplete="name" className="h-10" />
        <FieldError id={`${id}-name-error`} message={errors.name} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-email`}>Email (required)</Label>
        <Input {...fieldProps("email")} type="email" autoComplete="email" inputMode="email" className="h-10" />
        <p id={`${id}-email-hint`} className="text-sm text-muted-foreground">
          We&apos;ll only use this to tell you about this request.
        </p>
        <FieldError id={`${id}-email-error`} message={errors.email} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-subject`}>Subject (required)</Label>
        <Input {...fieldProps("subject")} className="h-10" />
        <p id={`${id}-subject-hint`} className="text-sm text-muted-foreground">
          A few words, for example &quot;Charged twice for my order&quot;.
        </p>
        <FieldError id={`${id}-subject-error`} message={errors.subject} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-description`}>Description (required)</Label>
        <Textarea {...fieldProps("description")} rows={7} />
        <p id={`${id}-description-hint`} className="text-right text-sm text-muted-foreground">
          {descLength.toLocaleString("en-GB")} of {DESCRIPTION_MAX.toLocaleString("en-GB")} characters
        </p>
        {/* Announce only near the limit, so screen readers aren't interrupted on every keystroke. */}
        <p className="sr-only" aria-live="polite">
          {nearLimit ? `${(DESCRIPTION_MAX - descLength).toLocaleString("en-GB")} characters left` : ""}
        </p>
        <FieldError id={`${id}-description-error`} message={errors.description} />
      </div>

      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it (architecture §4.1). */}
      <div aria-hidden="true" className="absolute -left-[10000px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-${HONEYPOT_FIELD}`}>Leave this field empty</label>
        <input id={`${id}-${HONEYPOT_FIELD}`} name={HONEYPOT_FIELD} type="text" tabIndex={-1} autoComplete="off" defaultValue="" />
      </div>

      <Button type="submit" size="lg" className="h-11 w-full text-base" aria-disabled={pending}>
        {pending ? (
          <>
            <Loader2Icon aria-hidden="true" className="animate-spin" />
            Sending…
          </>
        ) : (
          "Submit request"
        )}
      </Button>
    </form>
  );
}

function FieldError({ id, message }: { id: string; message?: string | undefined }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
}
