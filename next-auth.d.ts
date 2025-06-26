import "next-auth";
import "next-auth/jwt";
import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: "PARENT" | "CHILD" | "FAMILY_ADMIN";
    };
  }

  interface User {
    id: string;
    role: "PARENT" | "CHILD" | "FAMILY_ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    role: "PARENT" | "CHILD" | "FAMILY_ADMIN";
  }
} 