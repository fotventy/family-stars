import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";

// Генерация кода приглашения семьи
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const { email, familyName, parentName, parentType, password: rawPassword } = await request.json();

    if (!email || !familyName || !parentName || !parentType) {
      return NextResponse.json(
        { error: "Все поля обязательны для заполнения" },
        { status: 400 }
      );
    }
    if (!rawPassword || typeof rawPassword !== "string" || rawPassword.length < 6 || rawPassword.length > 128) {
      return NextResponse.json(
        { error: "Пароль должен быть от 6 до 128 символов" },
        { status: 400 }
      );
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" }, 
        { status: 400 }
      );
    }

    const hashedPassword = await hash(rawPassword, 10);
    const inviteCode = generateInviteCode();

    const admin = await prisma.user.create({
      data: {
        name: parentName,
        email,
        password: hashedPassword,
        role: "FAMILY_ADMIN",
        points: 0,
        mustChangePassword: false,
        isEmailVerified: false,
      },
    });

    // Создаем семью
    const family = await prisma.family.create({
      data: {
        name: familyName,
        inviteCode,
        adminId: admin.id
      }
    });

    // Связываем админа с семьей
    await prisma.user.update({
      where: { id: admin.id },
      data: { familyId: family.id }
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://family-stars.vercel.app";
    const payload: Record<string, unknown> = {
      success: true,
      message: `Семья "${familyName}" успешно создана!`,
      parentName,
      parentType,
      loginUrl: `${baseUrl}/login`,
      familyCode: inviteCode,
      messageDetail: "Войдите на странице входа, введя код семьи и заданный пароль.",
    };

    return NextResponse.json(payload);

  } catch (error) {
    console.error("❌ Ошибка регистрации семьи:", error);
    const details = error instanceof Error ? error.message : String(error);
    const isUniqueName = /Unique constraint.*[\"']?name[\"']?/i.test(details) || /unique.*name/i.test(details);
    const isUniqueEmail = /Unique constraint.*[\"']?email[\"']?/i.test(details) || /unique.*email/i.test(details);
    let userError = "Ошибка регистрации семьи";
    if (isUniqueName) {
      userError = "Пользователь с таким именем уже зарегистрирован. Укажите уникальное имя (например, Мама Мария или Папа Алексей).";
    } else if (isUniqueEmail) {
      userError = "Пользователь с таким email уже существует";
    } else if (details) {
      userError = details;
    }
    return NextResponse.json(
      { error: userError, details },
      { status: 500 }
    );
  }
} 