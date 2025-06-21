import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function POST() {
  try {
    // Проверяем, есть ли уже пользователи
    const existingUsers = await prisma.user.findMany();
    
    if (existingUsers.length > 0) {
      return NextResponse.json(
        { error: "Пользователи уже существуют" }, 
        { status: 400 }
      );
    }

    // Создаем администратора
    const admin = await prisma.user.create({
      data: {
        name: 'Админ',
        password: await bcrypt.hash('admin2024', 10),
        role: 'PARENT',
        points: 0
      }
    });

    // Создаем тестового ребенка
    const child = await prisma.user.create({
      data: {
        name: 'Тест',
        password: await bcrypt.hash('test2024', 10),
        role: 'CHILD',
        parentId: admin.id,
        points: 50
      }
    });

    // Создаем несколько базовых задач
    await prisma.task.createMany({
      data: [
        { title: 'Убрать комнату', description: 'Навести порядок', points: 15 },
        { title: 'Сделать зарядку', description: '10 минут упражнений', points: 10 },
        { title: 'Помыть посуду', description: 'После обеда', points: 12 }
      ]
    });

    // Создаем несколько базовых подарков
    await prisma.gift.createMany({
      data: [
        { title: 'Час игры', description: 'Дополнительный час игр', points: 25 },
        { title: 'Сладость', description: 'Любимая конфета', points: 10 },
        { title: 'Поздний отбой', description: 'На 30 минут позже', points: 30 }
      ]
    });

    return NextResponse.json({ 
      success: true,
      message: "Система инициализирована!",
      users: [
        { name: 'Админ', password: 'admin2024', role: 'PARENT' },
        { name: 'Тест', password: 'test2024', role: 'CHILD' }
      ]
    });

  } catch (error) {
    console.error("Ошибка инициализации:", error);
    return NextResponse.json(
      { error: "Ошибка создания пользователей" }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 