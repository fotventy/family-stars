import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { hash } from "bcryptjs";

const prisma = new PrismaClient();

// Генерация случайного пароля
function generateTempPassword(length = 8) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

// Генерация кода приглашения семьи
function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const { email, familyName, parentName, parentType } = await request.json();

    if (!email || !familyName || !parentName || !parentType) {
      return NextResponse.json(
        { error: "Все поля обязательны для заполнения" }, 
        { status: 400 }
      );
    }

    // Проверяем, не существует ли уже пользователь с таким email
    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Пользователь с таким email уже существует" }, 
        { status: 400 }
      );
    }

    // Генерируем временный пароль и токен для первого входа
    const tempPassword = generateTempPassword();
    const hashedPassword = await hash(tempPassword, 10);
    const firstLoginToken = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const inviteCode = generateInviteCode();

    // Создаем первого родителя как администратора семьи
    const admin = await prisma.user.create({
      data: {
        name: parentName,
        email,
        password: hashedPassword,
        tempPassword: firstLoginToken,
        role: "FAMILY_ADMIN",
        points: 0,
        mustChangePassword: true,
        isEmailVerified: false
      }
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

    console.log(`✅ Создана семья: ${familyName} с ${parentType} ${parentName} (${email})`);

    // Генерируем ссылку для первого входа
    const baseUrl = process.env.NEXTAUTH_URL || 'https://family-stars.vercel.app';
    const firstLoginUrl = `${baseUrl}/first-login?token=${firstLoginToken}&user=${encodeURIComponent(parentName)}`;

    return NextResponse.json({
      success: true,
      message: `Семья "${familyName}" успешно создана!`,
      parentName,
      parentType,
      firstLoginUrl,
      loginUrl: `${baseUrl}/login`,
      familyCode: inviteCode
    });

  } catch (error) {
    console.error("❌ Ошибка регистрации семьи:", error);
    return NextResponse.json(
      { 
        error: "Ошибка регистрации семьи",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 