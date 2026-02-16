-- AlterTable
ALTER TABLE "Exercise" ADD COLUMN     "secondaryMuscles" TEXT[] DEFAULT ARRAY[]::TEXT[];
