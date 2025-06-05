// app/api/report/route.js o route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request) {
  const { searchParams } = new URL(request.url);

  const idStore = searchParams.get("idStore");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  console.log(idStore + from + to)
  // Validaciones básicas
  if (isNaN(idStore)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  if (!from || !to) {
    return NextResponse.json({ error: "Rango de fechas requerido" }, { status: 400 });
  }

  try {
    const factura = await prisma.facturas.findMany({
      where: {
        storeId: Number(idStore),
        date: {
          gte: new Date(from),
          lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
        },
      },
      select: {
        date: true,
        total: true,
        clientes: {
            select:{
                razonSocial:true,
                rfc: true
            }
        }
      },
    });

    return NextResponse.json(factura);
  } catch (error) {
    console.error("Error en la API de reporte:", error);
    return NextResponse.json({ error: "Error del servidor" }, { status: 500 });
  }
}
