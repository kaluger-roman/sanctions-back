-- AlterTable
ALTER TABLE "User" ADD COLUMN     "recoverPasswordRequestTime" TIMESTAMP(3),
ADD COLUMN     "recoverPasswordToken" TEXT;
