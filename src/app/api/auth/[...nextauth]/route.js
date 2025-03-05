import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt"
import {prisma} from "@/libs/prisma"


const authOption = {
    providers:[
        CredentialsProvider({
            name: "Credentials",
            credentials:{
                email:{label:"Email", type:"text", placeholder:"Example1@gmail.com"},
                password:{label:"Password", type:"password", placeholder:"**********"}
            },
            async authorize(credentials, req){
                console.log(credentials + "Esto es el log")
                const userFound = await prisma.user.findUnique({
                    where:{
                        email: credentials.email,
                    }
                })

                if(!userFound) throw new Error("No user foud")

                const match = await bcrypt.compare(credentials.password, userFound.password);
                if(!match) throw new Error("Password whrow");

                return {
                    id: userFound.id,
                    email: userFound.email,
                    name: userFound.userName,
                }
            },
        }),
    ],
    pages: {
        signIn: "/auth/login",
      },

};

const handler = NextAuth(authOption);
export { handler as GET, handler as POST };