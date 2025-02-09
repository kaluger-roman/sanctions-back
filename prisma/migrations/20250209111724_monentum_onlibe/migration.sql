/*
  Warnings:

  - You are about to drop the column `momentumOnlineDevicesPerUser` on the `Preferences` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Preferences" DROP COLUMN "momentumOnlineDevicesPerUser",
ADD COLUMN     "momentumOnlineDevicesPerJurUser" INTEGER NOT NULL DEFAULT 3,
ADD COLUMN     "momentumOnlineDevicesPerPhysUser" INTEGER NOT NULL DEFAULT 1;
