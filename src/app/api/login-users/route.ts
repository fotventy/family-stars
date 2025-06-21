import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("📋 Получаем список пользователей для страницы логина...");
    
    // Получаем всех пользователей
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        points: true
      },
      orderBy: [
        { role: 'desc' }, // PARENT сначала
        { name: 'asc' }
      ]
    });

    console.log(`✅ Найдено пользователей: ${users.length}`);
    
    return NextResponse.json(users);

  } catch (error) {
    console.error("❌ Ошибка получения пользователей:", error);
    return NextResponse.json(
      { 
        error: "Ошибка получения пользователей",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 