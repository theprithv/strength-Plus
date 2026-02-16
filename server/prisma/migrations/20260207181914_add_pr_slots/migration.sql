-- CreateTable
CREATE TABLE "UserPRSlot" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "slotIndex" INTEGER NOT NULL,
    "exerciseId" TEXT NOT NULL,

    CONSTRAINT "UserPRSlot_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPRSlot_userId_slotIndex_key" ON "UserPRSlot"("userId", "slotIndex");

-- AddForeignKey
ALTER TABLE "UserPRSlot" ADD CONSTRAINT "UserPRSlot_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserPRSlot" ADD CONSTRAINT "UserPRSlot_exerciseId_fkey" FOREIGN KEY ("exerciseId") REFERENCES "Exercise"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
