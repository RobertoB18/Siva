import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const idStore = searchParams.get("idStore");
    const casse = searchParams.get("casse");
    console.log("query", query);
    console.log("idStore", idStore);
    console.log("casse", casse);
    try {
        if (casse === "1") {
            const products = await prisma.products.findMany({
                where: {
                    storeId: Number(idStore),
                    name:{
                        contains: query,
                        mode: 'insensitive' // Opcional: para que no distinga mayúsculas y minúsculas
                    }
                },           
            });
            
            return NextResponse.json(products);
        }

        const products = await prisma.products.findMany({
            where: {
                storeId: Number(idStore),
                name:{
                    contains: query,
                    mode: 'insensitive' // Opcional: para que no distinga mayúsculas y minúsculas
                },
            },           
        });
        
        const productsAvailable = products.filter(producto => producto.stock > producto.stockMin && producto.status === true);
        
        return NextResponse.json(productsAvailable);
    } catch (error) {
        console.log("Error en la respuesta de la API:", error.message);
        return NextResponse.json([], {status: 500});
    }
}
