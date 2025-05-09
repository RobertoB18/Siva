import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    try {
      const cliente = await prisma.clientes.findMany({
          where:{
            storeId: Number(idStore)
          },
          orderBy: [
            { name: 'asc' } 
          ]
        }
      );
      return NextResponse.json(cliente);

    } catch (error) {
      console.log(error);
      return NextResponse.json({error: "Error al obtener los clientes"});
      
    }
    
}