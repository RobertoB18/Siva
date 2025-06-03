
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import {prisma} from "@/libs/prisma";
import Facturapi from "facturapi";

export async function GET(request, {params}){
    try {
        const searchSale = await prisma.facturas.findUnique({
            where: {
                id: Number(params.id)
            },
            include: {
            clientes: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                rfc: true
              }
            }
          },
        });
        //console.log(searchSale);
        return NextResponse.json(searchSale);
    } catch (error) {
        console.log(error);
        return NextResponse.json([], {status:500});
    }
}

export async function POST(request, { params }) {
  const facturaData = await request.json();
  console.log(facturaData);
  console.log("ID "+params.id);
  try {
    const storeData = await prisma.store.findUnique({
      where:{
        id: facturaData.storeId
      }
    })
    console.log(storeData.key);
    const facturapi = new Facturapi(storeData.key);

    const zipStream = await facturapi.invoices.downloadZip(facturaData.idFactura);
    console.log(zipStream)
    const chunks = [];
    for await (const chunk of zipStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    return new Response(buffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="factura-${idFactura}.zip"`,
      },
    });

  } catch (error) {
    console.error("Error en descarga:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(request, {params}){
    const facturaData = await request.json();
    console.log(facturaData);
    console.log("ID "+params.id);
    try {
      const storeData = await prisma.store.findUnique({
        where:{
          id: facturaData.storeId
        }
      })

      console.log(storeData.key);
      const apiKey = new Facturapi(storeData.key);
      await apiKey.invoices.sendByEmail(facturaData.idFactura,
        {email: facturaData.email}
      )
      
      return NextResponse.json({status: 200});
    } catch (error) {
      console.log("El error: "+error)
      return NextResponse.json({error: error}, {status:500})
    }
}