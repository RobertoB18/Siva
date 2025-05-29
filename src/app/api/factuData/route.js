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
  try {
    
  } catch (error) {
    console.log("Error: "+error);
    return NextResponse({error: error.message}, {status: 500});
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
