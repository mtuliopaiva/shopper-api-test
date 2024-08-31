/*
  Warnings:

  - The primary key for the `measures` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `measures` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "measures" DROP CONSTRAINT "measures_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "measures_pkey" PRIMARY KEY ("measureUuid");
