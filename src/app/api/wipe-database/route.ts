import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE() {
  try {
    console.log("🔥 Начинаем полную очистку базы данных...");
    
    // Удаляем все данные в правильном порядке (сначала зависимые таблицы)
    await prisma.userTask.deleteMany({});
    console.log("✅ Удалены все UserTask");
    
    await prisma.userGift.deleteMany({});
    console.log("✅ Удалены все UserGift");
    
    await prisma.user.deleteMany({});
    console.log("✅ Удалены все User");
    
    await prisma.family.deleteMany({});
    console.log("✅ Удалены все Family");
    
    await prisma.task.deleteMany({});
    console.log("✅ Удалены все Task");
    
    await prisma.gift.deleteMany({});
    console.log("✅ Удалены все Gift");

    // Проверяем что всё удалено
    const counts = {
      users: await prisma.user.count(),
      families: await prisma.family.count(),
      tasks: await prisma.task.count(),
      gifts: await prisma.gift.count(),
      userTasks: await prisma.userTask.count(),
      userGifts: await prisma.userGift.count()
    };

    console.log("🔥 База данных полностью очищена!");

    return NextResponse.json({
      success: true,
      message: "База данных полностью очищена!",
      counts,
      warning: "ВСЕ ДАННЫЕ УДАЛЕНЫ! Теперь нужно создать новую схему и пользователей.",
      nextSteps: [
        "1. Выполните /api/add-family-system для создания семейной структуры",
        "2. Выполните /api/init-content для создания задач и подарков", 
        "3. Создайте семью через /register-family"
      ]
    });

  } catch (error) {
    console.error("❌ Ошибка очистки базы данных:", error);
    return NextResponse.json({
      success: false,
      error: "Ошибка очистки базы данных",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
}

// Также добавим GET метод для безопасности (чтобы случайно не удалить)
export async function GET() {
  return NextResponse.json({
    warning: "⚠️ ОПАСНАЯ ОПЕРАЦИЯ!",
    message: "Этот endpoint полностью удалит ВСЕ данные из базы.",
    instruction: "Используйте метод DELETE для выполнения операции.",
    example: "curl -X DELETE https://family-stars.vercel.app/api/wipe-database"
  });
} 