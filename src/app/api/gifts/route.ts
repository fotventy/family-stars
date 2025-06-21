import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" }, 
        { status: 401 }
      );
    }

    // Получаем все активные подарки (Gift - общие для всех)
    const gifts = await prisma.gift.findMany({
      where: {
        isActive: true
      }
    });

    return NextResponse.json(gifts);
  } catch (error) {
    console.error("Ошибка при получении подарков:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { title, description, points, emoji } = await request.json();

    if (!title || points === undefined) {
      return NextResponse.json(
        { error: "Название и баллы обязательны" }, 
        { status: 400 }
      );
    }

    // Создаем подарок без userId (Gift - общая сущность)
    const newGift = await prisma.gift.create({
      data: {
        title,
        description,
        points,
        emoji
      }
    });

    return NextResponse.json(newGift, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании подарка:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { id, title, description, points, isActive, emoji } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID подарка обязателен" }, 
        { status: 400 }
      );
    }

    const updatedGift = await prisma.gift.update({
      where: { id },
      data: {
        title,
        description,
        points,
        isActive,
        emoji
      }
    });

    return NextResponse.json(updatedGift);
  } catch (error) {
    console.error("Ошибка при обновлении подарка:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: "ID подарка обязателен" }, 
        { status: 400 }
      );
    }

    await prisma.gift.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Подарок удален" });
  } catch (error) {
    console.error("Ошибка при удалении подарка:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
} 