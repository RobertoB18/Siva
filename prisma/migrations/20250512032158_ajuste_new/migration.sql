/*
  Warnings:

  - You are about to drop the `buys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `provider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "buys" DROP CONSTRAINT "buys_providerId_fkey";

-- DropForeignKey
ALTER TABLE "buys" DROP CONSTRAINT "buys_storeId_fkey";

-- DropForeignKey
ALTER TABLE "provider" DROP CONSTRAINT "provider_storeId_fkey";

-- DropTable
DROP TABLE "buys";

-- DropTable
DROP TABLE "provider";

-- CreateTable
CREATE TABLE "buy" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "providerId" INTEGER,
    "productos" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codeFactura" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "buy_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "codeProvider" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "Provider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "buy" ADD CONSTRAINT "buy_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "Provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buy" ADD CONSTRAINT "buy_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Provider" ADD CONSTRAINT "Provider_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
