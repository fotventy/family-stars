import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AppleProvider from "next-auth/providers/apple";
import { compare } from "bcryptjs";
import { prisma } from "@/lib/prisma";

const googleEnabled =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET;
const appleEnabled =
  process.env.APPLE_ID && process.env.APPLE_SECRET;

const providers: NextAuthOptions["providers"] = [
  CredentialsProvider({
    name: "Credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      name: { label: "Name", type: "text" },
      password: { label: "Password", type: "password" },
      familyCode: { label: "Family code", type: "text" },
    },
    async authorize(credentials) {
      if (!credentials?.password) return null;
      let user = null;
      // Login by email + password (primary)
      if (credentials.email?.trim()) {
        user = await prisma.user.findUnique({
          where: { email: (credentials.email as string).trim().toLowerCase() },
        });
      }
      // Fallback: login by family code + name + password
      if (!user && credentials?.name?.trim()) {
        if (credentials.familyCode?.trim()) {
          const family = await prisma.family.findUnique({
            where: { inviteCode: (credentials.familyCode as string).trim().toUpperCase() },
          });
          if (family) {
            user = await prisma.user.findFirst({
              where: { name: credentials.name, familyId: family.id },
            });
          }
        }
        if (!user) {
          user = await prisma.user.findFirst({
            where: { name: credentials.name },
          });
        }
      }
      if (!user) return null;
      const valid = await compare(credentials.password, user.password);
      if (!valid) return null;
      return {
        id: user.id,
        name: user.name,
        role: user.role as "PARENT" | "CHILD" | "FAMILY_ADMIN",
        email: user.email ?? undefined,
        familyId: user.familyId ?? undefined,
        image: user.image ?? undefined,
        gender: user.gender ?? undefined,
      };
    },
  }),
  ...(googleEnabled
    ? [
        GoogleProvider({
          clientId: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          authorization: {
            params: {
              prompt: "consent",
              scope: "openid email profile",
            },
          },
        }),
      ]
    : []),
  ...(appleEnabled
    ? [
        AppleProvider({
          clientId: process.env.APPLE_ID!,
          clientSecret: process.env.APPLE_SECRET!,
        }),
      ]
    : []),
];

export const authOptions: NextAuthOptions = {
  providers,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === "google" || account?.provider === "apple") {
        const email = (profile as { email?: string })?.email ?? user.email;
        if (!email) return false;
        const existing = await prisma.user.findUnique({
          where: { email },
        });
        if (!existing) return false;
        return true;
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (user && "id" in user) {
        const u = user as { id: string; role: string; familyId?: string; email?: string; name?: string; gender?: string };
        token.id = u.id;
        token.role = u.role as "PARENT" | "CHILD" | "FAMILY_ADMIN";
        token.familyId = u.familyId;
        token.email = u.email ?? token.email;
        token.name = u.name ?? token.name;
        token.gender = u.gender;
      }
      if (
        (account?.provider === "google" || account?.provider === "apple") &&
        user?.email &&
        !token.id
      ) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        });
        if (dbUser) {
          token.id = dbUser.id;
          token.role = dbUser.role as "PARENT" | "CHILD" | "FAMILY_ADMIN";
          token.familyId = dbUser.familyId ?? undefined;
          token.name = dbUser.name;
          token.gender = dbUser.gender ?? undefined;
        }
      }
      if (trigger === "update" && session?.name) {
        token.name = session.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
        (session.user as any).name = token.name ?? session.user.name;
        (session.user as any).familyId = token.familyId;
        (session.user as any).email = token.email ?? session.user.email;
        (session.user as any).gender = token.gender;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
};
