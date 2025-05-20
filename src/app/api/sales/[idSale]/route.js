import { NextResponse } from 'next/server';
import {prisma} from "@/libs/prisma";

export async function GET(request, {params}){
    try {
        const searchSale = await prisma.Sale.findUnique({
            where: {
                id: Number(params.idSale)
            }
        });
        //console.log(searchSale);
        return NextResponse.json(searchSale);
    } catch (error) {
        console.log(error);
        return NextResponse.json([], {status:500});
    }
}

export async function PUT(request, {params}){
    const dataUpdate = await request.json();
    console.log(dataUpdate);
    console.log("ID "+params.idSale);
    const productUpdate = await prisma.Sale.update({
        where: {
            id: Number(params.idSale)
        },
        data: {
            storeId: dataUpdate.storeId,
            clienteId: dataUpdate.cliente,
            total: dataUpdate.total,
            productos: dataUpdate.productos
        }
    });
    return NextResponse.json(productUpdate);
}

export async function DELETE(request, {params}){
    try {
        const getProduct = await prisma.Sale.findUnique({
            where: {
                id: Number(params.idSale)
            }
        });
        console.log(getProduct);

        const deleteProduct = await prisma.Sale.delete({
            where: {
                id: Number(params.idSale)
            }
        });

        for (const producto of getProduct.productos) {
            await prisma.products.update({
                where: { id: producto.id},
                data: {
                stock: {
                    increment: producto.quantity // Suma la cantidad vendida
                }
                }
            });
        }
        return NextResponse.json(deleteProduct);
    } catch (error) {
        console.log("Error al eliminar la venta: " + error);
        return NextResponse.json({error: "Error al eliminar la venta"}, {status:500});
    }
    

    
}