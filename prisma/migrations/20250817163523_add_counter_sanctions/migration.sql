-- CreateTable
CREATE TABLE "CounterSanction" (
    "id" SERIAL NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "exception" TEXT NOT NULL DEFAULT '',
    "sourceDocument" TEXT NOT NULL,
    "restriction" TEXT NOT NULL,
    "sourceDocumentShort" TEXT NOT NULL DEFAULT '',

    CONSTRAINT "CounterSanction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "countersanction_description_trgm_idx" ON "CounterSanction" USING GIN ("description" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "countersanction_exception_trgm_idx" ON "CounterSanction" USING GIN ("exception" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_countersanction_restriction" ON "CounterSanction"("restriction");

-- CreateIndex
CREATE INDEX "idx_countersanction_sourcedocumentshort" ON "CounterSanction"("sourceDocumentShort");
