import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../../src/generated/prisma/client";
import { seedDemoAccounts } from "../../src/lib/seed";

/** Fresh demo accounts and no leftover rate-limit counts. Run by global-setup.ts through tsx. */
async function main() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString || !new URL(connectionString).pathname.endsWith("_test")) {
    throw new Error('Playwright needs DATABASE_URL pointing at a database whose name ends in "_test"');
  }
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    await db.rateLimit.deleteMany();
    await seedDemoAccounts(db);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
