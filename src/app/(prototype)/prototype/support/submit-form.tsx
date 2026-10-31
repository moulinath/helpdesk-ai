"use client";

import { Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import { z } from "zod";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useProtoState } from "../_components/prototype-bar";

const MAX = 5000;

// Same limits and microcopy as ux-spec §3 S1 and §5. The real schema will live in src/lib (US-01).
const schema = z.object({
  name: z.string().trim().min(1, { error: "Please enter your name." }),
  email: z.email({ error: "Please enter an email address like name@example.com." }),
  subject: z
    .string()
    .trim()
    .min(1, { error: "Please enter your subject." })
    .min(5, { error: "Please make the subject a little longer (at least 5 characters)." })
    .max(120, { error: "Please keep the subject under 120 characters." }),
  description: z
    .string()
    .trim()
    .min(1, { error: "Please enter your description." })
    .min(20, { error: "Please add a bit more detail (at least 20 characters)." })
    .max(MAX, { error: `Please keep the description under ${MAX} characters.` }),
});

type Field = keyof z.infer<typeof schema>;
const FIELDS: readonly { name: Field; label: string }[] = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "subject", label: "Subject" },
  { name: "description", label: "Description" },
];

const INVALID_SAMPLE: Record<Field, string> = { name: "", email: "sofia@", subject: "Help", description: "Charged twice" };
const VALID_SAMPLE: Record<Field, string> = {
  name: "Sofia Marin",
  email: "sofia.marin@example.com",
  subject: "Charged twice for my order",
  description: "I ordered a rain jacket on Monday (order 5521) and my bank shows two payments of £89.00.",
};

function validate(values: Record<Field, string>) {
  const result = schema.safeParse(values);
  if (result.success) return {};
  const errors: Partial<Record<Field, string>> = {};
  for (const issue of result.error.issues) {
    const key = issue.path[0] as Field;
    errors[key] ??= issue.message;
  }
  return errors;
}

export function SubmitForm() {
  const state = useProtoState();
  const router = useRouter();
  const id = useId();

  const [values, setValues] = useState<Record<Field, string>>(() =>
    state === "error-validation" ? INVALID_SAMPLE : state === "default" ? { name: "", email: "", subject: "", description: "" } : VALID_SAMPLE,
  );
  const [errors, setErrors] = useState<Partial<Record<Field, string>>>(() =>
    state === "error-validation" ? validate(INVALID_SAMPLE) : {},
  );
  const [submitting, setSubmitting] = useState(state === "loading");
  const [serverError, setServerError] = useState<"server" | "rate-limit" | null>(
    state === "error-server" ? "server" : state === "error-rate-limit" ? "rate-limit" : null,
  );

  const errorList = FIELDS.filter((f) => errors[f.name]);
  const descLength = values.description.length;
  const nearLimit = descLength > MAX - 200;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const found = validate(values);
    setErrors(found);
    const first = FIELDS.find((f) => found[f.name]);
    if (first) {
      document.getElementById(`${id}-${first.name}`)?.focus();
      return;
    }
    setServerError(null);
    setSubmitting(true);
    // Simulates the save; the customer never waits on the AI (P1).
    window.setTimeout(() => {
      if (state === "error-server" || state === "error-rate-limit") {
        setSubmitting(false);
        setServerError(state === "error-server" ? "server" : "rate-limit");
        return;
      }
      router.push("/prototype/support/confirmation");
    }, 700);
  }

  function fieldProps(name: Field, hasHint = true) {
    const describedBy = [errors[name] && `${id}-${name}-error`, hasHint && `${id}-${name}-hint`].filter(Boolean).join(" ");
    return {
      id: `${id}-${name}`,
      name,
      value: values[name],
      "aria-invalid": errors[name] ? true : undefined,
      "aria-describedby": describedBy || undefined,
      onChange: (e: { target: { value: string } }) => setValues((v) => ({ ...v, [name]: e.target.value })),
    };
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-5">
      <div aria-live="assertive">
        {errorList.length > 0 && (
          <Alert variant="destructive">
            <AlertTitle>
              Please fix {errorList.length === 1 ? "1 problem" : `${errorList.length} problems`} before sending
            </AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-4">
                {errorList.map((f) => (
                  <li key={f.name}>
                    <a href={`#${id}-${f.name}`} className="inline-flex min-h-6 items-center underline underline-offset-2">
                      {f.label}: {errors[f.name]}
                    </a>
                  </li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        )}
        {serverError && (
          <Alert variant="destructive">
            <AlertTitle>
              {serverError === "server"
                ? "We couldn't send your request. Please try again."
                : "You've sent several requests in a short time. Please try again in a few minutes."}
            </AlertTitle>
            <AlertDescription>Your message is still here, so you won&apos;t need to type it again.</AlertDescription>
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
        <Input {...fieldProps("subject")} maxLength={120} className="h-10" />
        <p id={`${id}-subject-hint`} className="text-sm text-muted-foreground">
          A few words, for example &quot;Charged twice for my order&quot;.
        </p>
        <FieldError id={`${id}-subject-error`} message={errors.subject} />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor={`${id}-description`}>Description (required)</Label>
        <Textarea {...fieldProps("description")} rows={7} maxLength={MAX} />
        <p id={`${id}-description-hint`} className="text-right text-sm text-muted-foreground">
          {descLength.toLocaleString("en-GB")} of {MAX.toLocaleString("en-GB")} characters
        </p>
        {/* Announce only near the limit, so screen readers aren't interrupted on every keystroke. */}
        <p className="sr-only" aria-live="polite">
          {nearLimit ? `${(MAX - descLength).toLocaleString("en-GB")} characters left` : ""}
        </p>
        <FieldError id={`${id}-description-error`} message={errors.description} />
      </div>

      <Button type="submit" size="lg" className="h-11 w-full text-base" disabled={submitting} aria-disabled={submitting}>
        {submitting ? (
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

function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-sm font-medium text-destructive">
      {message}
    </p>
  );
}
