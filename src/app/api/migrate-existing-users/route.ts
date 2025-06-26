import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("🔄 Начинаем миграцию существующих пользователей в семейную систему...");

    // Проверяем есть ли уже семьи
    const existingFamilies = await prisma.family.findMany();
    if (existingFamilies.length > 0) {
      return NextResponse.json({
        success: false,
        message: "Семьи уже существуют. Миграция не требуется.",
        existingFamilies: existingFamilies.length
      });
    }

    // Находим всех существующих пользователей
    const allUsers = await prisma.user.findMany({
      where: {
        familyId: null // Пользователи без семьи
      }
    });

    if (allUsers.length === 0) {
      return NextResponse.json({
        success: true,
        message: "Нет пользователей для миграции",
        migrated: 0
      });
    }

    console.log(`👥 Найдено пользователей для миграции: ${allUsers.length}`);

    // Находим главного родителя (первый PARENT или создаём семью "Моя семья")
    const mainParent = allUsers.find(u => u.role === 'PARENT');
    
    let familyName = "Моя семья";
    let adminUser = mainParent;

    // Если нет родителей, создаём семью для всех пользователей
    if (!mainParent) {
      console.log("⚠️ Родители не найдены, создаём общую семью");
      // Берём первого пользователя как админа
      adminUser = allUsers[0];
      familyName = `Семья ${adminUser.name}`;
    } else {
      familyName = `Семья ${mainParent.name}`;
    }

    // Генерируем уникальный код семьи
    const generateInviteCode = () => {
      return Math.random().toString(36).substring(2, 8).toUpperCase();
    };

    let inviteCode = generateInviteCode();
    
    // Проверяем уникальность кода
    while (await prisma.family.findUnique({ where: { inviteCode } })) {
      inviteCode = generateInviteCode();
    }

    console.log(`🏠 Создаём семью: ${familyName} с кодом ${inviteCode}`);

    // Проверяем что adminUser определён
    if (!adminUser) {
      throw new Error("Не удалось определить администратора семьи");
    }

    // Создаём семью
    const family = await prisma.family.create({
      data: {
        name: familyName,
        inviteCode,
        adminId: adminUser.id
      }
    });

    console.log(`✅ Семья создана с ID: ${family.id}`);

    // Обновляем всех пользователей, добавляя их в семью
    const updatePromises = allUsers.map(user => 
      prisma.user.update({
        where: { id: user.id },
        data: { 
          familyId: family.id,
          // Если это админ семьи, обновляем роль
          ...(user.id === adminUser.id && { role: 'FAMILY_ADMIN' })
        }
      })
    );

    await Promise.all(updatePromises);

    console.log(`👨‍👩‍👧‍👦 Все ${allUsers.length} пользователей добавлены в семью`);

    // Получаем обновлённую информацию
    const updatedFamily = await prisma.family.findUnique({
      where: { id: family.id },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            points: true
          }
        },
        admin: {
          select: {
            id: true,
            name: true,
            role: true
          }
        }
      }
    });

    return NextResponse.json({
      success: true,
      message: "Миграция существующих пользователей в семейную систему завершена успешно!",
      family: updatedFamily,
      migratedUsers: allUsers.length,
      details: {
        familyName,
        inviteCode,
        adminUser: {
          id: adminUser!.id,
          name: adminUser!.name,
          role: adminUser!.role
        },
        members: updatedFamily?.members || []
      }
    });

  } catch (error) {
    console.error("❌ Ошибка миграции:", error);
    return NextResponse.json({
      success: false,
      error: "Ошибка при миграции существующих пользователей",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
} 