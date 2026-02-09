import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  try {
    console.log("Adding family system to database...");
    
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ADD COLUMN IF NOT EXISTS "email" TEXT,
        ADD COLUMN IF NOT EXISTS "familyId" TEXT,
        ADD COLUMN IF NOT EXISTS "tempPassword" TEXT,
        ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN DEFAULT false;
      `;
      console.log("User columns added");
    } catch (error) {
      console.log("User columns already exist or error:", error);
    }

    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "gender" TEXT;`;
      console.log("User.gender column added");
    } catch (error) {
      console.log("User.gender already exists or error:", error);
    }

    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "tempPasswordExpiresAt" TIMESTAMP(3);`;
      console.log("User.tempPasswordExpiresAt column added");
    } catch (error) {
      console.log("User.tempPasswordExpiresAt already exists or error:", error);
    }

    try {
      await prisma.$executeRaw`ALTER TABLE "User" ADD COLUMN IF NOT EXISTS "image" TEXT;`;
      console.log("User.image column added");
    } catch (error) {
      console.log("User.image already exists or error:", error);
    }

    try {
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`;
      console.log("Email unique index created");
    } catch (error) {
      console.log("Index already exists:", error);
    }

    try {
      await prisma.$executeRaw`
        CREATE TABLE IF NOT EXISTS "Family" (
          "id" TEXT NOT NULL,
          "name" TEXT NOT NULL,
          "inviteCode" TEXT NOT NULL,
          "adminId" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT "Family_pkey" PRIMARY KEY ("id")
        );
      `;
      console.log("Family table created");
    } catch (error) {
      console.log("Family table already exists:", error);
    }

    try {
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Family_inviteCode_key" ON "Family"("inviteCode");`;
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Family_adminId_key" ON "Family"("adminId");`;
      console.log("Family indexes created");
    } catch (error) {
      console.log("Indexes already exist:", error);
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ADD CONSTRAINT "User_familyId_fkey" 
        FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `;
      console.log("FK User -> Family added");
    } catch (error) {
      console.log("FK already exists:", error);
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE "Family" 
        ADD CONSTRAINT "Family_adminId_fkey" 
        FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      `;
      console.log("FK Family -> User added");
    } catch (error) {
      console.log("FK already exists:", error);
    }

    console.log("Family system added to database.");

    const userCount = await prisma.user.count();
    const familyCount = await prisma.family.count();

    return NextResponse.json({
      success: true,
      message: "Family system added successfully.",
      updates: {
        "User table": "Columns added: email, familyId, tempPassword, mustChangePassword, isEmailVerified",
        "Family table": "Created",
        "Indexes": "Unique indexes created",
        "Foreign keys": "Relations added"
      },
      counts: {
        users: userCount,
        families: familyCount
      },
      nextStep: "You can now create families via /api/register-family"
    });

  } catch (error) {
    console.error("Error adding family system:", error);
    return NextResponse.json({
      success: false,
      error: "Failed to add family system",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
} 