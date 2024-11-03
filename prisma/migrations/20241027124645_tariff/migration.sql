-- CreateTable
CREATE TABLE "Tarrif" (
    "id" SERIAL NOT NULL,
    "identifier" TEXT NOT NULL,
    "duration" INTEGER NOT NULL,
    "allowedRequests" INTEGER NOT NULL,
    "allowedDevices" INTEGER NOT NULL,
    "price" INTEGER NOT NULL,
    "allowedCountries" TEXT[],

    CONSTRAINT "Tarrif_pkey" PRIMARY KEY ("id")
);
