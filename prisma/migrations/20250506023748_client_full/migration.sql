/*
  Warnings:

  - You are about to drop the column `cliente` on the `Sale` table. All the data in the column will be lost.
  - You are about to drop the `cliente` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE "Sale" DROP COLUMN "cliente",
ADD COLUMN     "clienteId" INTEGER;

-- DropTable
DROP TABLE "cliente";

-- CreateTable
CREATE TABLE "clientes" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,

    CONSTRAINT "clientes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "clientes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "clientes" ADD CONSTRAINT "clientes_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
