/*
  Warnings:

  - You are about to drop the column `cer` on the `store` table. All the data in the column will be lost.
  - You are about to drop the column `rfc` on the `store` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[idApi]` on the table `store` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "store" DROP COLUMN "cer",
DROP COLUMN "rfc",
ADD COLUMN     "idApi" TEXT,
ADD COLUMN     "razonSocial" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "store_idApi_key" ON "store"("idApi");
