import { afterAll, beforeEach, describe, expect, it, vi } from "vitest";

import { hashPassword } from "@/lib/auth/password";
import { checkCredentials } from "@/lib/auth/credentials";
import { db } from "@/lib/db";
import { seedDemoAccounts } from "@/lib/seed";

// currentAgent() reads the session through Auth.js; tests supply the session directly.
const session = vi.hoisted(() => ({ value: null as { user: { id: string } } | null }));
vi.mock("@/auth", () => ({ auth: async () => session.value }));
vi.mock("next/server", () => ({ connection: async () => undefined }));

const { currentAgent } = await import("@/lib/auth/guards");

const IP = "203.0.113.7";
const PASSWORD = "correct-horse-battery";

async function createAgent(email: string, active = true) {
  return db.agent.create({
    data: { email, name: "Test Agent", passwordHash: await hashPassword(PASSWORD), active },
  });
}

describe("US-12 sign-in against the database", () => {
  beforeEach(async () => {
    await db.rateLimit.deleteMany();
    await db.aiCallLog.deleteMany();
    await db.ticket.deleteMany();
    await db.agent.deleteMany();
    session.value = null;
  });

  afterAll(async () => {
    await db.$disconnect();
  });

  it("AC2: accepts the right password, with any email casing", async () => {
    const agent = await createAgent("amara@larkfield.example");
    const result = await checkCredentials({ email: "Amara@Larkfield.Example", password: PASSWORD }, IP);
    expect(result).toEqual({
      ok: true,
      agent: { id: agent.id, name: "Test Agent", email: "amara@larkfield.example", role: "agent" },
    });
  });

  it("AC3: a wrong password, an unknown email and an inactive agent all give the same result", async () => {
    await createAgent("amara@larkfield.example");
    await createAgent("former@larkfield.example", false);

    const wrongPassword = await checkCredentials({ email: "amara@larkfield.example", password: "nope" }, IP);
    const unknownEmail = await checkCredentials({ email: "nobody@larkfield.example", password: PASSWORD }, IP);
    const inactive = await checkCredentials({ email: "former@larkfield.example", password: PASSWORD }, IP);

    expect(wrongPassword).toEqual({ ok: false, reason: "invalid" });
    expect(unknownEmail).toEqual(wrongPassword);
    expect(inactive).toEqual(wrongPassword);
  });

  it("AC3: the 6th try within 15 minutes is rate-limited, even with the right password", async () => {
    await createAgent("amara@larkfield.example");
    for (let attempt = 1; attempt <= 5; attempt++) {
      const result = await checkCredentials({ email: "amara@larkfield.example", password: "nope" }, IP);
      expect(result).toEqual({ ok: false, reason: "invalid" });
    }
    const sixth = await checkCredentials({ email: "amara@larkfield.example", password: PASSWORD }, IP);
    expect(sixth).toEqual({ ok: false, reason: "rate_limited" });

    // Limited per IP + email: the same email from another address still works.
    const otherIp = await checkCredentials({ email: "amara@larkfield.example", password: PASSWORD }, "198.51.100.2");
    expect(otherIp.ok).toBe(true);
  });

  it("a successful sign-in clears the count, so only failed tries add up", async () => {
    await createAgent("amara@larkfield.example");
    for (let attempt = 1; attempt <= 4; attempt++) {
      await checkCredentials({ email: "amara@larkfield.example", password: "nope" }, IP);
    }
    expect((await checkCredentials({ email: "amara@larkfield.example", password: PASSWORD }, IP)).ok).toBe(true);
    expect(await db.rateLimit.count()).toBe(0);
  });

  it("requireAgent's lookup rejects an agent deactivated after signing in (ADR 0005)", async () => {
    const agent = await createAgent("amara@larkfield.example");
    session.value = { user: { id: agent.id } };
    expect((await currentAgent())?.id).toBe(agent.id);

    await db.agent.update({ where: { id: agent.id }, data: { active: false } });
    expect(await currentAgent()).toBeNull();
  });

  it("AC5: seeding twice leaves exactly one demo agent and one demo lead", async () => {
    await seedDemoAccounts(db);
    await seedDemoAccounts(db);
    const agents = await db.agent.findMany({ orderBy: { email: "asc" } });
    expect(agents.map((a) => [a.email, a.role, a.active])).toEqual([
      ["daniel@larkfield.example", "agent", true],
      ["priya@larkfield.example", "lead", true],
    ]);
  });
});
