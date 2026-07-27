-- AlterEnum
ALTER TYPE "PaymentStatus" ADD VALUE 'REFUNDED';

-- AlterTable
ALTER TABLE "Transaction" ADD COLUMN "refundedAmount" DECIMAL(10,2),
ADD COLUMN "refundReason" TEXT,
ADD COLUMN "refundedAt" TIMESTAMP(3),
ADD COLUMN "refundedBy" TEXT;
