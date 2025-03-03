import { NextResponse } from 'next/server';
import {prisma} from "@/libs/prisma";

export async function GET({params}){
    const compra = await prisma.compra.findUnique({
        where: {
            id: Number(params.compraId)
        }
    });
    console.log(compra);
    return NextResponse.json(compra);
}

export async function PUT(request, {params}){
    const dataUpdate = await request.json();

    const compraUpdate = await prisma.compra.update({
        where: {
            id: Number(params.compraId)
        },
        data: dataUpdate
    });
    console.log(compraUpdate);
    return NextResponse.json(compraUpdate);
}

export async function DELETE( {params}){
    const deleteCompra = await prisma.compra.delete({
        where: {
            id: Number(params.compraId)
        }
    });

    return NextResponse.json(deleteCompra);
}