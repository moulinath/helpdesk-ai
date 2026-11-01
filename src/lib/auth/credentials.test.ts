// @vitest-environment node
import { describe, expect, it } from "vitest";

import { SignInSchema } from "./credentials";

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
