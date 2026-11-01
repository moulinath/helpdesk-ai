import { execFileSync } from "node:child_process";

function run(...args: string[]): string {
  return execFileSync("npx", ["tsx", "tests/e2e/db-tool.ts", ...args], { env: process.env }).toString();
}

export function countTickets(subject: string): number {
  return Number(run("count-tickets", subject));
}

export function clearRateLimits(): void {
  run("clear-rate-limits");
}
