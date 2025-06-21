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

    const tasks = await prisma.task.findMany({
      where: {
        userId: session.user.role === "PARENT" ? session.user.id : undefined,
        isActive: true
      }
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
    
    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

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
        userId: session.user.id
      }
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
    
    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { id, title, description, points, isActive } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID задачи обязателен" }, 
        { status: 400 }
      );
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
        { error: "ID задачи обязателен" }, 
        { status: 400 }
      );
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