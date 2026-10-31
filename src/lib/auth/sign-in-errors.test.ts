// @vitest-environment node
import { AuthError, CallbackRouteError, CredentialsSignin } from "@auth/core/errors";
import { describe, expect, it } from "vitest";

import { signInErrorFor } from "./sign-in-errors";

class RateLimited extends CredentialsSignin {
  override code = "rate_limited";
}

describe("signInErrorFor", () => {
  it("maps a credentials failure to the generic error", () => {
    expect(signInErrorFor(new CredentialsSignin())).toBe("invalid");
  });

  it("keeps the rate-limit code", () => {
    expect(signInErrorFor(new RateLimited())).toBe("rate_limited");
  });

  it("reports other Auth.js errors (e.g. a database outage) as unavailable, not a wrong password", () => {
    expect(signInErrorFor(new CallbackRouteError("db down", { cause: new Error("connection refused") }))).toBe("unavailable");
    expect(signInErrorFor(new AuthError("misconfigured"))).toBe("unavailable");
  });

  it("returns null for non-Auth.js errors so they propagate", () => {
    expect(signInErrorFor(new Error("NEXT_REDIRECT"))).toBeNull();
  });
});
