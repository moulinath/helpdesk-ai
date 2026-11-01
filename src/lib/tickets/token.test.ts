// @vitest-environment node
import { describe, expect, it } from "vitest";

import { formatRef } from "./ref";
import { hashToken, newStatusToken } from "./token";

describe("status token (US-02 AC2, NFR-09)", () => {
  it("carries 128 bits of randomness and is URL-safe", () => {
    const token = newStatusToken();
    expect(token).toMatch(/^[A-Za-z0-9_-]{22}$/);
    expect(Buffer.from(token, "base64url")).toHaveLength(16);
  });

  it("is different every time", () => {
    const tokens = new Set(Array.from({ length: 100 }, newStatusToken));
    expect(tokens.size).toBe(100);
  });

  it("is stored only as a SHA-256 hash that doesn't contain it", () => {
    const token = newStatusToken();
    expect(hashToken(token)).toMatch(/^[0-9a-f]{64}$/);
    expect(hashToken(token)).not.toContain(token);
    expect(hashToken(token)).toBe(hashToken(token));
  });
});

describe("formatRef", () => {
  it("formats the reference shown to customers", () => {
    expect(formatRef(24817)).toBe("HD-24817");
  });
});
