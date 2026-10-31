import { fileURLToPath } from "node:url";

import tsconfigPaths from "vite-tsconfig-paths";
import { defineConfig } from "vitest/config";

// Local test database: no password, no secret. CI sets DATABASE_URL_TEST to its service container.
const testDatabaseUrl =
  process.env["DATABASE_URL_TEST"] ?? "postgresql://localhost:5432/helpdesk_test";

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
