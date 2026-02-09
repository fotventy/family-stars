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

    const userTasks = await prisma.userTask.findMany({
      where: {
        userId: (session as any).user.id
      },
      include: {
        task: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(userTasks);
  } catch (error) {
    console.error("Ошибка при загрузке задач пользователя:", error);
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

    const { taskId } = await request.json();

    if (!taskId) {
      return NextResponse.json(
        { error: "ID задачи обязателен" }, 
        { status: 400 }
      );
    }

    // Проверяем, что задача существует
    const task = await prisma.task.findUnique({
      where: { id: taskId }
    });

    if (!task) {
      return NextResponse.json(
        { error: "Задача не найдена" }, 
        { status: 404 }
      );
    }

    // Проверяем, не выполнял ли пользователь эту задачу сегодня
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingUserTask = await prisma.userTask.findFirst({
      where: {
        userId: (session as any).user.id,
        taskId: taskId,
        status: 'COMPLETED',
        createdAt: {
          gte: today,
          lt: tomorrow
        }
      }
    });

    if (existingUserTask) {
      return NextResponse.json(
        { error: "Эта задача уже выполнена сегодня" }, 
        { status: 400 }
      );
    }

    const result = await prisma.$transaction(async (tx) => {
      const newUserTask = await tx.userTask.create({
        data: {
          userId: (session as any).user.id,
          taskId: taskId,
          status: "COMPLETED",
        },
        include: { task: true },
      });
      await tx.user.update({
        where: { id: (session as any).user.id },
        data: { points: { increment: task.points } },
      });
      return { userTask: newUserTask };
    });

    return NextResponse.json(result.userTask, { status: 201 });
  } catch (error) {
    console.error("Ошибка при выполнении задачи:", error);
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
    const { id, status } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID выполненной задачи обязателен" }, 
        { status: 400 }
      );
    }

    const updatedUserTask = await prisma.userTask.update({
      where: { id },
      data: { status }
    });

    return NextResponse.json(updatedUserTask);
  } catch (error) {
    console.error("Ошибка при обновлении статуса задачи:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
} 