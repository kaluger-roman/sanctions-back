-- AlterTable
ALTER TABLE "Preferences" ADD COLUMN     "maxUnlinkedReports" INTEGER NOT NULL DEFAULT 500,
ADD COLUMN     "maxUserReports" INTEGER NOT NULL DEFAULT 100;
