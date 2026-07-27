-- CreateTable
CREATE TABLE "PenaltyRule" (
    "id" TEXT NOT NULL,
    "feeTypeId" TEXT NOT NULL,
    "triggerDaysAfterDue" INTEGER NOT NULL,
    "penaltyAmount" DECIMAL(10,2),
    "penaltyPercent" DECIMAL(5,2),
    "autoApply" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PenaltyRule_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AppliedPenalty" (
    "id" TEXT NOT NULL,
    "feeAssignmentId" TEXT NOT NULL,
    "penaltyRuleId" TEXT NOT NULL,
    "appliedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AppliedPenalty_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PenaltyRule_feeTypeId_idx" ON "PenaltyRule"("feeTypeId");

-- CreateIndex
CREATE INDEX "PenaltyRule_autoApply_idx" ON "PenaltyRule"("autoApply");

-- CreateIndex
CREATE INDEX "AppliedPenalty_feeAssignmentId_idx" ON "AppliedPenalty"("feeAssignmentId");

-- CreateIndex
CREATE INDEX "AppliedPenalty_penaltyRuleId_idx" ON "AppliedPenalty"("penaltyRuleId");

-- CreateIndex
CREATE UNIQUE INDEX "AppliedPenalty_feeAssignmentId_penaltyRuleId_key" ON "AppliedPenalty"("feeAssignmentId", "penaltyRuleId");

-- AddForeignKey
ALTER TABLE "PenaltyRule" ADD CONSTRAINT "PenaltyRule_feeTypeId_fkey" FOREIGN KEY ("feeTypeId") REFERENCES "FeeType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedPenalty" ADD CONSTRAINT "AppliedPenalty_feeAssignmentId_fkey" FOREIGN KEY ("feeAssignmentId") REFERENCES "FeeAssignment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AppliedPenalty" ADD CONSTRAINT "AppliedPenalty_penaltyRuleId_fkey" FOREIGN KEY ("penaltyRuleId") REFERENCES "PenaltyRule"("id") ON DELETE CASCADE ON UPDATE CASCADE;
