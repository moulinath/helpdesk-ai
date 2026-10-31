// @vitest-environment node
import { describe, expect, it } from "vitest";

import { nextToken, SESSION_MAX_AGE_MS } from "./session";

const T0 = Date.parse("2026-10-31T09:00:00Z");

describe("nextToken (absolute 8-hour session)", () => {
  it("stamps the agent, role and sign-in time at sign-in", () => {
    expect(nextToken({}, { id: "a1", role: "lead" }, T0)).toEqual({
      agentId: "a1",
      role: "lead",
      signedInAt: T0,
    });
  });

  it("keeps the session while it is younger than 8 hours, without moving the sign-in time", () => {
    const token = { agentId: "a1", role: "agent" as const, signedInAt: T0 };
    expect(nextToken(token, undefined, T0 + SESSION_MAX_AGE_MS - 1)).toBe(token);
  });

  it("ends the session 8 hours after sign-in, even if it was used all along", () => {
    let token = nextToken({}, { id: "a1", role: "agent" }, T0);
    for (let hour = 1; hour <= 7; hour++) {
      token = token && nextToken(token, undefined, T0 + hour * 60 * 60 * 1000);
    }
    expect(token).not.toBeNull();
    expect(nextToken(token!, undefined, T0 + SESSION_MAX_AGE_MS + 1)).toBeNull();
  });

  it("ends a session with no sign-in time (issued before this rule existed)", () => {
    expect(nextToken({ agentId: "a1", role: "agent" as const }, undefined, T0)).toBeNull();
  });
});
