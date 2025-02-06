-- AlterTable
ALTER TABLE "Preferences" ALTER COLUMN "momentumOnlineDevicesPerUser" SET DEFAULT 3;

-- AlterTable
ALTER TABLE "Sanction" ADD COLUMN     "descriptionRussian" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SearchRequest" ADD COLUMN     "searchLanguage" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "momentumOnlineDevicesPerUser" SET DEFAULT 3;

-- CreateIndex
CREATE INDEX "descriptionrussian_trgm_idx" ON "Sanction" USING gin ("descriptionRussian" gin_trgm_ops);
