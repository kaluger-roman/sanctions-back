-- CreateTable
CREATE TABLE "CounterSanctionSearchRequest" (
    "id" SERIAL NOT NULL,
    "searchTypes" TEXT[],
    "restrictions" TEXT[],
    "sourceDocumentShorts" TEXT[],
    "searchTags" TEXT[],
    "userTarrifId" INTEGER,

    CONSTRAINT "CounterSanctionSearchRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CounterSanctionReport" (
    "id" TEXT NOT NULL,
    "title" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "searchTypes" TEXT[],
    "restrictions" TEXT[],
    "sourceDocumentShorts" TEXT[],
    "searchTags" TEXT[],
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "CounterSanctionReport_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CounterSanctionSearchRequest" ADD CONSTRAINT "CounterSanctionSearchRequest_userTarrifId_fkey" FOREIGN KEY ("userTarrifId") REFERENCES "UserTarrif"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CounterSanctionReport" ADD CONSTRAINT "CounterSanctionReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
