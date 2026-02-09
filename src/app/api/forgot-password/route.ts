import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/email";

const RESET_TTL_MS = 60 * 60 * 1000; // 1 hour

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const normalizedEmail = email.trim().toLowerCase();
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Always return success to avoid leaking whether email exists
    if (!user) {
      return NextResponse.json({
        success: true,
        message: "If an account exists with this email, you will receive a password reset link.",
      });
    }

    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    const expiresAt = new Date(Date.now() + RESET_TTL_MS);

    await prisma.user.update({
      where: { id: user.id },
      data: {
        tempPassword: token,
        tempPasswordExpiresAt: expiresAt,
        mustChangePassword: true,
      },
    });

    const baseUrl = process.env.NEXTAUTH_URL || "https://family-stars.vercel.app";
    const resetUrl = `${baseUrl}/first-login?token=${token}&user=${encodeURIComponent(user.name)}`;

    const result = await sendPasswordResetEmail({
      to: normalizedEmail,
      userName: user.name,
      resetUrl,
    });

    if (!result.ok) {
      console.error("Forgot password email failed:", result.error);
      return NextResponse.json(
        { error: "Failed to send email. Try again later." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "If an account exists with this email, you will receive a password reset link.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}
