import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import encryptOptions from "@/app/Hooks/encryptOption.js";

export async function POST(request){
    try {
        const [encryptPassword, decryptPassword] = encryptOptions();

        const data = await request.json();
        const searchUser = await prisma.user.findUnique({
            where:{
                email: data.email,
            }
        })
        
        if(searchUser){
            return NextResponse.json({message:"Correo ya registrado"}, {status:400})
        }
    
        const passwordEncrypt = await encryptPassword(data.password);
        console.log("Hola");
        console.log("Password Hash: ", passwordEncrypt);
        console.log("Password Decrypted: ", decryptPassword(passwordEncrypt));
        const newUser = await prisma.user.create({
            data: {
                "userName": data.userName,
                "email": data.email,
                "password": passwordEncrypt,
            }
        })
        const {password: _, ...user} = newUser
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({message: error.message}, {status:500})
    }
}