import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { db } from "@/lib/db";
import { hashToken } from "@/lib/tickets/token";

// Records the order of after() and redirect(), as Next would run them.
const calls = vi.hoisted(() => ({
  order: [] as string[],
  afterCallbacks: [] as (() => unknown)[],
  ip: "203.0.113.7",
}));
vi.mock("next/server", () => ({
  after: (callback: () => unknown) => {
    calls.order.push("after");
    calls.afterCallbacks.push(callback);
  },
}));
vi.mock("next/navigation", () => ({
  redirect: (url: string) => {
    calls.order.push("redirect");
    throw new Error(`redirect:${url}`);
  },
}));
vi.mock("next/headers", () => ({
  headers: async () => new Headers({ "x-forwarded-for": calls.ip }),
}));
const triage = vi.hoisted(() => ({ startTriage: vi.fn(async (_ticketId: string) => undefined) }));
vi.mock("@/ai/triage", () => triage);

const { submitTicket } = await import("@/app/(customer)/actions");

const IDLE = { status: "idle" as const, fieldErrors: {}, attempt: 0 };
const VALID = {
  name: "Sofia Marin",
  email: "sofia.marin@example.com",
  subject: "Charged twice for my order",
  description: "My bank shows two payments of £89.00 for order 5521.",
};

function form(values: Record<string, string>) {
  const data = new FormData();
  for (const [key, value] of Object.entries(values)) data.set(key, value);
  return data;
}

/** Runs the action; returns the token from the redirect, or the returned state. */
async function submit(values: Record<string, string>) {
  try {
    return { state: await submitTicket(IDLE, form(values)) };
  } catch (error) {
    const match = /^redirect:\/t\/([A-Za-z0-9_-]+)\?new=1$/.exec((error as Error).message);
    if (!match?.[1]) throw error;
    return { token: match[1] };
  }
}

describe("US-01 submitTicket", () => {
  beforeEach(async () => {
    await db.rateLimit.deleteMany();
    await db.aiCallLog.deleteMany();
    await db.ticket.deleteMany();
    calls.order = [];
    calls.afterCallbacks = [];
    calls.ip = "203.0.113.7";
    triage.startTriage.mockClear();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("AC1: saves the ticket as Received with triage pending, storing only the token's hash", async () => {
    const { token } = await submit({ ...VALID, name: "  Sofia Marin " });
    expect(token).toBeDefined();
    const ticket = await db.ticket.findUniqueOrThrow({ where: { statusTokenHash: hashToken(token!) } });
    expect(ticket).toMatchObject({
      status: "received",
      triageState: "pending",
      customerName: "Sofia Marin",
      customerEmail: VALID.email,
      subject: VALID.subject,
    });
    expect(ticket.statusTokenHash).not.toContain(token);
  });

  it("AC3: saves before any AI work, and registers triage before the redirect (review M1)", async () => {
    await submit(VALID);
    expect(calls.order).toEqual(["after", "redirect"]);
    // The row exists while the after() callback hasn't run yet: saving never waits for the AI.
    expect(triage.startTriage).not.toHaveBeenCalled();
    expect(await db.ticket.count()).toBe(1);

    await calls.afterCallbacks[0]?.();
    const ticket = await db.ticket.findFirstOrThrow();
    // Only the id goes to triage, so name and email can't reach the AI (NFR-06).
    expect(triage.startTriage).toHaveBeenCalledWith(ticket.id);
  });

  it("AC2: invalid input saves nothing and returns an error per field", async () => {
    const { state } = await submit({ name: "", email: "sofia@", subject: "Help", description: "Too short" });
    expect(state?.status).toBe("invalid");
    expect(Object.keys(state?.fieldErrors ?? {})).toEqual(["name", "email", "subject", "description"]);
    expect(await db.ticket.count()).toBe(0);
    expect(calls.order).toEqual([]);
  });

  it("saves nothing when the honeypot field is filled", async () => {
    const { state } = await submit({ ...VALID, website: "http://spam.example" });
    expect(state?.status).toBe("server");
    expect(await db.ticket.count()).toBe(0);
  });

  it("AC4: the 6th ticket in 10 minutes from one address is refused and not saved", async () => {
    for (let n = 1; n <= 5; n++) {
      expect((await submit(VALID)).token).toBeDefined();
    }
    const { state } = await submit(VALID);
    expect(state?.status).toBe("rate_limited");
    expect(await db.ticket.count()).toBe(5);

    calls.ip = "198.51.100.2";
    expect((await submit(VALID)).token).toBeDefined();
  });
});
