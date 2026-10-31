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
    await db.agent.deleteMany();
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
    expect(first.reviewNow).toBe(false);
  });

  it("rejects a second ticket with the same status-token hash", async () => {
    const data = newTicket();
    await db.ticket.create({ data });

    const duplicate = { ...newTicket(), statusTokenHash: data.statusTokenHash };

    await expect(db.ticket.create({ data: duplicate })).rejects.toThrow();
  });

  it("deletes a ticket's triage with the ticket", async () => {
    const ticket = await db.ticket.create({ data: newTicket() });
    await db.triage.create({
      data: {
        ticketId: ticket.id,
        category: "delivery",
        priority: "normal",
        sentiment: "neutral",
        confCategory: 0.9,
        confPriority: 0.8,
        confSentiment: 0.7,
        reason: "Late parcel, no promised date missed yet.",
        promptVersion: "triage.v1",
        faqVersion: "faq.v1",
        model: "claude-haiku-5-5",
      },
    });

    await db.ticket.delete({ where: { id: ticket.id } });

    expect(await db.triage.count({ where: { ticketId: ticket.id } })).toBe(0);
  });

  it("keeps a ticket when the agent who checked its labels is deleted", async () => {
    const agent = await db.agent.create({
      data: { email: "agent@example.com", name: "Test Agent", passwordHash: "not-a-real-hash" },
    });
    const ticket = await db.ticket.create({
      data: { ...newTicket(), labelsCheckedById: agent.id },
    });

    await db.agent.delete({ where: { id: agent.id } });

    const kept = await db.ticket.findUniqueOrThrow({ where: { id: ticket.id } });
    expect(kept.labelsCheckedById).toBeNull();
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
