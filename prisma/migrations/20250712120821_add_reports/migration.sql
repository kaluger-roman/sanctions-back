-- CreateTable
CREATE TABLE "Report" (
    "id" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER,
    "countries" TEXT[],
    "searchTypes" TEXT[],
    "restrictions" TEXT[],
    "sourceDocumentOrigins" TEXT[],
    "searchTags" TEXT[],
    "searchLanguage" TEXT NOT NULL DEFAULT 'en',

    CONSTRAINT "Report_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Report" ADD CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
