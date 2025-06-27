import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function DELETE() {
  try {
    console.log("🔥 Начинаем очистку пользователей и семей...");
    
    // Удаляем только связанные с пользователями данные
    await prisma.userTask.deleteMany({});
    console.log("✅ Удалены все UserTask");
    
    await prisma.userGift.deleteMany({});
    console.log("✅ Удалены все UserGift");
    
    await prisma.user.deleteMany({});
    console.log("✅ Удалены все User");
    
    await prisma.family.deleteMany({});
    console.log("✅ Удалены все Family");

    // Задачи и подарки оставляем!
    const counts = {
      users: await prisma.user.count(),
      families: await prisma.family.count(),
      tasks: await prisma.task.count(),
      gifts: await prisma.gift.count(),
      userTasks: await prisma.userTask.count(),
      userGifts: await prisma.userGift.count()
    };

    console.log("🔥 Пользователи и семьи удалены! Задачи и подарки сохранены.");

    return NextResponse.json({
      success: true,
      message: "Пользователи и семьи удалены! Задачи и подарки сохранены.",
      counts,
      warning: "ПОЛЬЗОВАТЕЛИ И СЕМЬИ УДАЛЕНЫ! Задачи и подарки остались.",
      nextSteps: [
        "1. Выполните /api/add-family-system для создания семейной структуры",
        "2. Создайте семью через /register-family"
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
    message: "Этот endpoint удалит всех пользователей и семьи (задачи и подарки останутся).",
    instruction: "Используйте метод DELETE для выполнения операции.",
    example: "curl -X DELETE https://family-stars.vercel.app/api/wipe-database"
  });
} 