import { z } from "zod";

// US-01 AC1 limits and the ux-spec §3 S1 / §5 microcopy. Shared by the form and the Server Action.
export const DESCRIPTION_MAX = 5000;

// Postgres rejects NUL characters in text, which would fail every retry with a generic error.
const withoutNul = z.string().transform((value) => value.replaceAll("\u0000", ""));

export const TicketInputSchema = z.object({
  name: withoutNul.pipe(
    z
      .string()
      .trim()
      .min(1, { error: "Please enter your name." })
      .max(100, { error: "Please keep your name to 100 characters or fewer." }),
  ),
  email: withoutNul.pipe(
    z
      .string()
      .trim()
      .min(1, { error: "Please enter your email." })
      .max(254, { error: "Please enter an email address like name@example.com." })
      .pipe(z.email({ error: "Please enter an email address like name@example.com." })),
  ),
  subject: withoutNul.pipe(
    z
      .string()
      .trim()
      .min(1, { error: "Please enter your subject." })
      .min(5, { error: "Please make the subject a little longer (at least 5 characters)." })
      .max(120, { error: "Please keep the subject to 120 characters or fewer." }),
  ),
  description: withoutNul.pipe(
    z
      .string()
      .trim()
      .min(1, { error: "Please enter your description." })
      .min(20, { error: "Please add a bit more detail (at least 20 characters)." })
      .max(DESCRIPTION_MAX, { error: "Please keep the description to 5,000 characters or fewer." }),
  ),
});

export type TicketInput = z.infer<typeof TicketInputSchema>;
export type TicketField = keyof TicketInput;
export type TicketFieldErrors = Partial<Record<TicketField, string>>;

export const TICKET_FIELDS: readonly { name: TicketField; label: string }[] = [
  { name: "name", label: "Name" },
  { name: "email", label: "Email" },
  { name: "subject", label: "Subject" },
  { name: "description", label: "Description" },
];

/** First error per field, in form order; empty when the input is valid. */
export function ticketFieldErrors(values: unknown): TicketFieldErrors {
  const result = TicketInputSchema.safeParse(values);
  if (result.success) {
    return {};
  }
  const errors: TicketFieldErrors = {};
  for (const issue of result.error.issues) {
    const field = issue.path[0];
    if (typeof field === "string" && field in TicketInputSchema.shape) {
      errors[field as TicketField] ??= issue.message;
    }
  }
  return errors;
}

/** Hidden field real people never see or fill; bots often do (architecture §4.1). */
// Deliberately meaningless, so autofill and password managers leave it alone (review).
export const HONEYPOT_FIELD = "hd_extra";
