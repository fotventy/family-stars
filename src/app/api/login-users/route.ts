import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const familyCode = searchParams.get('familyCode');

    console.log("📋 Получаем список пользователей для страницы логина...");
    
    if (familyCode) {
      // Ищем семью по коду приглашения
      console.log(`🔍 Поиск семьи по коду: ${familyCode}`);
      
      const family = await prisma.family.findUnique({
        where: { inviteCode: familyCode },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              role: true,
              points: true,
              gender: true
            },
            orderBy: [
              { role: 'desc' }, // PARENT/FAMILY_ADMIN сначала
              { name: 'asc' }
            ]
          }
        }
      });

      if (!family) {
        console.log("❌ Семья не найдена");
        return NextResponse.json(
          { error: "Неверный код семьи" }, 
          { status: 404 }
        );
      }

      console.log(`✅ Найдена семья: ${family.name}, участников: ${family.members.length}`);
      
      return NextResponse.json({
        familyName: family.name,
        users: family.members
      });
    } else {
      // Старая логика для обратной совместимости - возвращаем всех пользователей
      const users = await prisma.user.findMany({
        select: {
          id: true,
          name: true,
          role: true,
          points: true,
          gender: true
        },
        orderBy: [
          { role: 'desc' }, // PARENT сначала
          { name: 'asc' }
        ]
      });

      console.log(`✅ Найдено пользователей: ${users.length}`);
      
      return NextResponse.json(users);
    }

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