-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citus";

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citus_columnar";

-- CreateIndex
CREATE INDEX "description_trgm_idx" ON "Sanction" USING GIN ("description" gin_trgm_ops);

-- CreateIndex
CREATE INDEX "idx_restriction" ON "Sanction"("restriction");

-- CreateIndex
CREATE INDEX "idx_sourcecountry" ON "Sanction"("sourceCountry");

SELECT create_distributed_table('"Sanction"', 'id');
