/*
  Warnings:

  - You are about to alter the column `confirmed_value` on the `readings` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `measure_value` on the `readings` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "readings" ALTER COLUMN "confirmed_value" SET DATA TYPE INTEGER,
ALTER COLUMN "measure_value" SET DATA TYPE INTEGER;
