import { prisma } from "@/libs/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt"

export async function POST(request){
    try {
        const data = await request.json();
        const searchUser = await prisma.user.findUnique({
            where:{
                email: data.email,
            }
        })
        
        if(searchUser){
            return NextResponse.json({message:"Email already exist"}, {status:400})
        }
    
        const passwordHash = await bcrypt.hash(data.password, 10);
        const newUser = await prisma.user.create({
            data: {
                "userName": data.userName,
                "email": data.email,
                "password": passwordHash,
            }
        })
        const {password: _, ...user} = newUser
        return NextResponse.json(user);
    } catch (error) {
        return NextResponse.json({message: error.message}, {status:500})
    }
}