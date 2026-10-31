import { fileURLToPath } from "node:url";

import { config } from "dotenv";
import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Like prisma.config.ts: read .env.local, but variables already set in the environment win.
config({ path: ".env.local", quiet: true });

// Local throwaway test database (password "helpdesk" is not a secret). CI sets DATABASE_URL_TEST.
const testDatabaseUrl =
  process.env["DATABASE_URL_TEST"] ?? "postgresql://helpdesk:helpdesk@localhost:5432/helpdesk_test";

// Integration tests delete rows, so refuse to run against anything but a *_test database.
if (!new URL(testDatabaseUrl).pathname.endsWith("_test")) {
  throw new Error(`DATABASE_URL_TEST must point at a database whose name ends in "_test"`);
}

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // `server-only` throws outside a React Server Components build; tests run plain Node.
      "server-only": fileURLToPath(new URL("./tests/support/empty.ts", import.meta.url)),
    },
  },
  test: {
    coverage: {
      provider: "v8",
      include: ["src/lib/**", "src/ai/**"],
      exclude: ["src/generated/**"],
      // Report only for now; the 80% target is enforced in Phase 5.
      reporter: ["text", "html", "json-summary"],
    },
    projects: [
      {
        extends: true,
        test: {
          name: "unit",
          environment: "jsdom",
          include: ["src/**/*.test.{ts,tsx}"],
          setupFiles: ["tests/support/setup-unit.ts"],
        },
      },
      {
        extends: true,
        test: {
          name: "integration",
          environment: "node",
          include: ["tests/integration/**/*.test.ts"],
          env: { DATABASE_URL: testDatabaseUrl },
          // Tests share one database, so files run one at a time.
          fileParallelism: false,
        },
      },
    ],
  },
});
