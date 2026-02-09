import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  try {
    console.log("🔧 Добавляем семейную систему в базу данных...");
    
    // Добавляем недостающие колонки в таблицу User
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ADD COLUMN IF NOT EXISTS "email" TEXT,
        ADD COLUMN IF NOT EXISTS "familyId" TEXT,
        ADD COLUMN IF NOT EXISTS "tempPassword" TEXT,
        ADD COLUMN IF NOT EXISTS "mustChangePassword" BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS "isEmailVerified" BOOLEAN DEFAULT false;
      `;
      console.log("✅ Добавлены новые колонки в таблицу User");
    } catch (error) {
      console.log("⚠️ Колонки уже существуют или ошибка:", error);
    }

    // Создаем уникальный индекс для email
    try {
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email");`;
      console.log("✅ Создан уникальный индекс для email");
    } catch (error) {
      console.log("⚠️ Индекс уже существует:", error);
    }

    // Создаем таблицу Family
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
      console.log("✅ Создана таблица Family");
    } catch (error) {
      console.log("⚠️ Таблица Family уже существует:", error);
    }

    // Создаем индексы для Family
    try {
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Family_inviteCode_key" ON "Family"("inviteCode");`;
      await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "Family_adminId_key" ON "Family"("adminId");`;
      console.log("✅ Созданы индексы для таблицы Family");
    } catch (error) {
      console.log("⚠️ Индексы уже существуют:", error);
    }

    // Добавляем внешние ключи
    try {
      await prisma.$executeRaw`
        ALTER TABLE "User" 
        ADD CONSTRAINT "User_familyId_fkey" 
        FOREIGN KEY ("familyId") REFERENCES "Family"("id") ON DELETE SET NULL ON UPDATE CASCADE;
      `;
      console.log("✅ Добавлен внешний ключ User -> Family");
    } catch (error) {
      console.log("⚠️ Внешний ключ уже существует:", error);
    }

    try {
      await prisma.$executeRaw`
        ALTER TABLE "Family" 
        ADD CONSTRAINT "Family_adminId_fkey" 
        FOREIGN KEY ("adminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
      `;
      console.log("✅ Добавлен внешний ключ Family -> User");
    } catch (error) {
      console.log("⚠️ Внешний ключ уже существует:", error);
    }

    console.log("✅ Семейная система добавлена в базу данных!");

    // Проверяем обновленную структуру
    const userCount = await prisma.user.count();
    const familyCount = await prisma.family.count();

    return NextResponse.json({
      success: true,
      message: "Семейная система успешно добавлена!",
      updates: {
        "User table": "✅ Добавлены колонки: email, familyId, tempPassword, mustChangePassword, isEmailVerified",
        "Family table": "✅ Создана",
        "Indexes": "✅ Созданы уникальные индексы",
        "Foreign keys": "✅ Добавлены связи между таблицами"
      },
      counts: {
        users: userCount,
        families: familyCount
      },
      nextStep: "Теперь можно создавать семьи через /api/register-family"
    });

  } catch (error) {
    console.error("❌ Ошибка добавления семейной системы:", error);
    return NextResponse.json({
      success: false,
      error: "Ошибка добавления семейной системы",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
} 