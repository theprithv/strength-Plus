-- CreateTable
CREATE TABLE "UserAISuggestion" (
    "id" SERIAL NOT NULL,
    "userId" TEXT NOT NULL,
    "suggestionKey" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserAISuggestion_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserAISuggestion_userId_suggestionKey_key" ON "UserAISuggestion"("userId", "suggestionKey");

-- AddForeignKey
ALTER TABLE "UserAISuggestion" ADD CONSTRAINT "UserAISuggestion_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
