import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("=== PROFILE UPDATE DEBUG ===");
    console.log("Session:", JSON.stringify(session, null, 2));
    console.log("Session user ID:", session?.user?.id);
    console.log("Session user:", session?.user);
    
    if (!session?.user?.id) {
      console.log("❌ No session or user ID found");
      return NextResponse.json({ error: "Необходима авторизация" }, { status: 401 });
    }

    const { userId, name, currentPassword, newPassword } = await request.json();
    
    console.log("Request data:", { userId, name, hasCurrentPassword: !!currentPassword, hasNewPassword: !!newPassword });

    // Проверяем, что пользователь обновляет свой профиль
    if (session.user.id !== userId) {
      return NextResponse.json({ error: "Нет прав для изменения этого профиля" }, { status: 403 });
    }

    // Валидация имени
    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Имя должно содержать минимум 2 символа" }, { status: 400 });
    }

    // Проверяем, не занято ли имя другим пользователем
    const existingUser = await prisma.user.findFirst({
      where: {
        name: name.trim(),
        NOT: {
          id: userId
        }
      }
    });

    if (existingUser) {
      return NextResponse.json({ error: "Это имя уже занято" }, { status: 400 });
    }

    // Получаем текущего пользователя
    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return NextResponse.json({ error: "Пользователь не найден" }, { status: 404 });
    }

    // Подготавливаем данные для обновления
    const updateData: any = {
      name: name.trim()
    };

    // Если нужно изменить пароль
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: "Необходимо указать текущий пароль" }, { status: 400 });
      }

      // Проверяем текущий пароль
      const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isCurrentPasswordValid) {
        return NextResponse.json({ error: "Неверный текущий пароль" }, { status: 400 });
      }

      // Валидация нового пароля
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "Новый пароль должен быть не менее 6 символов" }, { status: 400 });
      }

      // Хешируем новый пароль
      const hashedNewPassword = await bcrypt.hash(newPassword, 12);
      updateData.password = hashedNewPassword;
    }

    // Обновляем пользователя
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: updateData,
      select: {
        id: true,
        name: true,
        role: true
      }
    });

    return NextResponse.json({ 
      success: true, 
      user: updatedUser,
      message: "Профиль успешно обновлён"
    });

  } catch (error) {
    console.error("Ошибка при обновлении профиля:", error);
    return NextResponse.json({ error: "Внутренняя ошибка сервера" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
} 