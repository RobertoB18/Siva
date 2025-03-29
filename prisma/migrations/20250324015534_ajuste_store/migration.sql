/*
  Warnings:

  - The primary key for the `StoreUser` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `StoreUser` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "StoreUser" DROP CONSTRAINT "StoreUser_storeId_fkey";

-- DropForeignKey
ALTER TABLE "StoreUser" DROP CONSTRAINT "StoreUser_userId_fkey";

-- AlterTable
ALTER TABLE "StoreUser" DROP CONSTRAINT "StoreUser_pkey",
DROP COLUMN "id",
ADD CONSTRAINT "StoreUser_pkey" PRIMARY KEY ("userId", "storeId");

-- AddForeignKey
ALTER TABLE "StoreUser" ADD CONSTRAINT "StoreUser_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "StoreUser" ADD CONSTRAINT "StoreUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
