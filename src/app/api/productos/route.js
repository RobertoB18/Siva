import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";


export async function GET(request, {params}){
    const { searchParams } = new URL(request.url);
  const idStore = searchParams.get("idStore");
    
    const products = await prisma.products.findMany({
        where:{
          storeId: Number(idStore)
        }
      }
    );
    return NextResponse.json(products);
}

export async function POST(request){
    const createProduct = await request.json();
    console.log(createProduct.name);
    const crear = await prisma.products.create({
        data: {
            "storeId": createProduct.storeId, //Cambio
            "name": createProduct.name,
            "priceCost": createProduct.priceCost,
            "priceMen": createProduct.priceMen,
            "stock": createProduct.stock,
            "priceMay": createProduct.priceMay,
            "mayCost": createProduct.mayCost,
        }
    })
    console.log(crear);
    return NextResponse.json(crear);
}