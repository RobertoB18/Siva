import { NextResponse } from 'next/server';
import {prisma} from "@/libs/prisma";

export async function GET(request, {params}){
    try {
        const searchProduct = await prisma.products.findUnique({
            where: {
                id: Number(params.id)
            }
        });
        console.log(searchProduct);
        return NextResponse.json(searchProduct);
    } catch (error) {
        console.log("Valio vrg scooby "+ error);
    }
    
}

export async function PUT(request, {params}){
    const dataUpdate = await request.json();

    const productUpdate = await prisma.products.update({
        where: {
            id: Number(params.id)
        },
        data: dataUpdate
    });
    console.log(productUpdate);
    return NextResponse.json(productUpdate);
}

export async function DELETE(request, {params}){
    const deleteProduct = await prisma.products.delete({
        where: {
            id: Number(params.id)
        }
    });

    return NextResponse.json(deleteProduct);
}