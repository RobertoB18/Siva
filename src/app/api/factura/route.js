import { PassThrough } from "stream";
import Facturapi from "facturapi";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

export async function GET(request, {params}) {
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    const casse = searchParams.get("casse")

    try {
        if(casse === "1"){

        }
        const facturas = await prisma.facturas.findMany({
            where: {
                storeId: Number(idStore),
            },
            include: {
            clientes: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                rfc: true
              }
            }
          },
          orderBy: [
            { date: 'desc' } 
          ]
        })
        
        return NextResponse.json(facturas);
    } catch (error) {
        return NextResponse.json([], {status: 500});
    }
}