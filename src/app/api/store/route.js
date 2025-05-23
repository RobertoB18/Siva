import { NextResponse } from "next/server";
import {prisma} from "@/libs/prisma";

export async function GET(request, {params}){
  const { searchParams } = new URL(request.url);
  const idStore = searchParams.get("idStore");
    console.log("Este es el id user " + idStore);
  try {
      const searchStore = await prisma.storeUser.findMany({
            where: {
                storeId: Number(idStore)
            },
            include:{
                userRef: {
                select: {
                    id: true,
                    userName: true,
                    email: true,
                }                                                               
                }
            }
    });
      console.log("Tienda usuario: "+ searchStore);
      return NextResponse.json(searchStore);
  } catch (error) {
      console.log("Valio vrg scooby "+ error);
      return NextResponse.json([], { status: 403 });
  }
}
export async function POST(request, {params}){
    const newStore = await request.json();
    console.log(newStore);
    try {
        const crearStore = await prisma.storeUser.create({
            data: {
                userId: newStore.userId,
                storeId: newStore.storeId,
            }
        });
        console.log("Esta es la tienda "+ crearStore);
        return NextResponse.json(crearStore);
    } catch (error) {
        console.log("Valio vrg scooby "+ error);
        return NextResponse.json({ error: "Acceso denegado a esta tienda" }, { status: 403 });
    }
}