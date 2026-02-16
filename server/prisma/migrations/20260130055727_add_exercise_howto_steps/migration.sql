-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "howToSteps" TEXT[] DEFAULT ARRAY[]::TEXT[];
