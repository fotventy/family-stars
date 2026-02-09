import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { sendInviteEmail } from "@/lib/email";

export const dynamic = "force-dynamic";

function generateFirstLoginToken() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

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
                gender: true,
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
                gender: true,
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
    const { name, role, gender, email, locale } = await request.json();

    if (!name || !role || !gender) {
      return NextResponse.json(
        { error: "Имя, роль и пол обязательны" },
        { status: 400 }
      );
    }

    const emailStr = typeof email === "string" ? email.trim() || undefined : undefined;
    if (emailStr) {
      const existingByEmail = await prisma.user.findUnique({
        where: { email: emailStr },
      });
      if (existingByEmail) {
        return NextResponse.json(
          { error: "Пользователь с таким email уже зарегистрирован" },
          { status: 400 }
        );
      }
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

    const firstLoginToken = generateFirstLoginToken();
    const tokenExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 дней
    const hashedPassword = await hash(firstLoginToken, 10); // временный пароль не нужен, вход только по ссылке

    const newMember = await prisma.user.create({
      data: {
        name,
        email: emailStr ?? null,
        password: hashedPassword,
        tempPassword: firstLoginToken,
        tempPasswordExpiresAt: tokenExpiresAt,
        role,
        gender,
        familyId: admin.adminFamily.id,
        points: role === "CHILD" ? 10 : 0,
        mustChangePassword: true,
        isEmailVerified: false,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://family-stars.vercel.app";
    const firstLoginUrl = `${baseUrl}/first-login?token=${firstLoginToken}&user=${encodeURIComponent(name)}`;
    const expiresInDays = 7;

    const supportedLocales = ["en", "ru", "de", "fr", "it", "es", "zh", "pt", "ja", "ko"] as const;
    const inviteLocale = supportedLocales.includes(locale) ? locale : "en";

    let emailSent = false;
    if (emailStr) {
      const sendResult = await sendInviteEmail({
        to: emailStr,
        memberName: name,
        familyName: admin.adminFamily.name,
        firstLoginUrl,
        expiresInDays,
        locale: inviteLocale,
      });
      emailSent = sendResult.ok;
    }

    return NextResponse.json({
      success: true,
      member: {
        id: newMember.id,
        name: newMember.name,
        email: newMember.email,
        role: newMember.role,
        gender: newMember.gender,
        points: newMember.points,
        firstLoginUrl,
        linkExpiresAt: tokenExpiresAt.toISOString(),
        emailSent,
      },
      message: emailSent
        ? `Член семьи ${newMember.name} добавлен. Приглашение отправлено на ${emailStr}.`
        : `Член семьи ${newMember.name} добавлен. ${emailStr ? "Не удалось отправить письмо — скопируйте ссылку ниже и отправьте вручную." : "Отправьте ему ссылку для первого входа (можно указать email при добавлении — тогда приглашение уйдёт на почту)."} Ссылка действительна ${expiresInDays} дней.`,
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