/*
  Warnings:

  - You are about to drop the column `tarrifId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_tarrifId_fkey";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "tarrifId";

-- CreateTable
CREATE TABLE "UserTarrif" (
    "id" SERIAL NOT NULL,
    "start" TIMESTAMP(3) NOT NULL,
    "end" TIMESTAMP(3) NOT NULL,
    "userId" INTEGER NOT NULL,
    "tarrifId" INTEGER NOT NULL,

    CONSTRAINT "UserTarrif_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "UserTarrif" ADD CONSTRAINT "UserTarrif_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserTarrif" ADD CONSTRAINT "UserTarrif_tarrifId_fkey" FOREIGN KEY ("tarrifId") REFERENCES "Tarrif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
