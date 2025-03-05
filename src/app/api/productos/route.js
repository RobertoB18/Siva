import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(){
    const products = await prisma.products.findMany();
    console.log(products);
    return NextResponse.json(products);
}

export async function POST(request){
    const createProduct = await request.json();
    console.log(createProduct.name);
    const crear = await prisma.products.create({
        data: {
            "name": createProduct.name,
            "priceMen": createProduct.priceMen,
            "priceMay": createProduct.priceMay,
            "quantity": createProduct.quantity,
        }
    })
    console.log(crear);
    return NextResponse.json(crear);
}