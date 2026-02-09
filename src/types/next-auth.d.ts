import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string | null
      email?: string | null
      image?: string | null
      role: "PARENT" | "CHILD" | "FAMILY_ADMIN"
      familyId?: string | null
    }
  }

  interface User {
    id: string
    name: string
    role: "PARENT" | "CHILD" | "FAMILY_ADMIN"
    email?: string
    familyId?: string
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "PARENT" | "CHILD" | "FAMILY_ADMIN"
    familyId?: string | null
    email?: string | null
  }
} 