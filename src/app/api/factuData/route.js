export const config = {
  runtime: 'nodejs',
};

import { PassThrough } from "stream";
import Facturapi from "facturapi";
import { NextResponse } from "next/server";
import { prisma } from "@/libs/prisma";

const facturapi = new Facturapi(process.env.SECRET_KEY_FACTUAPI);

// Función auxiliar para convertir Buffer a Stream
function bufferToStream(buffer) {
  const stream = new PassThrough();
  stream.end(buffer);
  return stream;
}

export async function POST(request, {params}){
  const venta = await request.json();
  const {clientes, productos} = venta;
  console.log(productos);

  try {
    const storeData = await prisma.store.findUnique({
      where:{
        id: Number(venta.storeId)
      } 
    })
    console.log(storeData.key);
    const apiKey = new Facturapi(storeData.key);

    const factura = await apiKey.invoices.create({
      customer:{
        legal_name: clientes.razonSocial,
        email:clientes.email,
        tax_id: clientes.rfc,
        tax_system: clientes.regimenFiscal,
        address:{
          zip:clientes.address,
        }
      },
      items: productos.map(p => ({
        
        quantity: p.quantity,
        product: {
          description: p.name,
          product_key: p.product_key, // Asignar clave SAT válida
          price: p.price
        }
      })),
      payment_form: venta.payment_form,
      folio_number: venta.id,
      series: 'F'
    })

    await prisma.facturas.create({
      data:{
        storeId: venta.storeId,
        idFactura: factura.id,
        clienteId: clientes.id
      }
    })

    await prisma.sale.update({
      where:{
        id: venta.id
      },
      data:{
        status: true
      }
    })

    const zipStream = await apiKey.invoices.downloadZip(factura.id);

    // Convertimos el stream a buffer
    const chunks = [];
    for await (const chunk of zipStream) {
      chunks.push(chunk);
    }
    const zipBuffer = Buffer.concat(chunks);

    // Respondemos con headers para forzar descarga
    return new NextResponse(zipBuffer, {
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename=factura_${facturaId}.zip`,
      },
    });

    
    return NextResponse.json({ message: 'Factura generada correctamente', factura });
  } catch (error) {
    console.log("Error: "+ error);
    return NextResponse.json({ message: 'Factura generada correctamente', factura });
  }

}  

export async function PUT(request) {
  try {
    const formData = await request.formData();
    console.log(formData);

    const id = formData.get("id");
    const name = formData.get("name");
    const razonSocial = formData.get("legal_name");
    const cp = formData.get("zip");
    const email = formData.get("email");
    const regimenFiscal = formData.get("tax_system");
    const csdPassword = formData.get("csd_password");
    const organizationId = formData.get("idApi");

    const cerFile = formData.get("cer");
    const keyFile = formData.get("key");

    const cerBuffer = Buffer.from(await cerFile.arrayBuffer());
    const keyBuffer = Buffer.from(await keyFile.arrayBuffer());

    const cerStream = bufferToStream(cerBuffer);
    const keyStream = bufferToStream(keyBuffer);

    const certUpload = await facturapi.organizations.uploadCertificate(
      organizationId,
      cerStream,
      keyStream,
      csdPassword
    );
    
    // Actualiza los datos fiscales
    const data = await facturapi.organizations.updateLegal(organizationId, {
      name: name,
      legal_name: razonSocial,
      support_email: email,
      tax_system: regimenFiscal,
      address: { zip: cp },
    });

    const keyStore = await facturapi.organizations.getTestApiKey(
      organizationId
    );

    const updateStore = await prisma.store.update({
      where: {
        id:Number(id)
      },
      data:{
        razonSocial: razonSocial,
        regimenFiscal: regimenFiscal,
        email: email, 
        address: cp,
        key: keyStore,
      }
    })

    return NextResponse.json({
      message: "Organización actualizada correctamente",
      data,
      certUpload,
    });

  } catch (error) {
    console.error("Error al procesar los datos:", error);
    return NextResponse.json({ error: error.message}, { status: 500 });
  }
}
