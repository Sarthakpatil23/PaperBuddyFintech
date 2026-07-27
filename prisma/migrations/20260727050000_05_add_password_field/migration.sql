-- AlterTable User add password column
ALTER TABLE "User" ADD COLUMN "password" TEXT DEFAULT 'paperbuddy2026';

-- AlterTable Parent add password column
ALTER TABLE "Parent" ADD COLUMN "password" TEXT DEFAULT 'paperbuddy2026';
