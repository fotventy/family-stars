import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { authOptions } from "../auth/[...nextauth]/route";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const users = await prisma.user.findMany({
      where: {
        role: 'CHILD'
      },
      select: {
        id: true,
        name: true,
        role: true,
        points: true,
        createdAt: true
      }
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
    
    if (!session || session.user.role !== "PARENT") {
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

    const existingUser = await prisma.user.findUnique({
      where: { name }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким именем уже существует" }, 
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role
      }
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
    
    if (!session || session.user.role !== "PARENT") {
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { id, name, password } = await request.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID пользователя обязателен" }, 
        { status: 400 }
      );
    }

    const updateData: { name?: string, password?: string } = {};

    if (name) {
      const existingUser = await prisma.user.findUnique({
        where: { name }
      });

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: "Пользователь с таким именем уже существует" }, 
          { status: 400 }
        );
      }

      updateData.name = name;
    }

    if (password) {
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
        { error: "ID пользователя обязателен" }, 
        { status: 400 }
      );
    }

    await prisma.user.delete({
      where: { id }
    });

    return NextResponse.json({ message: "Пользователь удален" });
  } catch (error) {
    console.error("Ошибка при удалении пользователя:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
} 