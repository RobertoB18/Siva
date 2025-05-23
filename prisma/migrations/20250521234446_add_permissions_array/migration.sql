-- AlterTable
ALTER TABLE "StoreUser" ADD COLUMN     "permissions" TEXT[] DEFAULT ARRAY[]::TEXT[];
