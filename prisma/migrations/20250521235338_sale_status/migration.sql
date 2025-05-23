/*
  Warnings:

  - You are about to drop the `compra` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "status" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "compra";
