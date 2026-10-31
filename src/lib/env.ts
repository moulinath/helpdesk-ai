import "server-only";

import { z } from "zod";

const booleanFlag = z
  .enum(["true", "false"])
  .default("false")
  .transform((value) => value === "true");

export const ServerEnvSchema = z.object({
  DATABASE_URL: z.string().min(1),
  // Auth.js reads AUTH_SECRET itself; checked here so a missing secret fails loudly and early.
  AUTH_SECRET: z.string().min(32),
  RATE_LIMIT_SECRET: z.string().min(32),
  // Shows the demo credentials on the sign-in page (S4). Off unless set.
  DEMO_MODE: booleanFlag,
});

export type ServerEnv = z.infer<typeof ServerEnvSchema>;

let cached: ServerEnv | undefined;

/** Parsed on first use, not at import, so `next build` doesn't need runtime secrets. */
export function serverEnv(): ServerEnv {
  if (!cached) {
    const result = ServerEnvSchema.safeParse(process.env);
    if (!result.success) {
      // Names only: never print values.
      const names = result.error.issues.map((issue) => issue.path.join(".")).join(", ");
      throw new Error(`Invalid or missing server environment variables: ${names}`);
    }
    cached = result.data;
  }
  return cached;
}

/** Only DEMO_MODE, for pages that render at build time and shouldn't need every secret. */
export function demoMode(): boolean {
  return booleanFlag.parse(process.env["DEMO_MODE"]);
}
