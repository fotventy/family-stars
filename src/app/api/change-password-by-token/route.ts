import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, userName, newPassword } = await request.json();

    if (!token || !userName || !newPassword) {
      return NextResponse.json(
        { error: "Токен, имя пользователя и новый пароль обязательны" }, 
        { status: 400 }
      );
    }

    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 6 символов" }, 
        { status: 400 }
      );
    }

    // Ищем пользователя по токену и имени
    const user = await prisma.user.findFirst({
      where: {
        name: userName,
        tempPassword: token,
        mustChangePassword: true
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Неверный токен или пользователь не найден" }, 
        { status: 404 }
      );
    }

    // Хешируем новый пароль
    const hashedPassword = await hash(newPassword, 10);

    // Обновляем пароль и убираем флаги для смены пароля
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        tempPassword: null,
        mustChangePassword: false,
        isEmailVerified: true
      }
    });

    console.log(`✅ Пароль изменён для пользователя: ${user.name} (${user.role})`);

    return NextResponse.json({
      success: true,
      message: "Пароль успешно изменён",
      user: {
        id: user.id,
        name: user.name,
        role: user.role
      }
    });

  } catch (error) {
    console.error("❌ Ошибка смены пароля по токену:", error);
    return NextResponse.json(
      { 
        error: "Ошибка смены пароля",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 