import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("👨‍👩‍👧‍👦 Инициализируем всю семью...");

    // Список всех семейных пользователей
    const familyUsers = [
      // Родители
      { name: "Папа", password: "papa2024", role: "PARENT" },
      { name: "Мама", password: "mama2024", role: "PARENT" },
      
      // Дети
      { name: "Назар", password: "nazar2024", role: "CHILD" },
      { name: "Влад", password: "vlad2024", role: "CHILD" },
      { name: "Никита", password: "nikita2024", role: "CHILD" },
    ];

    const createdUsers = [];
    const existingUsers = [];

    for (const userData of familyUsers) {
      try {
        // Проверяем, существует ли пользователь
        const existingUser = await prisma.user.findUnique({
          where: { name: userData.name }
        });

        if (existingUser) {
          console.log(`⚠️  Пользователь ${userData.name} уже существует`);
          existingUsers.push({
            name: userData.name,
            role: userData.role,
            status: "already_exists"
          });
          continue;
        }

        // Хешируем пароль
        const hashedPassword = await hash(userData.password, 10);

        // Создаем пользователя
        const newUser = await prisma.user.create({
          data: {
            name: userData.name,
            password: hashedPassword,
            role: userData.role as "PARENT" | "CHILD",
            points: userData.role === "CHILD" ? 10 : 0, // Даем детям стартовые звёзды
          }
        });

        console.log(`✅ Создан пользователь: ${newUser.name} (${newUser.role})`);
        createdUsers.push({
          name: newUser.name,
          password: userData.password,
          role: newUser.role,
          points: newUser.points,
          status: "created"
        });

      } catch (userError) {
        console.error(`❌ Ошибка создания пользователя ${userData.name}:`, userError);
        existingUsers.push({
          name: userData.name,
          role: userData.role,
          status: "error",
          error: userError instanceof Error ? userError.message : String(userError)
        });
      }
    }

    // Получаем общее количество пользователей
    const totalUsers = await prisma.user.count();

    console.log(`🎉 Инициализация семьи завершена!`);
    console.log(`📊 Создано новых: ${createdUsers.length}`);
    console.log(`📊 Уже существовало: ${existingUsers.length}`);
    console.log(`📊 Всего пользователей: ${totalUsers}`);

    return NextResponse.json({
      success: true,
      message: `Семья инициализирована! Создано ${createdUsers.length} новых пользователей`,
      statistics: {
        created: createdUsers.length,
        existing: existingUsers.length,
        total: totalUsers
      },
      createdUsers,
      existingUsers
    });

  } catch (error) {
    console.error("❌ Ошибка инициализации семьи:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Ошибка инициализации семьи",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 