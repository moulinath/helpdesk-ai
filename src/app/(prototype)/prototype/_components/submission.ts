"use client";

import { useSyncExternalStore } from "react";
import { z } from "zod";
import type { Ticket } from "../_data/sample";

// Prototype-only stand-in for the saved ticket (F6): what the reviewer typed on S1 replaces the
// sample text of HD-24817 on S3, S5 and S6. Kept in this browser only; nothing is sent anywhere.
const KEY = "prototype-submission";
const DEMO_REF = "HD-24817";

const submissionSchema = z.object({
  name: z.string().trim().min(1),
  email: z.string().trim().min(1),
  subject: z.string().trim().min(1),
  description: z.string().trim().min(1),
});
export type Submission = z.infer<typeof submissionSchema>;

const listeners = new Set<() => void>();

function read(): string | null {
  try {
    return localStorage.getItem(KEY);
  } catch {
    return null;
  }
}

export function saveSubmission(submission: Submission) {
  try {
    localStorage.setItem(KEY, JSON.stringify(submission));
  } catch {
    // Storage blocked: the pages keep showing the sample ticket.
  }
  listeners.forEach((l) => l());
}

function parse(raw: string | null): Submission | null {
  if (!raw) return null;
  try {
    const result = submissionSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : null;
  } catch {
    return null;
  }
}

/** The reviewer's last S1 submission, or null (also during server render and hydration). */
export function useSubmission(): Submission | null {
  const raw = useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    read,
    () => null,
  );
  return parse(raw);
}

/** HD-24817 with the reviewer's own words; every other ticket is returned unchanged. */
export function withSubmission(ticket: Ticket, submission: Submission | null): Ticket {
  if (!submission || ticket.ref !== DEMO_REF) return ticket;
  const firstName = submission.name.split(/\s+/)[0] ?? submission.name;
  const greet = (text: string) => text.replace(/^Hi Sofia,/, `Hi ${firstName},`);
  return {
    ...ticket,
    subject: submission.subject,
    description: submission.description,
    customerFirstName: firstName,
    customerFullName: submission.name,
    customerEmail: submission.email,
    triage: ticket.triage && { ...ticket.triage, draft: ticket.triage.draft && greet(ticket.triage.draft) },
    reply: ticket.reply && { ...ticket.reply, body: greet(ticket.reply.body) },
  };
}
