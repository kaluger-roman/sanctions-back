-- CreateTable
CREATE TABLE "Payment" (
    "id" TEXT NOT NULL,
    "kassa_id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "tarrifId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_tarrifId_fkey" FOREIGN KEY ("tarrifId") REFERENCES "Tarrif"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
