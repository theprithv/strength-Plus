/*
  Warnings:

  - You are about to drop the `AICache` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `UserAISuggestion` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "UserAISuggestion" DROP CONSTRAINT "UserAISuggestion_userId_fkey";

-- DropTable
DROP TABLE "AICache";

-- DropTable
DROP TABLE "UserAISuggestion";

-- CreateTable
CREATE TABLE "UserDailyInsight" (
    "userId" TEXT NOT NULL,
    "date" TEXT NOT NULL,
    "insights" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserDailyInsight_pkey" PRIMARY KEY ("userId")
);
