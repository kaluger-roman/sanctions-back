/*
  Warnings:

  - You are about to drop the column `kassa_id` on the `Payment` table. All the data in the column will be lost.
  - Added the required column `kassaId` to the `Payment` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "kassa_id",
ADD COLUMN     "kassaId" TEXT NOT NULL;
