-- CreateIndex
CREATE INDEX "Parent_userId_idx" ON "Parent"("userId");

-- CreateIndex
CREATE INDEX "FeeAssignment_feeTypeId_idx" ON "FeeAssignment"("feeTypeId");

-- CreateIndex
CREATE INDEX "Transaction_feeAssignmentId_idx" ON "Transaction"("feeAssignmentId");

-- CreateIndex
CREATE INDEX "Waiver_feeAssignmentId_idx" ON "Waiver"("feeAssignmentId");
