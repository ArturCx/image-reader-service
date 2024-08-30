/*
  Warnings:

  - The primary key for the `readings` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `measure_id` on the `readings` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "readings_measure_id_key";

-- AlterTable
ALTER TABLE "readings" DROP CONSTRAINT "readings_pkey",
DROP COLUMN "measure_id",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "readings_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "readings_id_seq";
