// @vitest-environment node
import { describe, expect, it } from "vitest";

import { assertSafeToSeed, demoAccounts } from "./demo-accounts";

describe("demo accounts (US-12 AC5)", () => {
  it("has one agent and one lead, with overridable passwords", () => {
    const accounts = demoAccounts({ DEMO_AGENT_PASSWORD: "custom" });
    expect(accounts.map((a) => a.role)).toEqual(["agent", "lead"]);
    expect(accounts[0]?.password).toBe("custom");
    expect(accounts[1]?.password).toBe("demo-lead-2026");
  });

  it("refuses the public default passwords in production unless it is the demo", () => {
    const prod = { NODE_ENV: "production" };
    expect(() => assertSafeToSeed(prod)).toThrow(/Refusing to seed/);
    expect(() => assertSafeToSeed({ ...prod, DEMO_MODE: "true" })).not.toThrow();
    expect(() =>
      assertSafeToSeed({ ...prod, DEMO_AGENT_PASSWORD: "a", DEMO_LEAD_PASSWORD: "b" }),
    ).not.toThrow();
    expect(() => assertSafeToSeed({ NODE_ENV: "development" })).not.toThrow();
  });
});
