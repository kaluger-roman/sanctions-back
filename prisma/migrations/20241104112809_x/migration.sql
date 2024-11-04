-- AlterTable
ALTER TABLE "Device" ADD COLUMN     "userTarrifId" INTEGER;

-- AlterTable
ALTER TABLE "SearchRequest" ADD COLUMN     "userTarrifId" INTEGER;

-- AddForeignKey
ALTER TABLE "SearchRequest" ADD CONSTRAINT "SearchRequest_userTarrifId_fkey" FOREIGN KEY ("userTarrifId") REFERENCES "UserTarrif"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Device" ADD CONSTRAINT "Device_userTarrifId_fkey" FOREIGN KEY ("userTarrifId") REFERENCES "UserTarrif"("id") ON DELETE SET NULL ON UPDATE CASCADE;
