import { NextResponse } from 'next/server';
import {prisma} from "@/libs/prisma";

export async function GET(request, {params}){
    try {
        const searchProduct = await prisma.provider.findUnique({
            where: {
                id: Number(params.id)
            }
        });
        //console.log(searchProduct);
        return NextResponse.json(searchProduct);
    } catch (error) {
        console.log("Valio vrg scooby "+ error);
        return NextResponse([], {status:500});
    }
    
}

export async function PUT(request, {params}){
    const dataUpdate = await request.json();
    console.log(dataUpdate);
    try {
        const providerUpdate = await prisma.provider.update({
            where: {
                id: Number(params.id)
            },
            data: dataUpdate
        });
        console.log(providerUpdate);
        return NextResponse.json(providerUpdate);
        
    } catch (error) {
        console.log("Error al actualizar el proveedor", error);
        return NextResponse.json({error: "Error al actualizar el proveedor"}, {status:500});
    }

}
