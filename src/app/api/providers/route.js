import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    try {
      const providers = await prisma.provider.findMany({
          where:{
            storeId: Number(idStore),
            status: true
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