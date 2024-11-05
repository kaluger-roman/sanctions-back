-- DropForeignKey
ALTER TABLE "Device" DROP CONSTRAINT "Device_userTarrifId_fkey";

-- CreateTable
CREATE TABLE "_DeviceToUserTarrif" (
    "A" TEXT NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DeviceToUserTarrif_AB_unique" ON "_DeviceToUserTarrif"("A", "B");

-- CreateIndex
CREATE INDEX "_DeviceToUserTarrif_B_index" ON "_DeviceToUserTarrif"("B");

-- AddForeignKey
ALTER TABLE "_DeviceToUserTarrif" ADD CONSTRAINT "_DeviceToUserTarrif_A_fkey" FOREIGN KEY ("A") REFERENCES "Device"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DeviceToUserTarrif" ADD CONSTRAINT "_DeviceToUserTarrif_B_fkey" FOREIGN KEY ("B") REFERENCES "UserTarrif"("id") ON DELETE CASCADE ON UPDATE CASCADE;
