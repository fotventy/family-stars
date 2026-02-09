import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { getDefaultTasks, getDefaultGifts } from "@/lib/defaultTasksAndGifts";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (
      !session ||
      ((session as any).user.role !== "PARENT" && (session as any).user.role !== "FAMILY_ADMIN")
    ) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const familyId = (session as any).user.familyId as string | undefined;
    if (!familyId) {
      return NextResponse.json({ error: "No family" }, { status: 400 });
    }

    const { locale } = await request.json().catch(() => ({}));
    const lang = typeof locale === "string" ? locale : "en";

    const [existingTasks, existingGifts] = await Promise.all([
      prisma.task.count({ where: { familyId } }),
      prisma.gift.count({ where: { familyId } }),
    ]);

    if (existingTasks > 0 && existingGifts > 0) {
      return NextResponse.json({ success: true, seeded: false, message: "Already has tasks and gifts" });
    }

    const defaultTasks = getDefaultTasks(lang);
    const defaultGifts = getDefaultGifts(lang);

    if (existingTasks === 0) {
      await prisma.task.createMany({
        data: defaultTasks.map((t, i) => ({
          familyId,
          title: t.title,
          description: t.description,
          points: t.points,
          emoji: t.emoji ?? null,
          sortOrder: i,
          isActive: true,
        })),
      });
    }
    if (existingGifts === 0) {
      await prisma.gift.createMany({
        data: defaultGifts.map((g, i) => ({
          familyId,
          title: g.title,
          description: g.description,
          points: g.points,
          emoji: g.emoji ?? null,
          sortOrder: i,
          isActive: true,
        })),
      });
    }

    return NextResponse.json({ success: true, seeded: true });
  } catch (error) {
    console.error("Seed defaults error:", error);
    return NextResponse.json({ error: "Seed failed" }, { status: 500 });
  }
}
