import { NextResponse } from 'next/server';
import {prisma} from "@/libs/prisma";

export async function GET(request, {params}){
    try {
        const searchBuy = await prisma.buy.findUnique({
            where: {
                id: Number(params.idBuy)
            }
        });
        return NextResponse.json(searchBuy);
    } catch (error) {
        console.log("No se encontro la compra"+ error);
        return NextResponse.json({error: "No se encontro la compra"}, {status:500});
    }
}

/*export async function PUT(request, {params}){
    const dataUpdate = await request.json();
    console.log(dataUpdate);
    console.log("ID "+params.idBuy);

    const buyUpdate = await prisma.buy.update({
        where: {
            id: Number(params.idBuy)
        },
        data: {
            storeId: dataUpdate.storeId,
            proveedorId: dataUpdate.proveedor,
            total: dataUpdate.total,
            productos: dataUpdate.productos
        }
    });
    return NextResponse.json(buyUpdate);
}*/

export async function DELETE(request, {params}){
    try {
        const getBuy = await prisma.buy.findUnique({
            where: {
                id: Number(params.idBuy)
            }
        });

        const deleteBuy = await prisma.buy.delete({
            where: {
                id: Number(params.idBuy)
            }
        });

        for (const producto of getBuy.productos) {
            await prisma.products.update({
                where: { id: producto.id},
                data: {
                stock: {
                    decrement: producto.quantity // resta la cantidad comprada
                }
                }
            });
        }
        return NextResponse.json(deleteBuy);
    } catch (error) {
        return NextResponse.json({error: "Error al eliminar la compra"}, {status:500});
    }    
}