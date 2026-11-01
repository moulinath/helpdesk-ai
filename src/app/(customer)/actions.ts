"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { after } from "next/server";

import { startTriage } from "@/ai/triage";
import { clientIp } from "@/lib/client-ip";
import { db } from "@/lib/db";
import { hitRateLimit } from "@/lib/rate-limit";
import {
  HONEYPOT_FIELD,
  TicketInputSchema,
  ticketFieldErrors,
  type TicketFieldErrors,
} from "@/lib/tickets/schema";
import { SUBMIT_LIMIT } from "@/lib/tickets/submit-limit";
import { hashToken, newStatusToken } from "@/lib/tickets/token";

export type SubmitState = {
  status: "idle" | "invalid" | "server" | "rate_limited";
  fieldErrors: TicketFieldErrors;
  /** Changes on every failed attempt, so a repeated message is announced again. */
  attempt: number;
};

function failed(previous: SubmitState, status: SubmitState["status"], fieldErrors: TicketFieldErrors = {}) {
  return { status, fieldErrors, attempt: previous.attempt + 1 };
}

/** S1 submit (US-01, architecture §4.1). Saves first; triage runs after the response. */
export async function submitTicket(previous: SubmitState, formData: FormData): Promise<SubmitState> {
  const raw = {
    name: String(formData.get("name") ?? ""),
    email: String(formData.get("email") ?? ""),
    subject: String(formData.get("subject") ?? ""),
    description: String(formData.get("description") ?? ""),
  };
  const parsed = TicketInputSchema.safeParse(raw);
  if (!parsed.success) {
    return failed(previous, "invalid", ticketFieldErrors(raw));
  }
  // A filled honeypot is a bot: save nothing, say nothing specific.
  if (String(formData.get(HONEYPOT_FIELD) ?? "") !== "") {
    return failed(previous, "server");
  }

  const token = newStatusToken();
  let ticketId: string;
  try {
    const limit = await hitRateLimit(SUBMIT_LIMIT, [clientIp(await headers())]);
    if (!limit.allowed) {
      return failed(previous, "rate_limited");
    }
    const ticket = await db.ticket.create({
      data: {
        customerName: parsed.data.name,
        customerEmail: parsed.data.email,
        subject: parsed.data.subject,
        description: parsed.data.description,
        statusTokenHash: hashToken(token),
      },
      select: { id: true },
    });
    ticketId = ticket.id;
  } catch (error) {
    // Error name only: the message can carry customer data (architecture §7.4).
    console.error("submitTicket failed:", error instanceof Error ? error.name : "unknown");
    return failed(previous, "server");
  }

  // Must come before redirect(), which throws (architecture §4.1, review M1).
  after(() => startTriage(ticketId));
  redirect(`/t/${token}?new=1`);
}
