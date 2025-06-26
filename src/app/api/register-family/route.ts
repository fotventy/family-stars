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
    const { email, familyName } = await request.json();

    if (!email || !familyName) {
      return NextResponse.json(
        { error: "Email и название семьи обязательны" }, 
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

    // Генерируем временный пароль
    const tempPassword = generateTempPassword();
    const hashedPassword = await hash(tempPassword, 10);
    const inviteCode = generateInviteCode();

    // Создаем администратора семьи
    const admin = await prisma.user.create({
      data: {
        name: `Админ семьи ${familyName}`,
        email,
        password: hashedPassword,
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

    console.log(`✅ Создана семья: ${familyName} с админом ${email}`);

    // В реальном приложении здесь бы отправляли email
    // Пока просто возвращаем временный пароль
    return NextResponse.json({
      success: true,
      message: `Семья "${familyName}" успешно создана!`,
      tempPassword, // В production убрать и отправить по email
      loginUrl: `${process.env.NEXTAUTH_URL || 'https://family-stars.vercel.app'}/login`,
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