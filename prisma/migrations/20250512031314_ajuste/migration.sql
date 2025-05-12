/*
  Warnings:

  - You are about to drop the `Buys` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Provider` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Buys" DROP CONSTRAINT "Buys_providerId_fkey";

-- DropForeignKey
ALTER TABLE "Buys" DROP CONSTRAINT "Buys_storeId_fkey";

-- DropForeignKey
ALTER TABLE "Provider" DROP CONSTRAINT "Provider_storeId_fkey";

-- DropTable
DROP TABLE "Buys";

-- DropTable
DROP TABLE "Provider";

-- CreateTable
CREATE TABLE "buys" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "providerId" INTEGER,
    "productos" JSONB NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "codeFactura" TEXT NOT NULL,
    "total" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "buys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "provider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "rfc" TEXT NOT NULL,
    "storeId" INTEGER NOT NULL,
    "codeProvider" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,

    CONSTRAINT "provider_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "buys" ADD CONSTRAINT "buys_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "provider"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "buys" ADD CONSTRAINT "buys_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "provider" ADD CONSTRAINT "provider_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
