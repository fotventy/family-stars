import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { getDefaultTasks, getDefaultGifts } from "@/lib/defaultTasksAndGifts";

function generateInviteCode() {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
}

export async function POST(request: Request) {
  try {
    const { email, familyName, parentName, parentType, password: rawPassword, locale } = await request.json();

    if (!email || !familyName || !parentName || !parentType) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }
    if (!rawPassword || typeof rawPassword !== "string" || rawPassword.length < 6 || rawPassword.length > 128) {
      return NextResponse.json(
        { error: "Password must be 6 to 128 characters" },
        { status: 400 }
      );
    }

    // Check if user with this email already exists
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUserByEmail) {
      return NextResponse.json(
        { error: "User with this email already exists" }, 
        { status: 400 }
      );
    }

    const hashedPassword = await hash(rawPassword, 10);
    const inviteCode = generateInviteCode();
    const gender = parentType === "мама" || String(parentType).toLowerCase() === "mom" ? "mom" : "dad";

    const admin = await prisma.user.create({
      data: {
        name: parentName,
        email,
        password: hashedPassword,
        role: "FAMILY_ADMIN",
        points: 0,
        mustChangePassword: false,
        isEmailVerified: false,
        gender,
      },
    });

    // Create family
    const family = await prisma.family.create({
      data: {
        name: familyName,
        inviteCode,
        adminId: admin.id
      }
    });

    // Link admin to family
    await prisma.user.update({
      where: { id: admin.id },
      data: { familyId: family.id }
    });

    // Create default tasks and gifts for the new family (any app locale; fallback en)
    const lang = typeof locale === "string" ? locale : "en";
    const defaultTasks = getDefaultTasks(lang);
    const defaultGifts = getDefaultGifts(lang);

    await prisma.task.createMany({
      data: defaultTasks.map((t, i) => ({
        familyId: family.id,
        title: t.title,
        description: t.description,
        points: t.points,
        emoji: t.emoji ?? null,
        sortOrder: i,
        isActive: true,
      })),
    });
    await prisma.gift.createMany({
      data: defaultGifts.map((g, i) => ({
        familyId: family.id,
        title: g.title,
        description: g.description,
        points: g.points,
        emoji: g.emoji ?? null,
        sortOrder: i,
        isActive: true,
      })),
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://family-stars.vercel.app";
    const payload: Record<string, unknown> = {
      success: true,
      message: `Family "${familyName}" created successfully!`,
      parentName,
      parentType,
      loginUrl: `${baseUrl}/login`,
      familyCode: inviteCode,
      messageDetail: "Sign in on the login page using the family code and the password you set.",
    };

    return NextResponse.json(payload);

  } catch (error) {
    console.error("Family registration error:", error);
    const details = error instanceof Error ? error.message : String(error);
    const isUniqueName = /Unique constraint.*[\"']?name[\"']?/i.test(details) || /unique.*name/i.test(details);
    const isUniqueEmail = /Unique constraint.*[\"']?email[\"']?/i.test(details) || /unique.*email/i.test(details);
    let userError = "Family registration failed";
    if (isUniqueName) {
      userError = "A user with this name is already registered. Use a unique name (e.g. Mom Maria or Dad Alex).";
    } else if (isUniqueEmail) {
      userError = "User with this email already exists";
    } else if (details) {
      userError = details;
    }
    return NextResponse.json(
      { error: userError, details },
      { status: 500 }
    );
  }
} 