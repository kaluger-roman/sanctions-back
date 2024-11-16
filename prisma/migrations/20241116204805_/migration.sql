/*
  Warnings:

  - A unique constraint covering the columns `[userId,deviceId,destroyedAt]` on the table `UserSession` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "UserSession_userId_deviceId_key";

-- CreateIndex
CREATE UNIQUE INDEX "UserSession_userId_deviceId_destroyedAt_key" ON "UserSession"("userId", "deviceId", "destroyedAt");
