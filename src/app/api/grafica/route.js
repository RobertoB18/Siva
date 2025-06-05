import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request, {params}) {
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");

  if (isNaN(idStore)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }
  try {
    const ventas = await prisma.sale.findMany({
        where: { storeId: Number(idStore) },
        select: {
        date: true,
        total: true,
        },
    });

    const compras = await prisma.buy.findMany({
        where: { storeId: Number(idStore) },
        select: {
        date: true,
        total: true,
        },
    });

    return NextResponse.json({ ventas, compras });  
  } catch (error) {
    console.log("Error:" + error);
    return NextResponse.json([], {status: 500}); 
  }
}