import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions: any = {  
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Имя", type: "text" },
        password: { label: "Пароль", type: "password" }
      },
      // @ts-ignore
      async authorize(credentials: any, req: any) {
        if (!credentials?.name || !credentials.password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: { name: credentials.name }
        });

        if (!user) {
          return null;
        }

        const isPasswordValid = await compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          role: user.role
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }: any) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      
      // Обновляем токен при обновлении сессии
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      
      return token;
    },
    async session({ session, token }: any) {
      (session as any).user.id = token.id;
      (session as any).user.role = token.role;
      (session as any).user.name = token.name;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
}; 