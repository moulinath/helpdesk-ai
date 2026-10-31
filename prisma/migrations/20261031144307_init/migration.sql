-- CreateEnum
CREATE TYPE "TicketStatus" AS ENUM ('received', 'in_progress', 'replied');

-- CreateEnum
CREATE TYPE "TriageState" AS ENUM ('pending', 'done', 'needs_triage');

-- CreateEnum
CREATE TYPE "Category" AS ENUM ('delivery', 'returns_refunds', 'payment_billing', 'product_question', 'product_feedback', 'account_login', 'other');

-- CreateEnum
CREATE TYPE "Priority" AS ENUM ('urgent', 'high', 'normal');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('upset', 'neutral', 'calm');

-- CreateEnum
CREATE TYPE "TriageFlag" AS ENUM ('low_confidence', 'non_english', 'no_faq_match', 'summary_dropped', 'draft_dropped', 'url_in_draft', 'check_priority');

-- CreateEnum
CREATE TYPE "AgentRole" AS ENUM ('agent', 'lead');

-- CreateEnum
CREATE TYPE "AiPurpose" AS ENUM ('triage', 'kb');

-- CreateEnum
CREATE TYPE "AiOutcome" AS ENUM ('ok', 'timeout', 'api_error', 'invalid_output', 'refused', 'disabled', 'capped', 'lost');

-- CreateTable
CREATE TABLE "Ticket" (
    "id" TEXT NOT NULL,
    "refNumber" SERIAL NOT NULL,
    "status" "TicketStatus" NOT NULL DEFAULT 'received',
    "triageState" "TriageState" NOT NULL DEFAULT 'pending',
    "reviewNow" BOOLEAN NOT NULL DEFAULT false,
    "customerName" TEXT NOT NULL,
    "customerEmail" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "statusTokenHash" TEXT NOT NULL,
    "category" "Category",
    "priority" "Priority",
    "labelsCheckedById" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "triageCompletedAt" TIMESTAMP(3),
    "firstReplyAt" TIMESTAMP(3),

    CONSTRAINT "Ticket_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Triage" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT NOT NULL,
    "category" "Category" NOT NULL,
    "priority" "Priority" NOT NULL,
    "sentiment" "Sentiment" NOT NULL,
    "confCategory" DOUBLE PRECISION NOT NULL,
    "confPriority" DOUBLE PRECISION NOT NULL,
    "confSentiment" DOUBLE PRECISION NOT NULL,
    "reason" TEXT NOT NULL,
    "summary" TEXT,
    "draft" TEXT,
    "sources" TEXT[],
    "flags" "TriageFlag"[],
    "promptVersion" TEXT NOT NULL,
    "faqVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Triage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agent" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "AgentRole" NOT NULL DEFAULT 'agent',
    "passwordHash" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Agent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AiCallLog" (
    "id" TEXT NOT NULL,
    "ticketId" TEXT,
    "purpose" "AiPurpose" NOT NULL,
    "promptVersion" TEXT NOT NULL,
    "faqVersion" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "attempt" INTEGER NOT NULL,
    "latencyMs" INTEGER NOT NULL,
    "inputTokens" INTEGER NOT NULL DEFAULT 0,
    "outputTokens" INTEGER NOT NULL DEFAULT 0,
    "costUsd" DECIMAL(10,6) NOT NULL DEFAULT 0,
    "outcome" "AiOutcome" NOT NULL,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiCallLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RateLimit" (
    "key" TEXT NOT NULL,
    "windowStart" TIMESTAMP(3) NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "RateLimit_pkey" PRIMARY KEY ("key","windowStart")
);

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_refNumber_key" ON "Ticket"("refNumber");

-- CreateIndex
CREATE UNIQUE INDEX "Ticket_statusTokenHash_key" ON "Ticket"("statusTokenHash");

-- CreateIndex
CREATE INDEX "Ticket_triageState_createdAt_idx" ON "Ticket"("triageState", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "Triage_ticketId_key" ON "Triage"("ticketId");

-- CreateIndex
CREATE UNIQUE INDEX "Agent_email_key" ON "Agent"("email");

-- CreateIndex
CREATE INDEX "AiCallLog_at_idx" ON "AiCallLog"("at");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_labelsCheckedById_fkey" FOREIGN KEY ("labelsCheckedById") REFERENCES "Agent"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Triage" ADD CONSTRAINT "Triage_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AiCallLog" ADD CONSTRAINT "AiCallLog_ticketId_fkey" FOREIGN KEY ("ticketId") REFERENCES "Ticket"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Ticket references start at HD-24800 (architecture §3).
ALTER SEQUENCE "Ticket_refNumber_seq" RESTART WITH 24800;
