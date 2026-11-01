import { execFileSync } from "node:child_process";

// Playwright loads TypeScript as CommonJS, but the generated Prisma client is ESM, so the
// database reset runs as its own tsx process.
export default function globalSetup() {
  execFileSync("npx", ["tsx", "tests/e2e/reset-db.ts"], { stdio: "inherit", env: process.env });
}
