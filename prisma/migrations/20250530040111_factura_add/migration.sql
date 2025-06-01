-- CreateTable
CREATE TABLE "facturas" (
    "id" SERIAL NOT NULL,
    "storeId" INTEGER NOT NULL,
    "clientName" TEXT NOT NULL,
    "idFactura" TEXT NOT NULL,

    CONSTRAINT "facturas_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "facturas" ADD CONSTRAINT "facturas_storeId_fkey" FOREIGN KEY ("storeId") REFERENCES "store"("id") ON DELETE CASCADE ON UPDATE CASCADE;
