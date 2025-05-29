import { NextResponse } from "next/server";
import {prisma} from "@/libs/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request, {params}){
  
  const session = await getServerSession(authOptions);
  const {store} = params;
  console.log("Este es el id user " + session.user.id);
  console.log("Este es el ide de la tienda "+store);
  try {
      const searchStore = await prisma.store.findUnique({
          where: {
              id: Number(store),
              user: {
                some: {
                  userId: session.user.id,
                }
              }
            }
      });
      console.log(searchStore);
      return NextResponse.json(searchStore);
  } catch (error) {
      console.log("Valio vrg scooby "+ error);
      return NextResponse.json([], { status: 403 });
  }
}

export async function PUT(request, {params}){
  const dataUpdate = await request.json();
  const {store} = params;
  console.log(dataUpdate)
  console.log("Este es el ide de la tienda "+store);
  try {
      const searchStore = await prisma.store.update({
          where: {
              id: Number(store),
          },
          data:{
              ...(dataUpdate.name && { name: dataUpdate.name }),
              ...(dataUpdate.email && { email: dataUpdate.email }),
              ...(dataUpdate.phone && { phone: dataUpdate.phone }),
              ...(dataUpdate.address && { address: dataUpdate.address }),
              ...(dataUpdate.logo && { logo: dataUpdate.logo }),
              ...(dataUpdate.descuento && { descuento: dataUpdate.descuento }),
          } 
      });
      console.log("Esta es la tienda "+ searchStore);
      return NextResponse.json(searchStore);
  } catch (error) {
      console.log("Valio vrg scooby "+ error);
      return NextResponse.json({ error: "Acceso denegado a esta tienda" }, { status: 403 });
  }
}