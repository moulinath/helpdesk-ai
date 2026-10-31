import { config } from "dotenv";
import { defineConfig } from "prisma/config";

// Next.js reads .env.local; load it for the Prisma CLI too. Variables already set
// in the environment (CI, or a one-off DATABASE_URL=...) take precedence.
config({ path: ".env.local", quiet: true });

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    seed: "tsx prisma/seed.ts",
  },
  datasource: {
    // Migrations need a direct connection; on Neon DATABASE_URL is the pooled one (§7.5).
    url: process.env["DIRECT_URL"] ?? process.env["DATABASE_URL"],
  },
});
