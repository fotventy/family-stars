import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaClient } from "@prisma/client";
import { compare } from "bcryptjs";

const prisma = new PrismaClient();

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        name: { label: "Имя", type: "text" },
        password: { label: "Пароль", type: "password" }
      },
      async authorize(credentials) {
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
    async jwt({ token, user, trigger, session }) {
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
    async session({ session, token }) {
      session.user.id = token.id;
      session.user.role = token.role;
      session.user.name = token.name;
      return session;
    }
  },
  pages: {
    signIn: "/login"
  }
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST }; 