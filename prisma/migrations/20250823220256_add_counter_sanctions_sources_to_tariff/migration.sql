-- AlterTable
ALTER TABLE "Tarrif" ADD COLUMN     "allowedCounterSanctionSources" TEXT[] DEFAULT ARRAY[]::TEXT[];
