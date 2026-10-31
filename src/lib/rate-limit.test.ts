// @vitest-environment node
import { describe, expect, it } from "vitest";

import { rateLimitKey, windowStart } from "./rate-limit";

const SECRET = "unit-test-secret-not-real-0123456789abcdef";

describe("rateLimitKey", () => {
  it("is stable for the same input", () => {
    expect(rateLimitKey("signin", ["203.0.113.7", "a@b.example"], SECRET)).toBe(
      rateLimitKey("signin", ["203.0.113.7", "a@b.example"], SECRET),
    );
  });

  it("never contains the raw IP or email", () => {
    const key = rateLimitKey("signin", ["203.0.113.7", "a@b.example"], SECRET);
    expect(key).toMatch(/^signin:[0-9a-f]{64}$/);
    expect(key).not.toContain("203.0.113.7");
    expect(key).not.toContain("a@b.example");
  });

  it("depends on the secret, so the key can't be recomputed without it", () => {
    expect(rateLimitKey("signin", ["203.0.113.7"], SECRET)).not.toBe(
      rateLimitKey("signin", ["203.0.113.7"], `${SECRET}x`),
    );
  });
});

describe("windowStart", () => {
  it("puts times in the same 15-minute window together", () => {
    const fifteen = 15 * 60 * 1000;
    const a = windowStart(new Date("2026-10-31T10:01:00Z"), fifteen);
    const b = windowStart(new Date("2026-10-31T10:14:59Z"), fifteen);
    const c = windowStart(new Date("2026-10-31T10:15:00Z"), fifteen);
    expect(a.toISOString()).toBe("2026-10-31T10:00:00.000Z");
    expect(b).toEqual(a);
    expect(c.toISOString()).toBe("2026-10-31T10:15:00.000Z");
  });
});
