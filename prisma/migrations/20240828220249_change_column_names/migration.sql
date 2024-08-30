/*
  Warnings:

  - You are about to drop the column `createdAt` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `customerCode` on the `customers` table. All the data in the column will be lost.
  - You are about to drop the column `confirmedValue` on the `readings` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `readings` table. All the data in the column will be lost.
  - You are about to drop the column `customerId` on the `readings` table. All the data in the column will be lost.
  - You are about to drop the column `imageUrl` on the `readings` table. All the data in the column will be lost.
  - You are about to drop the column `measureDatetime` on the `readings` table. All the data in the column will be lost.
  - You are about to drop the column `measureType` on the `readings` table. All the data in the column will be lost.
  - You are about to drop the column `measureUuid` on the `readings` table. All the data in the column will be lost.
  - You are about to drop the column `measureValue` on the `readings` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[customer_code]` on the table `customers` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[measure_id]` on the table `readings` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `customer_code` to the `customers` table without a default value. This is not possible if the table is not empty.
  - Added the required column `customer_id` to the `readings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measure_datetime` to the `readings` table without a default value. This is not possible if the table is not empty.
  - The required column `measure_id` was added to the `readings` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `measure_type` to the `readings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measure_value` to the `readings` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "readings" DROP CONSTRAINT "readings_customerId_fkey";

-- DropIndex
DROP INDEX "customers_customerCode_key";

-- DropIndex
DROP INDEX "readings_measureUuid_key";

-- AlterTable
ALTER TABLE "customers" DROP COLUMN "createdAt",
DROP COLUMN "customerCode",
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_code" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "readings" DROP COLUMN "confirmedValue",
DROP COLUMN "createdAt",
DROP COLUMN "customerId",
DROP COLUMN "imageUrl",
DROP COLUMN "measureDatetime",
DROP COLUMN "measureType",
DROP COLUMN "measureUuid",
DROP COLUMN "measureValue",
ADD COLUMN     "confirmed_value" INTEGER,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "customer_id" INTEGER NOT NULL,
ADD COLUMN     "image_url" TEXT,
ADD COLUMN     "measure_datetime" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "measure_id" TEXT NOT NULL,
ADD COLUMN     "measure_type" "MeasureType" NOT NULL,
ADD COLUMN     "measure_value" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "customers_customer_code_key" ON "customers"("customer_code");

-- CreateIndex
CREATE UNIQUE INDEX "readings_measure_id_key" ON "readings"("measure_id");

-- AddForeignKey
ALTER TABLE "readings" ADD CONSTRAINT "readings_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
