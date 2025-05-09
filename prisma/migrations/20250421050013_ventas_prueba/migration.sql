/*
  Warnings:

  - Added the required column `productos` to the `Sale` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "cliente" INTEGER,
ADD COLUMN     "productos" JSONB NOT NULL;
