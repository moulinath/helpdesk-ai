// @vitest-environment node
import { describe, expect, it } from "vitest";

import { ServerEnvSchema } from "./env";

const valid = {
  DATABASE_URL: "postgresql://localhost/x",
  AUTH_SECRET: "a".repeat(32),
  RATE_LIMIT_SECRET: "b".repeat(32),
};

describe("ServerEnvSchema", () => {
  it("accepts a complete environment and defaults DEMO_MODE to off", () => {
    const env = ServerEnvSchema.parse(valid);
    expect(env.DEMO_MODE).toBe(false);
  });

  it("reads DEMO_MODE=true as on", () => {
    expect(ServerEnvSchema.parse({ ...valid, DEMO_MODE: "true" }).DEMO_MODE).toBe(true);
  });

  it("rejects a missing or short secret", () => {
    expect(ServerEnvSchema.safeParse({ ...valid, AUTH_SECRET: undefined }).success).toBe(false);
    expect(ServerEnvSchema.safeParse({ ...valid, RATE_LIMIT_SECRET: "short" }).success).toBe(false);
  });

  it("rejects a DEMO_MODE that isn't true or false", () => {
    expect(ServerEnvSchema.safeParse({ ...valid, DEMO_MODE: "yes" }).success).toBe(false);
  });
});
