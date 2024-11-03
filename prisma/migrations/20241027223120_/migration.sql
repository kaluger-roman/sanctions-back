/*
  Warnings:

  - A unique constraint covering the columns `[identifier]` on the table `Tarrif` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "tarrifId" INTEGER NOT NULL DEFAULT 1;

-- CreateIndex
CREATE UNIQUE INDEX "Tarrif_identifier_key" ON "Tarrif"("identifier");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_tarrifId_fkey" FOREIGN KEY ("tarrifId") REFERENCES "Tarrif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
