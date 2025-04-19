/*
  Warnings:

  - Added the required column `codesat` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stockMin` to the `products` table without a default value. This is not possible if the table is not empty.
  - Added the required column `unities` to the `products` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "products" ADD COLUMN     "codeBar" INTEGER,
ADD COLUMN     "codesat" INTEGER NOT NULL,
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "status" BOOLEAN NOT NULL,
ADD COLUMN     "stockMin" INTEGER NOT NULL,
ADD COLUMN     "unities" TEXT NOT NULL;
