import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/** GET — ad-free subscription status for current user's family */
export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { familyId: true, adminFamily: true },
    });

    const familyId = user?.familyId ?? user?.adminFamily?.id;
    if (!familyId) {
      return NextResponse.json({
        premium: false,
        premiumUntil: null,
        message: "No family linked",
      });
    }

    const family = await prisma.family.findUnique({
      where: { id: familyId },
      select: { premiumUntil: true },
    });

    const premiumUntil = family?.premiumUntil ?? null;
    const premium = premiumUntil ? new Date(premiumUntil) > new Date() : false;

    return NextResponse.json({
      premium,
      premiumUntil: premiumUntil?.toISOString() ?? null,
    });
  } catch (e) {
    console.error("subscription GET", e);
    return NextResponse.json(
      { error: "Error fetching subscription status" },
      { status: 500 }
    );
  }
}

/**
 * POST — set subscription for family (called after successful in-app purchase).
 * In production, verify receipt with Google Play / App Store API.
 */
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Not authorized" }, { status: 401 });
    }

    const userId = (session as any).user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: { adminFamily: true, family: true },
    });

    const family = user?.adminFamily ?? user?.family;
    if (!family) {
      return NextResponse.json(
        { error: "No family linked" },
        { status: 400 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { durationMonths = 1 } = body;

    // TODO: verify purchaseToken via Google Play / App Store API; for now use X-Subscription-Secret header
    const secret = process.env.SUBSCRIPTION_VERIFICATION_SECRET;
    const providedSecret = request.headers.get("X-Subscription-Secret");
    if (!secret || providedSecret !== secret) {
      return NextResponse.json(
        { error: "Purchase verification failed" },
        { status: 403 }
      );
    }

    const current = await prisma.family.findUnique({
      where: { id: family.id },
      select: { premiumUntil: true },
    });
    const now = new Date();
    const addEnd = new Date(now);
    addEnd.setMonth(addEnd.getMonth() + (durationMonths || 1));
    const existingEnd = current?.premiumUntil ? new Date(current.premiumUntil) : null;
    const until =
      existingEnd && existingEnd > now
        ? new Date(Math.max(addEnd.getTime(), existingEnd.getTime()))
        : addEnd;

    await prisma.family.update({
      where: { id: family.id },
      data: { premiumUntil: until },
    });

    return NextResponse.json({
      success: true,
      premiumUntil: until.toISOString(),
      message: "Ad-free subscription activated",
    });
  } catch (e) {
    console.error("subscription POST", e);
    return NextResponse.json(
      { error: "Error activating subscription" },
      { status: 500 }
    );
  }
}
