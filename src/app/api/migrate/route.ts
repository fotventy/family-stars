import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("🔄 Проверяем состояние миграций...");
    
    // Пытаемся выполнить простую операцию для проверки схемы
    await prisma.$queryRaw`SELECT 1`;
    
    // Проверяем, существуют ли наши таблицы
    const tableChecks = await Promise.allSettled([
      prisma.user.findFirst(),
      prisma.task.findFirst(), 
      prisma.gift.findFirst(),
      prisma.userTask.findFirst(),
      prisma.userGift.findFirst()
    ]);
    
    const tablesExist = {
      User: tableChecks[0].status === 'fulfilled',
      Task: tableChecks[1].status === 'fulfilled',
      Gift: tableChecks[2].status === 'fulfilled',
      UserTask: tableChecks[3].status === 'fulfilled',
      UserGift: tableChecks[4].status === 'fulfilled'
    };
    
    const allTablesExist = Object.values(tablesExist).every(exists => exists);
    
    return NextResponse.json({
      success: true,
      message: allTablesExist ? "Все таблицы созданы" : "Некоторые таблицы отсутствуют",
      migration: {
        required: !allTablesExist,
        tablesExist,
        recommendation: allTablesExist ? 
          "Миграции не требуются" : 
          "Необходимо применить миграции в Vercel Dashboard"
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Ошибка проверки миграций:", error);
    
    const errorMessage = error instanceof Error ? error.message : String(error);
    const isSchemaError = errorMessage.includes('relation') || 
                         errorMessage.includes('table') || 
                         errorMessage.includes('column');
    
    return NextResponse.json({
      success: false,
      error: "Ошибка при проверке схемы базы данных",
      details: errorMessage,
      migration: {
        required: true,
        reason: isSchemaError ? "Таблицы не созданы" : "Неизвестная ошибка",
        recommendation: isSchemaError ? 
          "Необходимо выполнить: prisma migrate deploy" : 
          "Проверьте подключение к базе данных"
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
} 