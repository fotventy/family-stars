import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const familyCode = searchParams.get("familyCode");

    if (!familyCode || !familyCode.trim()) {
      return NextResponse.json(
        { error: "Укажите код семьи (familyCode)" },
        { status: 400 }
      );
    }

    const family = await prisma.family.findUnique({
      where: { inviteCode: familyCode.trim() },
      include: {
        members: {
          select: {
            id: true,
            name: true,
            role: true,
            points: true,
            gender: true,
          },
          orderBy: [
            { role: "desc" },
            { name: "asc" },
          ],
        },
      },
    });

    if (!family) {
      return NextResponse.json(
        { error: "Неверный код семьи" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      familyName: family.name,
      users: family.members,
    });
  } catch (error) {
    console.error("❌ Ошибка получения пользователей:", error);
    return NextResponse.json(
      { 
        error: "Ошибка получения пользователей",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  }
} 