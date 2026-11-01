import { PrismaPg } from "@prisma/adapter-pg";

import { PrismaClient } from "../src/generated/prisma/client";
import { seedDemoAccounts } from "../src/lib/seed";

// Run with `npm run db:seed` (prisma.config.ts loads .env.local first).
async function main() {
  const connectionString = process.env["DATABASE_URL"];
  if (!connectionString) {
    throw new Error("DATABASE_URL is not set");
  }
  const db = new PrismaClient({ adapter: new PrismaPg({ connectionString }) });
  try {
    const emails = await seedDemoAccounts(db);
    console.log(`Seeded demo accounts: ${emails.join(", ")}`);
  } finally {
    await db.$disconnect();
  }
}

main().catch((error: unknown) => {
  console.error(error);
  process.exit(1);
});
