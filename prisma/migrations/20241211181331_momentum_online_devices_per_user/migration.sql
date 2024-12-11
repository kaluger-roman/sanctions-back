-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "momentumOnlineDevicesPerUser" INTEGER NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "momentumOnlineDevicesPerUser" INTEGER NOT NULL DEFAULT 1;
