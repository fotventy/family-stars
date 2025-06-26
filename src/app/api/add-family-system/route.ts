import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("🏗️ Добавляем семейную систему поверх существующих данных...");

    // 1. Создаем таблицу Family
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

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Family_inviteCode_key" ON "Family"("inviteCode");
    `;

    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "Family_adminId_key" ON "Family"("adminId");
    `;

    // 2. Добавляем новые поля в User (опциональные для совместимости)
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD COLUMN IF NOT EXISTS "email" TEXT,
      ADD COLUMN IF NOT EXISTS "familyId" TEXT,
      ADD COLUMN IF NOT EXISTS "tempPassword" TEXT,
      ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN NOT NULL DEFAULT false,
      ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN NOT NULL DEFAULT false;
    `;

    // 3. Создаем уникальный индекс для email
    await prisma.$executeRaw`
      CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");
    `;

    // 4. Создаем внешние ключи
    await prisma.$executeRaw`
      ALTER TABLE "Family" 
      ADD CONSTRAINT IF NOT EXISTS "Family_adminId_fkey" 
      FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `;

    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD CONSTRAINT IF NOT EXISTS "User_familyId_fkey" 
      FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `;

    console.log("✅ Семейная система успешно добавлена!");

    return NextResponse.json({
      success: true,
      message: "Семейная система успешно добавлена поверх существующих данных"
    });

  } catch (error) {
    console.error("❌ Ошибка добавления семейной системы:", error);
    return NextResponse.json(
      { 
        error: "Ошибка добавления семейной системы",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 