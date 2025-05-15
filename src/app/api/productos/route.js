import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";
  
export async function GET(request, {params}){
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    
    const products = await prisma.products.findMany({
        where:{
          storeId: Number(idStore)
        },
        orderBy: [
          { status: 'desc' },
          { name: 'asc' } 
        ]
      }
    );
    return NextResponse.json(products);
}

export async function POST(request){
    const createProduct = await request.json();
    console.log(createProduct);
    try {
      const existe = await prisma.products.findFirst({
        where: {
          name: createProduct.name,
          storeId: createProduct.storeId
        }
      });
      if (existe) throw new Error("El producto ya existe en la tienda");
      
      const crear = await prisma.products.create({
        data: {
            "storeId": createProduct.storeId, 
            "name": createProduct.name,
            "priceCost": createProduct.priceCost,
            "priceMen": createProduct.priceMen,
            "stockMin": createProduct.stockMin,
            "stock": createProduct.stock,
            "unity": createProduct.unity,
            "unityCode": createProduct.unityCode,
            "description": createProduct.description,
            "status": createProduct.status,
            "codesat": createProduct.codesat,
            "codeBar": createProduct.codeBar,
            "priceMay": createProduct.priceMay,
            "mayQuantity": createProduct.mayQuantity,
        }
    })
    console.log(crear);
    return NextResponse.json(crear);
    } catch (error) {
      console.log(error)
      return NextResponse.json({error: "Error al crear el producto"}, {status:500});
    }
    
}