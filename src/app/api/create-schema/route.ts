import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("🔧 Создаем схему базы данных...");
    
    // Создаем таблицы напрямую через SQL
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "password" TEXT NOT NULL,
        "role" TEXT NOT NULL DEFAULT 'CHILD',
        "points" INTEGER NOT NULL DEFAULT 0,
        "parentId" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Task" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "points" INTEGER NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "emoji" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Task_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserTask" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "taskId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'PENDING',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UserTask_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Gift" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "points" INTEGER NOT NULL,
        "isActive" BOOLEAN NOT NULL DEFAULT true,
        "emoji" TEXT,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Gift_pkey" PRIMARY KEY ("id")
      );
    `;

    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "UserGift" (
        "id" TEXT NOT NULL,
        "userId" TEXT NOT NULL,
        "giftId" TEXT NOT NULL,
        "status" TEXT NOT NULL DEFAULT 'REQUESTED',
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "UserGift_pkey" PRIMARY KEY ("id")
      );
    `;

    // Создаем индексы
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_name_key" ON "User"("name");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "User_parentId_idx" ON "User"("parentId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserTask_userId_idx" ON "UserTask"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserTask_taskId_idx" ON "UserTask"("taskId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserGift_userId_idx" ON "UserGift"("userId");`;
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "UserGift_giftId_idx" ON "UserGift"("giftId");`;

    // Добавляем внешние ключи
    await prisma.$executeRaw`
      ALTER TABLE "User" 
      ADD CONSTRAINT "User_parentId_fkey" 
      FOREIGN KEY ("parentId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
    `;

    await prisma.$executeRaw`
      ALTER TABLE "UserTask" 
      ADD CONSTRAINT "UserTask_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `;

    await prisma.$executeRaw`
      ALTER TABLE "UserTask" 
      ADD CONSTRAINT "UserTask_taskId_fkey" 
      FOREIGN KEY ("taskId") REFERENCES "Task"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `;

    await prisma.$executeRaw`
      ALTER TABLE "UserGift" 
      ADD CONSTRAINT "UserGift_userId_fkey" 
      FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `;

    await prisma.$executeRaw`
      ALTER TABLE "UserGift" 
      ADD CONSTRAINT "UserGift_giftId_fkey" 
      FOREIGN KEY ("giftId") REFERENCES "Gift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
    `;

    console.log("✅ Схема базы данных создана!");

    // Проверяем что таблицы созданы
    const userCount = await prisma.user.count();
    const taskCount = await prisma.task.count();
    const giftCount = await prisma.gift.count();

    return NextResponse.json({
      success: true,
      message: "Схема базы данных успешно создана!",
      tables: {
        User: "✅ Создана",
        Task: "✅ Создана", 
        UserTask: "✅ Создана",
        Gift: "✅ Создана",
        UserGift: "✅ Создана"
      },
      counts: {
        users: userCount,
        tasks: taskCount,
        gifts: giftCount
      },
      nextStep: "Теперь можно создавать пользователей через /api/init-admin"
    });

  } catch (error) {
    console.error("❌ Ошибка создания схемы:", error);
    return NextResponse.json({
      success: false,
      error: "Ошибка создания схемы базы данных",
      details: error instanceof Error ? error.message : String(error),
      recommendation: "Проверьте права доступа к базе данных"
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
} 