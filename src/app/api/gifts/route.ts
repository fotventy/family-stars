import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Не авторизован" }, { status: 401 });
    }
    const familyId = (session as any).user.familyId as string | undefined;
    const gifts = await prisma.gift.findMany({
      where: {
        isActive: true,
        OR: [{ familyId: null }, ...(familyId ? [{ familyId }] : [])],
      },
      orderBy: { sortOrder: "asc" },
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
    const familyId = (session as any).user.familyId as string | undefined;
    const { title, description, points, emoji } = await request.json();
    if (!title || points === undefined) {
      return NextResponse.json(
        { error: "Название и баллы обязательны" },
        { status: 400 }
      );
    }
    const newGift = await prisma.gift.create({
      data: {
        title,
        description,
        points,
        emoji,
        ...(familyId ? { familyId } : {}),
      },
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
    const familyId = (session as any).user.familyId as string | undefined;
    const { id, title, description, points, isActive, emoji } =
      await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "ID подарка обязателен" },
        { status: 400 }
      );
    }
    const existing = await prisma.gift.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Подарок не найден" }, { status: 404 });
    }
    // Записи с familyId: null (legacy) — разрешаем редактировать/удалять
    if (existing.familyId != null && familyId && existing.familyId !== familyId) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
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
    const familyId = (session as any).user.familyId as string | undefined;
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json(
        { error: "ID подарка обязателен" },
        { status: 400 }
      );
    }
    const existing = await prisma.gift.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Подарок не найден" }, { status: 404 });
    }
    // Записи с familyId: null (legacy) — разрешаем редактировать/удалять
    if (existing.familyId != null && familyId && existing.familyId !== familyId) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
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