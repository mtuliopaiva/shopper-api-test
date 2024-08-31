-- CreateTable
CREATE TABLE "measures" (
    "id" TEXT NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "measureValue" INTEGER NOT NULL,
    "measureUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "measures_pkey" PRIMARY KEY ("id")
);
