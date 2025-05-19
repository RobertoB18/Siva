import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    try {
      const providers = await prisma.provider.findMany({
          where:{
            storeId: Number(idStore), 
          },
          orderBy: [
            { name: 'asc' } 
          ]
        }
      );
      return NextResponse.json(providers);

    } catch (error) {
      console.log(error);
      return NextResponse.json({error: "Error al obtener los proveedores"});
    }   
}
export async function POST(request){
  const createProvider = await request.json();
  console.log(createProvider);
  try {
    const existe = await prisma.provider.findFirst({
      where: {
        name: createProvider.name,
        storeId: createProvider.storeId
      }
    });

    console.log("existe", existe);
    if (existe) throw new Error("El proveedor ya esta registrado");
    const crear = await prisma.provider.create({
      data: {
        "storeId": createProvider.storeId, 
        "name": createProvider.name,
        "phone": createProvider.phone,
        "email": createProvider.email,
        "address": createProvider.address,
        "status": createProvider.status,
        "rfc": createProvider.rfc,
        "codeProvider": createProvider.codeProvider,
      }
    })
    return NextResponse.json(crear);
  } catch (error) {
    console.log("Error al crear el proveedor", error);
    return NextResponse.json({error: "Error al crear el proveedor"}, {status:500});
    
  }
}
