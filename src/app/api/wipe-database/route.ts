import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function DELETE(request: Request) {
  const adminError = await requireAdmin(request);
  if (adminError) return adminError;
  try {
    console.log("🔥 Начинаем очистку пользователей и семей...");
    
    // Удаляем в правильном порядке (учитываем внешние ключи)
    await prisma.userTask.deleteMany({});
    console.log("✅ Удалены все UserTask");
    
    await prisma.userGift.deleteMany({});
    console.log("✅ Удалены все UserGift");
    
    // ВАЖНО: Сначала семьи (они ссылаются на админов), потом пользователей
    await prisma.family.deleteMany({});
    console.log("✅ Удалены все Family");
    
    await prisma.user.deleteMany({});
    console.log("✅ Удалены все User");

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

export async function GET(request: Request) {
  const adminError = await requireAdmin(request);
  if (adminError) return adminError;
  return NextResponse.json({
    warning: "⚠️ ОПАСНАЯ ОПЕРАЦИЯ!",
    message: "Этот endpoint удалит всех пользователей и семьи. Требуется X-Admin-Key.",
    instruction: "Используйте метод DELETE с заголовком X-Admin-Key для выполнения.",
  });
} 