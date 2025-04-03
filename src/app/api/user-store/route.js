import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    console.log("Usuario no autenticado");  
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  console.log("Usuario autenticado:", session.user);
  
  try {

    // Buscar al usuario y traer las tiendas a las que pertenece
    const userStores = await prisma.user.findUnique({
      where: { email: session.user.email }, // Buscar usuario por su email
      include:{
        store: {
          select: {
            storeRef: {
              select: {
                id: true,
                name: true,
              }                                                               
            }
          }
        }
      }
    });
    //console.log(userStores);

    if (!userStores) {
      return NextResponse.json({ error: "Usuario no encontrado" }, { status: 404 });
    }

    // Extraer solo las tiendas
    const stores = userStores.store.map((storeUser) => storeUser.storeRef);

    console.log("Tiendas del usuario:", stores);
    return NextResponse.json(stores);

  } catch (error) {
    console.error("Error al obtener tiendas del usuario:", error);
    return NextResponse.json({ error: "Error interno del servidor" }, { status: 500 });
  }
}


export async function POST(request, {params}){
  const newStore = await request.json();
  console.log(newStore);
  const session = await getServerSession(authOptions);
  console.log("Este es el ide de la tienda "+ session.user.email);
  try {
      const crearStore = await prisma.store.create({
          data: {
              "name": newStore.name,
              "email": newStore.email,
              "phone": newStore.phone,
              "address": newStore.address,
          }
      })
      console.log(crearStore);
      const storeRef = await prisma.StoreUser.create({
          data:{
              "storeId": crearStore.id,
              "userId": session.user.id,
          }
      })
      console.log(storeRef);
      return NextResponse.json(crearStore);
  } catch (error) {
      console.log("Error al crear la tienda "+ error);
  }
  
}