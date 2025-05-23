import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";
  
export async function GET(request, {params}){
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    const codeBar = searchParams.get("codeBar");

    try {
        if(codeBar){
          const product = await prisma.products.findFirst({
            where: {
              codeBar: codeBar,
              storeId: Number(idStore),
              status: true
            },
            select: {
              id: true,
              name: true,
              description: true,
              priceMen: true,
              priceMay: true,
              mayQuantity: true,
              codesat: true,
              unity: true,
              unityCode: true,
              stockMin: true,
              stock: true,
            }
          });
          if(!product) return NextResponse.json({error: "No se encontro el producto"}, {status:404});
          return NextResponse.json(product);
        }
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
    } catch (error) {
        console.log("Error al obtener el id de la tienda", error);
        return NextResponse.json([], {status:500});
      
    }

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
      //console.log(crear);
      return NextResponse.json(crear);
    } catch (error) {
      console.log(error)
      return NextResponse.json({error: "Error al crear el producto"}, {status:500});
    }
    
}