/*
  Warnings:

  - Added the required column `splitName` to the `Workout` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "SetLog" ADD COLUMN     "volume" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Workout" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "duration" INTEGER,
ADD COLUMN     "splitName" TEXT NOT NULL,
ADD COLUMN     "totalVolume" DOUBLE PRECISION NOT NULL DEFAULT 0;
