import { NextResponse } from 'next/server';
import {prisma} from "@/libs/prisma";

export async function GET(request, {params}){
    try {
        const searchClient = await prisma.clientes.findUnique({
            where: {
                id: Number(params.id)
            }
        });
        //console.log(searchProduct);
        return NextResponse.json(searchClient);
    } catch (error) {
        //console.log("Valio vrg scooby "+ error);
        return NextResponse.json([], {status:500}); 
    }
    
}

export async function PUT(request, {params}){
    const dataUpdate = await request.json();
    console.log(dataUpdate);

    try {
        const clientUpdate = await prisma.clientes.update({
            where: {
                id: Number(params.id)
            },
            data: dataUpdate
        });
        console.log(clientUpdate);
        return NextResponse.json(clientUpdate);
        
    } catch (error) {
        console.log("Error al actualizar el proveedor", error);
        return NextResponse.json({error: "Error al actualizar el proveedor"}, {status:500});
    }

}
