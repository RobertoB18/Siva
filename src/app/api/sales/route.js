import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");

    try {
        const ventas = await prisma.Sale.findMany({
            where:{
              storeId: Number(idStore)
            },
            include: {
              clientes: {
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
        return NextResponse.json(ventas);

    } catch (error) {
        console.log(error);
        return NextResponse.json({error: "Error al obtener los clientes"});
    }
    
}

export async function POST(request) {
    const createSale = await request.json();
    console.log(createSale);
    try {
        const newSale = await prisma.Sale.create({
            data: {
                storeId: createSale.storeId,
                clienteId: createSale.cliente,
                total: createSale.total,
                productos: createSale.productos
            }
        });

        for (const producto of createSale.productos) {
          const product = await prisma.products.findUnique({
            where: { id: producto.id }
          });

          let state = true;
          const stockTotal = product.stock - producto.quantity;
          console.log(stockTotal);
          
          if(stockTotal < product.stockMin) state = false;
          
          console.log(state);
          await prisma.products.update({
            where: { id: producto.id },
            data: {
              status: state,
              stock: {
                decrement: producto.quantity // Restar la cantidad vendida
              }
            }
          });
        }
        
        return NextResponse.json(newSale);
    } catch (error) {
      console.log(error);
        return new NextResponse.json({error: "Error al crear la venta"}, {status:500});
    }
}
