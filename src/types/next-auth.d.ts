import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name: string
      role: "PARENT" | "CHILD" | "FAMILY_ADMIN"
    }
  }

  interface User {
    id: string
    name: string
    role: "PARENT" | "CHILD" | "FAMILY_ADMIN"
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: "PARENT" | "CHILD" | "FAMILY_ADMIN"
  }
} 