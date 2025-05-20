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
        return NextResponse.json([], {status:500});
    }
}

export async function DELETE(request, {params}){
    try {
        const getBuy = await prisma.buy.findUnique({
            where: {
                id: Number(params.idBuy)
            }
        });
        
        for (const producto of getBuy.productos) {
            const getProduct = await prisma.products.findUnique({
                where: {
                    id: producto.id
                }
            }); 
            console.log(getProduct);

            if(getProduct.stock < producto.quantity){
                return NextResponse.json({error: "No hay suficiente stock para eliminar la compra"}, {status:400});
            }
            await prisma.products.update({
                where: { id: producto.id},
                data: {
                stock: {
                    decrement: producto.quantity // resta la cantidad comprada
                }
                }
            });
        }
        const deleteBuy = await prisma.buy.delete({
            where: {
                id: Number(params.idBuy)
            }
        });
        return NextResponse.json(deleteBuy);
    } catch (error) {
        return NextResponse.json({error: "Error al eliminar la compra"}, {status:500});
    }    
}