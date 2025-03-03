import { NextResponse } from "next/server";
import {prisma} from "@/libs/prisma";

export async function GET(){
    const compras = await prisma.compra.findMany();
    console.log(compras);
    return NextResponse.json(compras);
}
export async function POST(request){
    try{
        const update = await request.json();
        const newbuy = await prisma.compra.create({
            data:{
                "name": update.name,
                "price": update.price,
                "quantity":update.quantity,
                "total": update.total,
            }
        });
        console.log("Ya casi");
        return NextResponse.json({newbuy});
    }catch(e){
        console.log(`Error ${e} al intentar hacer el producto`)
    }
}