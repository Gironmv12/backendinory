/*
  Warnings:

  - You are about to drop the column `providerId` on the `AuthAccount` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[provider,externalId]` on the table `AuthAccount` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `ExpenseCategory` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,name]` on the table `IncomeSource` will be added. If there are existing duplicate values, this will fail.
  - Changed the type of `action` on the `AuditLog` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `externalId` to the `AuthAccount` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AuditAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'ERROR');

-- DropIndex
DROP INDEX "AuthAccount_provider_providerId_key";

-- AlterTable
ALTER TABLE "AuditLog" DROP COLUMN "action",
ADD COLUMN     "action" "AuditAction" NOT NULL;

-- AlterTable
ALTER TABLE "AuthAccount" DROP COLUMN "providerId",
ADD COLUMN     "externalId" TEXT NOT NULL,
ADD COLUMN     "lastIpAddress" TEXT,
ADD COLUMN     "signInCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "userAgent" TEXT;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false;

-- DropEnum
DROP TYPE "AuditStatus";

-- CreateIndex
CREATE UNIQUE INDEX "AuthAccount_provider_externalId_key" ON "AuthAccount"("provider", "externalId");

-- CreateIndex
CREATE UNIQUE INDEX "ExpenseCategory_userId_name_key" ON "ExpenseCategory"("userId", "name");

-- CreateIndex
CREATE UNIQUE INDEX "IncomeSource_userId_name_key" ON "IncomeSource"("userId", "name");
