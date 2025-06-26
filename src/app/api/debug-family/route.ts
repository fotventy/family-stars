import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    // Проверяем общую информацию
    const userCount = await prisma.user.count();
    const familyCount = await prisma.family.count();
    
    // Получаем всех пользователей с их семьями
    const allUsers = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        email: true,
        familyId: true,
        mustChangePassword: true
      }
    });
    
    // Получаем все семьи
    const allFamilies = await prisma.family.findMany({
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true
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

    // Информация о текущем пользователе если есть сессия
    let currentUserInfo = null;
    if (session) {
      const userId = (session as any).user.id;
      currentUserInfo = await prisma.user.findUnique({
        where: { id: userId },
        include: {
          family: true,
          adminFamily: true
        }
      });
    }

    // Проверим структуру таблицы User
    const userTableInfo = await prisma.$queryRaw`
      SELECT column_name, data_type, is_nullable 
      FROM information_schema.columns 
      WHERE table_name = 'User' 
      ORDER BY ordinal_position;
    `;

    return NextResponse.json({
      success: true,
      session: session ? {
        user: (session as any).user,
        expires: (session as any).expires
      } : null,
      database: {
        userCount,
        familyCount,
        users: allUsers,
        families: allFamilies,
        currentUser: currentUserInfo,
        userTableColumns: userTableInfo
      },
      debug: {
        message: "Отладочная информация о семейной системе"
      }
    });

  } catch (error) {
    console.error("❌ Ошибка отладки семьи:", error);
    return NextResponse.json({
      success: false,
      error: "Ошибка получения отладочной информации",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
} 