import { randomBytes } from "node:crypto";

import { afterAll, beforeEach, describe, expect, it } from "vitest";

import { db } from "@/lib/db";

function newTicket() {
  return {
    customerName: "Test Customer",
    customerEmail: "test@example.com",
    subject: "Parcel not arrived",
    description: "My parcel was due on Monday and has not arrived yet.",
    statusTokenHash: randomBytes(32).toString("hex"),
  };
}

describe("database foundation", () => {
  beforeEach(async () => {
    await db.aiCallLog.deleteMany();
    await db.ticket.deleteMany();
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("gives tickets increasing reference numbers from 24800", async () => {
    const first = await db.ticket.create({ data: newTicket() });
    const second = await db.ticket.create({ data: newTicket() });

    expect(first.refNumber).toBeGreaterThanOrEqual(24800);
    expect(second.refNumber).toBeGreaterThan(first.refNumber);
    expect(first.status).toBe("received");
    expect(first.triageState).toBe("pending");
  });

  it("keeps AI call logs when their ticket is deleted", async () => {
    const ticket = await db.ticket.create({ data: newTicket() });
    const log = await db.aiCallLog.create({
      data: {
        ticketId: ticket.id,
        purpose: "triage",
        promptVersion: "triage.v1",
        faqVersion: "faq.v1",
        model: "claude-haiku-5-5",
        attempt: 1,
        latencyMs: 1200,
        outcome: "ok",
      },
    });

    await db.ticket.delete({ where: { id: ticket.id } });

    const kept = await db.aiCallLog.findUniqueOrThrow({ where: { id: log.id } });
    expect(kept.ticketId).toBeNull();
  });
});
