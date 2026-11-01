// @vitest-environment node
import { describe, expect, it } from "vitest";

import { clientIp, SignInSchema } from "./credentials";

describe("SignInSchema", () => {
  it("trims and lowercases the email (review C4)", () => {
    const parsed = SignInSchema.parse({ email: "  Daniel@Larkfield.Example ", password: "x" });
    expect(parsed.email).toBe("daniel@larkfield.example");
  });

  it("rejects an empty password and a malformed email", () => {
    expect(SignInSchema.safeParse({ email: "a@b.example", password: "" }).success).toBe(false);
    expect(SignInSchema.safeParse({ email: "not-an-email", password: "x" }).success).toBe(false);
  });
});

describe("clientIp", () => {
  it("takes the first X-Forwarded-For address", () => {
    expect(clientIp(new Headers({ "x-forwarded-for": "203.0.113.7, 10.0.0.1" }))).toBe("203.0.113.7");
  });

  it("falls back to X-Real-IP, then 'unknown'", () => {
    expect(clientIp(new Headers({ "x-real-ip": "198.51.100.2" }))).toBe("198.51.100.2");
    expect(clientIp(new Headers())).toBe("unknown");
  });
});
