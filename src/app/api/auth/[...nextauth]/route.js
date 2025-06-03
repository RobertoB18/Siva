import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import encryptOption from "@/app/Hooks/encryptOption.js"
import { prisma } from "@/libs/prisma";

const [encryptPassword, decryptPassword] = encryptOption();

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: { prompt: "consent", access_type: "offline", response_type: "code" }
      }
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text", placeholder: "Example1@gmail.com" },
        password: { label: "Password", type: "password", placeholder: "**********" }
      },
      async authorize(credentials) {
        const userFound = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!userFound) throw new Error("Usuario no encontrado");

        const now = new Date();

        if (userFound.blockedUntil && userFound.blockedUntil > now) {
          throw new Error("Demasiados intentos. Intenta de nuevo en 5 minutos.");
        }

        if (!userFound.password) {
          throw new Error("Contraseña incorrecta o inicio de sesión con Google");
        }

        const match = await decryptPassword(userFound.password);

        if (credentials.password !== match) {
          const attempts = userFound.loginAttempts + 1;
          const updateData = {
            loginAttempts: attempts,
          };

          // Si ya falló 5 veces, bloqueamos por 5 minutos
          if (attempts >= 5) {
            updateData.blockedUntil = new Date(now.getTime() + 5 * 60000); // +5 minutos
            updateData.loginAttempts = 0; // Reiniciamos para después del bloqueo
          }

          await prisma.user.update({
            where: { email: credentials.email },
            data: updateData,
          });

          throw new Error("Contraseña incorrecta o inicio de sesión con Google");
        }

        // ✅ Éxito: restablecer intentos y bloqueo
        await prisma.user.update({
          where: { email: credentials.email },
          data: {
            loginAttempts: 0,
            blockedUntil: null,
          },
        });

        return {
          id: userFound.id,
          email: userFound.email,
          name: userFound.userName,
        };
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account.provider === "google") {
        try {
          const existingUser = await prisma.user.findUnique({
            where: { email: user.email },
          });

          if (!existingUser) {
            await prisma.user.create({
              data: {
                email: user.email,
                userName: user.name,
              },
            });
          }

          return true;
        } catch (error) {
          console.log("No se hizo el registro");
          return false;
        }
      }
      return true;
    },
    async session({ session }) {
      const dbUser = await prisma.user.findUnique({
        where: { email: session.user.email },
      });

      if (dbUser) {
        session.user.id = dbUser.id;
        session.user.name = dbUser.userName;
      }

      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
