-- AlterTable
ALTER TABLE "Triage" ALTER COLUMN "sources" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "flags" SET DEFAULT ARRAY[]::"TriageFlag"[];

-- CreateIndex
CREATE INDEX "AiCallLog_ticketId_idx" ON "AiCallLog"("ticketId");
