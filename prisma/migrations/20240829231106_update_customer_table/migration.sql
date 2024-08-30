/*
  Warnings:

  - The primary key for the `customers` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `customer_code` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `customer_id` on the `readings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[code]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_code` to the `readings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "readings" DROP CONSTRAINT "readings_customer_id_fkey";

-- DropIndex
DROP INDEX "customers_customer_code_key";

-- AlterTable
ALTER TABLE "customers" DROP CONSTRAINT "customers_pkey",
DROP COLUMN "customer_code",
DROP COLUMN "id",
ADD COLUMN     "code" TEXT NOT NULL,
ADD CONSTRAINT "customers_pkey" PRIMARY KEY ("code");

-- AlterTable
ALTER TABLE "readings" DROP COLUMN "customer_id",
ADD COLUMN     "customer_code" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_code_key" ON "customers"("code");

-- AddForeignKey
ALTER TABLE "readings" ADD CONSTRAINT "readings_customer_code_fkey" FOREIGN KEY ("customer_code") REFERENCES "customers"("code") ON DELETE RESTRICT ON UPDATE CASCADE;
