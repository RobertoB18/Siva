-- AlterTable
ALTER TABLE "Sale" ADD COLUMN     "metodoPago" TEXT NOT NULL DEFAULT '01',
ADD COLUMN     "use" TEXT NOT NULL DEFAULT 'G03';

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "priceCost" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "priceMen" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "priceMay" SET DATA TYPE DOUBLE PRECISION;
