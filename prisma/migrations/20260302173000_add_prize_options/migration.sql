-- CreateTable
CREATE TABLE "PrizeOption" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdById" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PrizeOption_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PrizeOption_name_key" ON "PrizeOption"("name");

-- CreateIndex
CREATE INDEX "PrizeOption_createdById_idx" ON "PrizeOption"("createdById");

-- AddForeignKey
ALTER TABLE "PrizeOption" ADD CONSTRAINT "PrizeOption_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
