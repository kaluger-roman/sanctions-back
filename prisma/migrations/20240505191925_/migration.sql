-- CreateTable
CREATE TABLE "Sanction" (
    "id" SERIAL NOT NULL,
    "sourceCountry" TEXT NOT NULL,
    "sourceDocument" TEXT NOT NULL,
    "restriction" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Sanction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);
