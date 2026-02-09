import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
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
    const where: { role: string; familyId?: string | null } = { role: "CHILD" };
    if (familyId) where.familyId = familyId;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Ошибка при получении пользователей:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || ((session as any).user.role !== "PARENT" && (session as any).user.role !== "FAMILY_ADMIN")) {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { name, password, role = "CHILD" } = await request.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "Имя и пароль обязательны" },
        { status: 400 }
      );
    }
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: "Пароль должен быть от 6 до 128 символов" },
        { status: 400 }
      );
    }
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Имя слишком длинное" },
        { status: 400 }
      );
    }

    const familyId = (session as any).user.familyId as string | undefined;
    const existingUser = await prisma.user.findFirst({
      where: familyId ? { name, familyId } : { name },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "В этой семье уже есть пользователь с таким именем" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role,
        ...(familyId ? { familyId } : {}),
      },
    });

    return NextResponse.json(
      { 
        id: newUser.id, 
        name: newUser.name, 
        role: newUser.role 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Ошибка при создании пользователя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || ((session as any).user.role !== "PARENT" && (session as any).user.role !== "FAMILY_ADMIN")) {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { id, name, password } = await request.json();
    const familyId = (session as any).user.familyId as string | undefined;

    if (!id) {
      return NextResponse.json(
        { error: "ID пользователя обязателен" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }
    if (familyId && target.familyId !== familyId) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    const updateData: { name?: string; password?: string } = {};

    if (name) {
      const existingUser = await prisma.user.findFirst({
        where: familyId ? { name, familyId } : { name },
      });

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: "В этой семье уже есть пользователь с таким именем" },
          { status: 400 }
        );
      }

      updateData.name = name;
    }

    if (password) {
      if (password.length < 6 || password.length > 128) {
        return NextResponse.json(
          { error: "Пароль должен быть от 6 до 128 символов" },
          { status: 400 }
        );
      }
      updateData.password = await hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      role: updatedUser.role
    });
  } catch (error) {
    console.error("Ошибка при обновлении пользователя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || ((session as any).user.role !== "PARENT" && (session as any).user.role !== "FAMILY_ADMIN")) {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const familyId = (session as any).user.familyId as string | undefined;

    if (!id) {
      return NextResponse.json(
        { error: "ID пользователя обязателен" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }
    if (familyId && target.familyId !== familyId) {
      return NextResponse.json({ error: "Недостаточно прав" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "Пользователь удален" });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
} 