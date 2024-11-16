-- CreateTable
CREATE TABLE "Preferences" (
    "id" SERIAL NOT NULL,
    "autoLogoutTime" INTEGER NOT NULL DEFAULT 3600000,

    CONSTRAINT "Preferences_pkey" PRIMARY KEY ("id")
);
