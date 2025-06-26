import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

export async function POST(request: Request) {
  try {
    const { token, newPassword } = await request.json();

    if (!token || !newPassword) {
      return NextResponse.json(
        { error: "Токен и новый пароль обязательны" }, 
        { status: 400 }
      );
    }

    if (newPassword.length < 4) {
      return NextResponse.json(
        { error: "Пароль должен содержать минимум 4 символа" }, 
        { status: 400 }
      );
    }

    // Находим пользователя по токену первого входа
    const user = await prisma.user.findFirst({
      where: { 
        tempPassword: token 
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Неверный токен" }, 
        { status: 404 }
      );
    }

    // Хешируем новый пароль
    const hashedPassword = await hash(newPassword, 10);

    // Обновляем пользователя
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        tempPassword: null, // убираем токен первого входа
        mustChangePassword: false, // снимаем флаг обязательной смены
        isEmailVerified: true
      }
    });

    console.log(`✅ Пароль изменен для пользователя: ${user.name}`);

    return NextResponse.json({
      success: true,
      message: "Пароль успешно изменен"
    });

  } catch (error) {
    console.error("❌ Ошибка смены пароля:", error);
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