-- CreateTable
CREATE TABLE "SearchRequest" (
    "id" SERIAL NOT NULL,
    "countries" TEXT[],
    "searchTypes" TEXT[],
    "restrictions" TEXT[],
    "searchTags" TEXT[],

    CONSTRAINT "SearchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Device" (
    "id" TEXT NOT NULL,

    CONSTRAINT "Device_pkey" PRIMARY KEY ("id")
);
