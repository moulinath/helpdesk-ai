import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../src/generated/prisma/client";

// Small database helper for browser tests, run through tsx (Playwright can't load the ESM client).
// Usage: tsx tests/e2e/db-tool.ts count-tickets <subject> | clear-rate-limits
async function main() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString || !new URL(connectionString).pathname.endsWith("_test")) {
    throw new Error('DATABASE_URL must point at a database whose name ends in "_test"');
  }
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const [command, argument] = process.argv.slice(2);
    if (command === "count-tickets") {
      process.stdout.write(String(await db.ticket.count({ where: { subject: argument ?? "" } })));
    } else if (command === "clear-rate-limits") {
      await db.rateLimit.deleteMany();
    } else {
      throw new Error(`unknown command: ${command}`);
    }
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
