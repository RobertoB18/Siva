import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server"; 

export async function GET(request, {params}){
  const { searchParams } = new URL(request.url);
  const idStore = searchParams.get("idStore");
  const userId = searchParams.get("idUser");
  console.log("Este es el id user " + userId);
  console.log("Este es el id store " + idStore);
  
    try {
        const userPermisos = await prisma.storeUser.findUnique({
            where: {
                userId_storeId: {
                    storeId: Number(idStore),
                    userId: Number(userId)
                }
            },
            select: {
                permissions: true,
            }
        });
        if (!userPermisos) {
            return NextResponse.json({ error: "Usuario no encontrado o sin permisos" }, { status: 404 });
        }

        console.log("Permisos del usuario: " + userPermisos);
        return NextResponse.json(userPermisos, { status: 200 });
    } catch (error) {
        console.log("Error al obtener permisos del usuario: " + error);
        return NextResponse.json([], { error: "Acceso denegado a este usuario" }, { status: 403 });
    }

}