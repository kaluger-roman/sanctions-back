/*
  Warnings:

  - You are about to alter the column `duration` on the `Tarrif` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `allowedRequests` on the `Tarrif` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to alter the column `allowedDevices` on the `Tarrif` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Tarrif" ALTER COLUMN "duration" SET DATA TYPE INTEGER,
ALTER COLUMN "allowedRequests" SET DATA TYPE INTEGER,
ALTER COLUMN "allowedDevices" SET DATA TYPE INTEGER;
