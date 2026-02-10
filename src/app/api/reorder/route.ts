import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (
      !session ||
      ((session as any).user.role !== "PARENT" &&
        (session as any).user.role !== "FAMILY_ADMIN")
    ) {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { type, items } = await request.json();

    if (!type || !items || !Array.isArray(items)) {
      return NextResponse.json(
        { error: "Неверные данные" }, 
        { status: 400 }
      );
    }

    console.log(`🔄 Переупорядочиваем ${type}:`, items.map(item => item.title));

    // Обновляем порядок в транзакции
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        
        if (type === 'tasks') {
          await tx.task.update({
            where: { id: item.id },
            data: { sortOrder: i }
          });
        } else if (type === 'gifts') {
          await tx.gift.update({
            where: { id: item.id },
            data: { sortOrder: i }
          });
        }
      }
    });

    console.log(`✅ Порядок ${type} обновлен`);

    return NextResponse.json({
      success: true,
      message: `Порядок ${type === 'tasks' ? 'задач' : 'подарков'} обновлен`
    });

  } catch (error) {
    console.error("❌ Ошибка переупорядочивания:", error);
    return NextResponse.json(
      { 
        error: "Ошибка переупорядочивания",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 