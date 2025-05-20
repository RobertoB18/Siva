import {prisma} from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET(request, {params}){
    const { searchParams } = new URL(request.url);
    const idStore = searchParams.get("idStore");
    const casse = searchParams.get("casse");
    try {
      if (casse === "1") {
        const cliente = await prisma.clientes.findMany({
          where:{
            storeId: Number(idStore),
          },
          orderBy: [
            { status: 'desc' },
            { name: 'asc' }
          ]
        });
        return NextResponse.json(cliente);
      }
      const cliente = await prisma.clientes.findMany({
          where:{
            storeId: Number(idStore),
          },
          orderBy: [
            { name: 'asc' } 
          ]
        }
      );
      const clientsAvailable = cliente.filter(cliente => cliente.status === true);
      return NextResponse.json(clientsAvailable);

    } catch (error) {
      console.log(error);
      return NextResponse.json([], {status:500});
      
    } 
}

export async function POST(request){
  const createClient = await request.json();
  console.log(createClient);
  try {
    const existe = await prisma.clientes.findFirst({
      where: {
        name: createClient.name,
        storeId: createClient.storeId
      }
    });

    //console.log("existe", existe);
    if (existe) throw new Error("El cliente ya esta registrado");
    const crear = await prisma.clientes.create({
      data: {
        "storeId": createClient.storeId, 
        "name": createClient.name,
        "rfc": createClient.rfc,
        "razonSocial": createClient.razonSocial,
        "regimenFiscal": createClient.regimenFiscal,
        "phone": createClient.phone,
        "email": createClient.email,
        "address": createClient.address,
        "status": createClient.status, 
      }
    })
    return NextResponse.json(crear);
  } catch (error) {
    console.log("Error al crear el proveedor", error);
    return NextResponse.json({error: "Error al crear el proveedor"}, {status:500});
    
  }
}
