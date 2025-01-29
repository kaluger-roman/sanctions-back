-- AlterTable
ALTER TABLE "Sanction" ADD COLUMN     "sourceDocumentOrigin" TEXT NOT NULL DEFAULT '';

-- AlterTable
ALTER TABLE "SearchRequest" ADD COLUMN     "sourceDocumentOrigins" TEXT[];

-- CreateIndex
CREATE INDEX "idx_sourcedocumentorigin" ON "Sanction"("sourceDocumentOrigin");
