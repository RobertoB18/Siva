import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";


export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    const casse = searchParams.get("casse");
    const client = searchParams.get("client")
    console.log(`${idStore}, ${casse}, ${client}`)

    try {
      if(casse === "1"){
        const ventas = await prisma.sale.findMany({
          where: {
            storeId: Number(idStore),
            status: false,
            clientes: {
              name: {
                contains: client,
                mode: 'insensitive',
              }
            }
          },
          include: {
            clientes: true
          },
          orderBy: [
            { date: 'desc' } 
          ]
        });
        return NextResponse.json(ventas);
      }
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
        return NextResponse.json([], {status:500});
    }
    
}
export async function POST(request) {
  const createSale = await request.json();
  console.log(createSale);

  try {
    const newSale = await prisma.Sale.create({
      data: {
        storeId: createSale.storeId,
        clienteId: createSale.cliente ?? null,
        total: createSale.total,
        productos: createSale.productos,
        subtotal: createSale.subtotal,
        descuento: createSale.descuento ? createSale.descuento : 0,
        use: createSale.use ? createSale.use : "",
        metodoPago: createSale.pago
      },
      include: {
        clientes: true, // Esto incluye la información del cliente relacionado
      },
    });

    console.log(newSale)
    for (const producto of createSale.productos) {
      const product = await prisma.products.findUnique({
        where: { id: producto.id },
      });

      let state = true;
      const stockTotal = product.stock - producto.quantity;

      if (stockTotal < product.stockMin) state = false;

      await prisma.products.update({
        where: { id: producto.id },
        data: {
          status: state,
          stock: {
            decrement: producto.quantity,
          },
        },
      });

      // 🔄 Reabastecimiento automático desde paquete a pieza si se queda sin stock
      if (product.name.toLowerCase().includes("pieza") && stockTotal <= 0) {
        const baseName = product.name.toLowerCase().replace(" (pieza)", "").trim();

        const productoCaja = await prisma.products.findFirst({
          where: {
            storeId: product.storeId,
            name: {
              contains: baseName,
              mode: "insensitive",
            },
            NOT: {
              id: product.id,
            },
            unity: {
              contains: "paquete", // Puedes cambiar por "caja" si es necesario
              mode: "insensitive",
            },
          },
        });
        console.log(productoCaja);
        if (productoCaja && productoCaja.stock > 0 && productoCaja.unitsPerPackage) {
          // Restamos 1 al producto tipo paquete
          await prisma.products.update({
            where: { id: productoCaja.id },
            data: {
              stock: {
                decrement: 1,
              },
            },
          });

          // Sumamos al producto "pieza" las unidades del paquete
          await prisma.products.update({
            where: { id: product.id },
            data: {
              stock: {
                increment: productoCaja.unitsPerPackage,
              },
            },
          });
          console.log(
            `Reabastecido ${productoCaja.unitsPerPackage} piezas de ${product.name} desde ${productoCaja.name}`
          );
        }
      }
    }

    return NextResponse.json(newSale);
  } catch (error) {
    console.log(error);
    return new NextResponse.json(
      { error: "Error al crear la venta" },
      { status: 500 }
    );
  }
}
