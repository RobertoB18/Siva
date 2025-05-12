import { Providers } from "@/app/Providers";
import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    try {
      const compra = await prisma.buy.findMany({
            where:{
              storeId: Number(idStore)
            },
            include: {
              provider: {
                select: {
                  id: true,
                  name: true,
                }
              }
            },
            orderBy: [
              { date: 'desc' } 
            ]
          }
        );
        return NextResponse.json(compra);
    } catch (error) {
        return NextResponse.json({error: "Error al obtener las compras "}, {status:500});
    }
}

export async function POST(request) {
    const createBuy = await request.json();
    try {
        const newBuy = await prisma.buy.create({
            data: {
                storeId: createBuy.storeId,
                providerId: createBuy.providerId,
                total: createBuy.total,
                productos: createBuy.productos,
                codeFactura: "1",
            }
        });

        for (const producto of createBuy.productos) {
          await prisma.products.update({
            where: { id: producto.id },
            data: {
              stock: {
                increment: producto.quantity // Restar la cantidad vendida
              }
            }
          });
        }
        
        return NextResponse.json(newBuy);
    } catch (error) {
        return new NextResponse.json({error: "Error al registrar la compra"}, {status:500});
    }
}
