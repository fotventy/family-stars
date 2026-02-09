import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      ((session as any).user.role !== "PARENT" &&
        (session as any).user.role !== "FAMILY_ADMIN")
    ) {
      return NextResponse.json(
        { error: "Недостаточно прав" },
        { status: 403 }
      );
    }

    const familyId = (session as any).user.familyId as string | undefined;
    const { searchParams } = new URL(request.url);
    const period = searchParams.get("period") || "week";

    const startDate = new Date();
    if (period === "week") {
      startDate.setDate(startDate.getDate() - 7);
    } else {
      startDate.setMonth(startDate.getMonth() - 1);
    }

    const childrenWhere: { role: string; familyId?: string | null } = {
      role: "CHILD",
    };
    if (familyId) {
      childrenWhere.familyId = familyId;
    }
    const children = await prisma.user.findMany({
      where: childrenWhere,
    });

    const statistics = await Promise.all(children.map(async (child) => {
      const completedTasks = await prisma.userTask.findMany({
        where: {
          userId: child.id,
          status: 'COMPLETED',
          createdAt: { gte: startDate }
        },
        include: { task: true }
      });

      const redeemedGifts = await prisma.userGift.findMany({
        where: {
          userId: child.id,
          status: 'REDEEMED',
          createdAt: { gte: startDate }
        }
      });

      return {
        userId: child.id,
        userName: child.name,
        tasksCompleted: completedTasks.length,
        pointsEarned: completedTasks.reduce((sum, task) => sum + task.task.points, 0),
        giftsRedeemed: redeemedGifts.length
      };
    }));

    return NextResponse.json(statistics);
  } catch (error) {
    console.error("Ошибка при получении статистики:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
} 