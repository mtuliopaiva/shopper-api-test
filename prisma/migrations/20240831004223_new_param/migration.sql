/*
  Warnings:

  - Added the required column `customerCode` to the `measures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measureDatetime` to the `measures` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measureType` to the `measures` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "measures" ADD COLUMN     "customerCode" TEXT NOT NULL,
ADD COLUMN     "measureDatetime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "measureType" TEXT NOT NULL;
