import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET() {
  try {
    console.log("🔍 Получаем все семьи для отладки...");
    
    const families = await prisma.family.findMany({
      include: {
        admin: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true
          }
        },
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            points: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    console.log(`📊 Найдено семей: ${families.length}`);

    const familiesInfo = families.map(family => ({
      id: family.id,
      name: family.name,
      inviteCode: family.inviteCode,
      admin: family.admin,
      membersCount: family.members.length,
      members: family.members,
      createdAt: family.createdAt
    }));

    return NextResponse.json({
      count: families.length,
      families: familiesInfo
    });

  } catch (error) {
    console.error("❌ Ошибка получения семей:", error);
    return NextResponse.json(
      { 
        error: "Ошибка получения семей",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
} 