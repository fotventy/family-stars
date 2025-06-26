import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// Генерация уникального токена для первого входа
function generateFirstLoginToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Получить информацию о семье
export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" }, 
        { status: 401 }
      );
    }

    const userId = (session as any).user.id;
    
    // Получаем пользователя с информацией о семье
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        family: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                role: true,
                points: true,
                email: true,
                mustChangePassword: true,
                createdAt: true
              }
            }
          }
        },
        adminFamily: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                role: true,
                points: true,
                email: true,
                mustChangePassword: true,
                createdAt: true
              }
            }
          }
        }
      }
    });

    if (!user) {
      return NextResponse.json(
        { error: "Пользователь не найден" }, 
        { status: 404 }
      );
    }

    // Возвращаем семью, где пользователь участник или админ
    const family = user.adminFamily || user.family;
    const isAdmin = user.adminFamily !== null;

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        isAdmin
      },
      family: family ? {
        id: family.id,
        name: family.name,
        inviteCode: family.inviteCode,
        members: family.members
      } : null
    });

  } catch (error) {
    console.error("❌ Ошибка получения семьи:", error);
    return NextResponse.json(
      { 
        error: "Ошибка получения семьи",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
}

// Добавить члена семьи (только для админа)
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" }, 
        { status: 401 }
      );
    }

    const userId = (session as any).user.id;
    const { name, role } = await request.json();

    if (!name || !role) {
      return NextResponse.json(
        { error: "Имя и роль обязательны" }, 
        { status: 400 }
      );
    }

    // Проверяем, что пользователь - админ семьи
    const admin = await prisma.user.findUnique({
      where: { id: userId },
      include: { adminFamily: true }
    });

    if (!admin || !admin.adminFamily) {
      return NextResponse.json(
        { error: "Только администратор семьи может добавлять членов" }, 
        { status: 403 }
      );
    }

    // Проверяем, не существует ли уже пользователь с таким именем в семье
    const existingMember = await prisma.user.findFirst({
      where: {
        name,
        familyId: admin.adminFamily.id
      }
    });

    if (existingMember) {
      return NextResponse.json(
        { error: "Член семьи с таким именем уже существует" }, 
        { status: 400 }
      );
    }

    // Генерируем временный пароль и токен для первого входа
    const tempPassword = `${name.toLowerCase()}${Math.floor(Math.random() * 999)}`;
    const hashedTempPassword = await hash(tempPassword, 10);
    const firstLoginToken = generateFirstLoginToken();

    // Создаем нового члена семьи
    const newMember = await prisma.user.create({
      data: {
        name,
        password: hashedTempPassword,
        tempPassword: firstLoginToken,
        role,
        familyId: admin.adminFamily.id,
        points: role === 'CHILD' ? 10 : 0,
        mustChangePassword: true,
        isEmailVerified: true
      }
    });

    // Генерируем ссылку для первого входа
    const baseUrl = process.env.NEXTAUTH_URL || 'https://family-stars.vercel.app';
    const firstLoginUrl = `${baseUrl}/first-login?token=${firstLoginToken}&user=${encodeURIComponent(name)}`;

    console.log(`✅ Создан член семьи: ${newMember.name} (${newMember.role}) в семье ${admin.adminFamily.name}`);

    return NextResponse.json({
      success: true,
      member: {
        id: newMember.id,
        name: newMember.name,
        role: newMember.role,
        points: newMember.points,
        tempPassword,
        firstLoginUrl
      },
      message: `Член семьи ${newMember.name} успешно добавлен`
    });

  } catch (error) {
    console.error("❌ Ошибка добавления члена семьи:", error);
    return NextResponse.json(
      { 
        error: "Ошибка добавления члена семьи",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 