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
    const tasks = await prisma.task.findMany({
      where: {
        isActive: true,
        OR: [
          { familyId: null },
          ...(familyId ? [{ familyId }] : []),
        ],
      },
      orderBy: { sortOrder: "asc" },
    });
    return NextResponse.json(tasks);
  } catch (error) {
    console.error("Ошибка при получении задач:", error);
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
    const { title, description, points } = await request.json();
    if (!title || points === undefined) {
      return NextResponse.json(
        { error: "Название и баллы обязательны" },
        { status: 400 }
      );
    }
    const newTask = await prisma.task.create({
      data: {
        title,
        description,
        points,
        ...(familyId ? { familyId } : {}),
      },
    });

    return NextResponse.json(newTask, { status: 201 });
  } catch (error) {
    console.error("Ошибка при создании задачи:", error);
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
    const { id, title, description, points, isActive } = await request.json();
    if (!id) {
      return NextResponse.json(
        { error: "ID задачи обязателен" },
        { status: 400 }
      );
    }
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
    }
    if (familyId && existing.familyId !== familyId) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }
    const updatedTask = await prisma.task.update({
      where: { id },
      data: {
        title,
        description,
        points,
        isActive
      }
    });

    return NextResponse.json(updatedTask);
  } catch (error) {
    console.error("Ошибка при обновлении задачи:", error);
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
        { error: "ID задачи обязателен" },
        { status: 400 }
      );
    }
    const existing = await prisma.task.findUnique({ where: { id } });
    if (!existing) {
      return NextResponse.json({ error: "Задача не найдена" }, { status: 404 });
    }
    if (familyId && existing.familyId !== familyId) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }
    await prisma.task.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Задача удалена" });
  } catch (error) {
    console.error("Ошибка при удалении задачи:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
} 