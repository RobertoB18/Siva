import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import encryptOption from "@/app/Hooks/encryptOption.js"
import {prisma} from "@/libs/prisma"

const [encryptPassword,decryptPassword] = encryptOption();

export const authOptions = {
    providers:[
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            authorization: {
                params: { prompt: "consent", access_type: "offline", response_type: "code" }
            }
        }),
        CredentialsProvider({
            name: "Credentials",
            credentials:{
                email:{label:"Email", type:"text", placeholder:"Example1@gmail.com"},
                password:{label:"Password", type:"password", placeholder:"**********"}
            },
            async authorize(credentials, req) {
                try {
                    const userFound = await prisma.user.findUnique({
                    where: {
                        email: credentials.email,
                    },
                    });

                    if (!userFound) throw new Error("Usuario no encontrado");

                    if (!userFound.password) throw new Error("Contraseña incorrecta o inicio de sesión con Google");

                    const match = await decryptPassword(userFound.password);  // PUEDE FALLAR AQUÍ
                    console.log(match);
                    if (credentials.password !== match) throw new Error("Contraseña incorrecta o inicio de sesión con Google");

                    return {
                    id: userFound.id,
                    email: userFound.email,
                    name: userFound.userName,
                    };
                } catch (error) {
                    console.error("Error en authorize():", error); // Asegúrate que se vea en logs
                    throw new Error("Error de autenticación");
                }
            },
        }),
    ],
    callbacks: {
        async signIn({ user, account }) {
            console.log(account.provider);
            if (account.provider === "google") { // Solo actúa si el usuario inicia con Google
                console.log(user.name)
                try {
                    const existingUser = await prisma.user.findUnique({
                        where:{
                            email: user.email,
                        }
                        
                    })
                    if(!existingUser){
                        const userCreate = await prisma.user.create({
                            data:{
                                email: user.email,
                                userName: user.name,    
                            }
                        })   
                        console.log(userCreate);
                    }
                    return true
                } catch (error) {
                    console.log("No se hizo el registro")
                    return false
                }
            }
            return true;
        },
        async session({ session, user }) {
            const dbUser = await prisma.user.findUnique({
                where: { email: session.user.email },
            });
        
            if (dbUser) {
                session.user.id = dbUser.id;
                session.user.name = dbUser.userName;
            }

            return session; // Enviar la sesión modificada al frontend
        }
    },
    pages: {
        signIn: "/auth/login",
    },
    secret: process.env.NEXTAUTH_SECRET,

};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };