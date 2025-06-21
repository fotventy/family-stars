import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("🔧 Добавляем поле sortOrder к существующим таблицам...");
    
    // Добавляем поле sortOrder к таблице Task если его нет
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Task" 
        ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER DEFAULT 0;
      `;
      console.log("✅ Поле sortOrder добавлено к таблице Task");
    } catch (error) {
      console.log("ℹ️ Поле sortOrder уже существует в таблице Task или произошла ошибка:", error);
    }

    // Добавляем поле sortOrder к таблице Gift если его нет
    try {
      await prisma.$executeRaw`
        ALTER TABLE "Gift" 
        ADD COLUMN IF NOT EXISTS "sortOrder" INTEGER DEFAULT 0;
      `;
      console.log("✅ Поле sortOrder добавлено к таблице Gift");
    } catch (error) {
      console.log("ℹ️ Поле sortOrder уже существует в таблице Gift или произошла ошибка:", error);
    }

    // Устанавливаем sortOrder для существующих задач
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: 'asc' }
    });

    for (let i = 0; i < tasks.length; i++) {
      await prisma.task.update({
        where: { id: tasks[i].id },
        data: { sortOrder: i }
      });
    }

    // Устанавливаем sortOrder для существующих подарков
    const gifts = await prisma.gift.findMany({
      orderBy: { points: 'asc' } // Сортируем подарки по цене
    });

    for (let i = 0; i < gifts.length; i++) {
      await prisma.gift.update({
        where: { id: gifts[i].id },
        data: { sortOrder: i }
      });
    }

    console.log("✅ Поля sortOrder добавлены и проинициализированы!");

    return NextResponse.json({
      success: true,
      message: "Поля sortOrder успешно добавлены!",
      updated: {
        tasks: tasks.length,
        gifts: gifts.length
      }
    });

  } catch (error) {
    console.error("❌ Ошибка добавления sortOrder:", error);
    return NextResponse.json({
      success: false,
      error: "Ошибка добавления поля sortOrder",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
} 