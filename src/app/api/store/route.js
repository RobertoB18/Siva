import { NextResponse } from "next/server";
import {prisma} from "@/libs/prisma";

export async function GET(request, {params}){
  const { searchParams } = new URL(request.url);
  const idStore = searchParams.get("idStore");
  console.log("Este es el id user " + idStore);
  
  try {
      const searchStore = await prisma.storeUser.findMany({
            where: {
                storeId: Number(idStore),
                NOT: {
                    permissions: {
                        has: "Administrador"
                    }
                }
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
    const newUserStore = await request.json();
    console.log(newUserStore);

    try {
        const searchUser = await prisma.user.findUnique({
            where: {
                email: newUserStore.user
            }
        });

        const crearStore = await prisma.storeUser.create({
            data: {
                userId: searchUser.id,
                storeId: Number(newUserStore.storeId),
                permissions: ["Empleado"],
            }
        });
        console.log("Esta es la tienda "+ crearStore);
        return NextResponse.json(crearStore);
    } catch (error) {
        console.log("Valio vrg scooby "+ error);
        return NextResponse.json({ error: "Acceso denegado a esta tienda" }, { status: 403 });
    }
}

export async function PUT(request, {params}) {
    const updateUserStore = await request.json();
    console.log(updateUserStore);
    try {
        const updateStore = await prisma.storeUser.update({
            where: {
                userId_storeId: {
                    storeId: Number(updateUserStore.storeId),
                    userId: Number(updateUserStore.userId)
                }
            },
            data:{
                permissions: updateUserStore.permissions
            }
        });
        console.log("Esta es la tienda "+ updateStore);
        return NextResponse.json(updateStore);
    } catch (error) {
        console.log("Valio vrg scooby "+ error);
        return NextResponse.json({ error: "Acceso denegado a esta tienda" }, { status: 403 });
        
    }
}

export async function DELETE(request, {params}){
    const deleteUser = await request.json();
    console.log(deleteUser);
  
  try {
      const eliminarStore = await prisma.storeUser.delete({
            where: {
                userId_storeId: {
                    storeId: Number(deleteUser.storeId),
                    userId: Number(deleteUser.userId)
                }
            }
    });
      console.log("Tienda usuario eliminada: "+ eliminarStore);
      return NextResponse.json(eliminarStore);
  } catch (error) {
      console.log("Valio vrg scooby "+ error);
      return NextResponse.json({ error: "Acceso denegado a esta tienda" }, { status: 403 });
  }
}