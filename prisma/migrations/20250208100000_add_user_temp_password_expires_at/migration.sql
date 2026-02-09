-- AlterTable
ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tempPasswordExpiresAt" TIMESTAMP(3);
