import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  try {
    console.log("🔍 Тестируем подключение к базе данных...");
    
    // Проверяем подключение
    await prisma.$connect();
    console.log("✅ Подключение к базе данных установлено");
    
    // Проверяем схему - пытаемся получить количество пользователей
    const userCount = await prisma.user.count();
    console.log(`📊 Количество пользователей в базе: ${userCount}`);
    
    // Проверяем все таблицы
    const taskCount = await prisma.task.count();
    const giftCount = await prisma.gift.count();
    const userTaskCount = await prisma.userTask.count();
    const userGiftCount = await prisma.userGift.count();
    
    const stats = {
      users: userCount,
      tasks: taskCount,
      gifts: giftCount,
      userTasks: userTaskCount,
      userGifts: userGiftCount
    };
    
    console.log("📈 Статистика базы данных:", stats);
    
    // Проверяем переменные окружения
    const dbUrl = process.env.DATABASE_URL;
    const hasDbUrl = !!dbUrl;
    const dbProvider = dbUrl?.startsWith('postgresql://') ? 'PostgreSQL' : 
                      dbUrl?.startsWith('postgres://') ? 'PostgreSQL' :
                      dbUrl?.startsWith('file:') ? 'SQLite' : 'Unknown';
    
    return NextResponse.json({
      success: true,
      message: "База данных работает корректно!",
      database: {
        connected: true,
        provider: dbProvider,
        hasConnectionString: hasDbUrl,
        connectionStringPrefix: dbUrl?.substring(0, 20) + '...' || 'не найден'
      },
      statistics: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Ошибка подключения к базе данных:", error);
    
    return NextResponse.json({
      success: false,
      error: "Не удалось подключиться к базе данных",
      details: error instanceof Error ? error.message : String(error),
      database: {
        connected: false,
        hasConnectionString: !!process.env.DATABASE_URL,
        connectionStringPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...' || 'не найден'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
} 