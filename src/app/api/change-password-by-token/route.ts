import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

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

    const user = await prisma.user.findFirst({
      where: {
        name: userName,
        tempPassword: token,
        mustChangePassword: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Неверный токен или пользователь не найден" },
        { status: 404 }
      );
    }

    if (user.tempPasswordExpiresAt && new Date() > user.tempPasswordExpiresAt) {
      return NextResponse.json(
        { error: "Срок действия ссылки истёк. Запросите новую." },
        { status: 410 }
      );
    }

    const hashedPassword = await hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        tempPassword: null,
        tempPasswordExpiresAt: null,
        mustChangePassword: false,
        isEmailVerified: true,
      },
    });

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

  }
} 