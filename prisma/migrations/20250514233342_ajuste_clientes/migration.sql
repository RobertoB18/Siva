-- AlterTable
ALTER TABLE "clientes" ADD COLUMN     "razonSocial" VARCHAR(512),
ADD COLUMN     "regimenFiscal" VARCHAR(512),
ADD COLUMN     "rfc" VARCHAR(512),
ADD COLUMN     "status" BOOLEAN;
