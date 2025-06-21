import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("🔍 Отладка: получаем всех пользователей из базы...");
    
    // Получаем всех пользователей с полной информацией
    const users = await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        role: true,
        points: true,
        createdAt: true,
        updatedAt: true
      },
      orderBy: [
        { role: 'desc' }, // PARENT сначала
        { name: 'asc' }
      ]
    });

    console.log(`✅ Найдено пользователей: ${users.length}`);
    
    // Получаем статистику
    const totalUsers = await prisma.user.count();
    const parentCount = await prisma.user.count({ where: { role: 'PARENT' } });
    const childCount = await prisma.user.count({ where: { role: 'CHILD' } });

    return NextResponse.json({
      success: true,
      statistics: {
        total: totalUsers,
        parents: parentCount,
        children: childCount
      },
      users: users.map(user => ({
        id: user.id,
        name: user.name,
        role: user.role,
        points: user.points,
        createdAt: user.createdAt.toISOString(),
        updatedAt: user.updatedAt.toISOString()
      }))
    });

  } catch (error) {
    console.error("❌ Ошибка отладки пользователей:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Ошибка отладки пользователей",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 