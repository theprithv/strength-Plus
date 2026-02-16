-- DropForeignKey
ALTER TABLE "UserPRSlot" DROP CONSTRAINT "UserPRSlot_exerciseId_fkey";

-- AlterTable
ALTER TABLE "UserPRSlot" ALTER COLUMN "exerciseId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "UserPRSlot" ADD CONSTRAINT "UserPRSlot_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE SET NULL ON UPDATE CASCADE;
