import { NextResponse } from "next/server";
import {prisma} from "@/libs/prisma";

export async function GET(request, {params}){
    const {store} = params;
    console.log("Este es el ide de la tienda "+store);
    try {
        const searchStore = await prisma.store.findUnique({
            where: {
                id: Number(store)
            }
        });
        //console.log("Hola"+searchStore);
        return NextResponse.json(searchStore);
    } catch (error) {
        console.log("Valio vrg scooby "+ error);
    }
    
}