import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" }, 
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: (session as any).user.id },
      select: { points: true }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" }, 
        { status: 404 }
      );
    }

    return NextResponse.json({ points: user.points });
  } catch (error) {
    console.error("Ошибка при получении баллов:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" }, 
        { status: 401 }
      );
    }

    const { points, action } = await request.json();

    if (points === undefined || !action) {
      return NextResponse.json(
        { error: "Баллы и действие обязательны" }, 
        { status: 400 }
      );
    }

    let updatedUser;
    
    if (action === "add") {
      updatedUser = await prisma.user.update({
        where: { id: (session as any).user.id },
        data: { points: { increment: points } }
      });
    } else if (action === "subtract") {
      // Проверяем, хватает ли баллов
      const currentUser = await prisma.user.findUnique({
        where: { id: (session as any).user.id }
      });
      
      if (!currentUser || currentUser.points < points) {
        return NextResponse.json(
          { error: "Недостаточно баллов" }, 
          { status: 400 }
        );
      }
      
      updatedUser = await prisma.user.update({
        where: { id: (session as any).user.id },
        data: { points: { decrement: points } }
      });
    } else {
      return NextResponse.json(
        { error: "Неверное действие" }, 
        { status: 400 }
      );
    }

    return NextResponse.json({ points: updatedUser.points });
  } catch (error) {
    console.error("Ошибка при обновлении баллов:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
} 