import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" }, 
        { status: 401 }
      );
    }

    let userGifts;
    
    if ((session as any).user.role === "PARENT") {
      // Родители видят все запросы на подарки от всех детей
      userGifts = await prisma.userGift.findMany({
        where: {
          user: {
            role: 'CHILD'
          }
        },
        include: {
          gift: true,
          user: true
        },
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Дети видят только свои запросы
      userGifts = await prisma.userGift.findMany({
      where: {
          userId: (session as any).user.id
      },
      include: {
        gift: true
        },
        orderBy: {
          createdAt: 'desc'
      }
    });
    }

    return NextResponse.json(userGifts);
  } catch (error) {
    console.error("Ошибка при загрузке выборов подарков:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json(
        { error: "Не авторизован" }, 
        { status: 401 }
      );
    }

    const { giftId } = await request.json();

    if (!giftId) {
      return NextResponse.json(
        { error: "ID подарка обязателен" }, 
        { status: 400 }
      );
    }

    // Только дети могут выбирать подарки
    if ((session as any).user.role !== "CHILD") {
      return NextResponse.json(
        { error: "Только дети могут выбирать подарки" }, 
        { status: 403 }
      );
    }

    // Проверяем, что подарок существует
    const gift = await prisma.gift.findUnique({
      where: { id: giftId }
    });

    if (!gift) {
      return NextResponse.json(
        { error: "Подарок не найден" }, 
        { status: 404 }
      );
    }

    // Проверяем, что у пользователя достаточно баллов
    const user = await prisma.user.findUnique({
      where: { id: (session as any).user.id }
    });

    if (!user || user.points < gift.points) {
      return NextResponse.json(
        { error: "Недостаточно баллов для выбора этого подарка" }, 
        { status: 400 }
      );
    }

    // Используем транзакцию для создания выбора и списания баллов
    const result = await prisma.$transaction(async (tx) => {
      // Создаем выбор подарка
      const userGift = await tx.userGift.create({
      data: {
        userId: (session as any).user.id,
        giftId: giftId,
        status: 'REQUESTED'
        },
        include: {
          gift: true
        }
      });

      // Списываем баллы у пользователя
      await tx.user.update({
        where: { id: (session as any).user.id },
        data: { points: { decrement: gift.points } }
      });

      return userGift;
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error("Ошибка при выборе подарка:", error);
    return NextResponse.json(
      { error: "Внутренняя ошибка сервера" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log(`🔄 PUT /api/user-gifts - сессия:`, session ? {
      id: (session as any).user.id,
      name: (session as any).user.name,
      role: (session as any).user.role
    } : 'нет сессии');
    
    if (!session || (session as any).user.role !== "PARENT") {
      console.log(`❌ Недостаточно прав: role = ${(session as any)?.user?.role}`);
      return NextResponse.json(
        { error: "Недостаточно прав" }, 
        { status: 403 }
      );
    }

    const { userGiftId, status } = await request.json();
    console.log(`📝 Данные запроса: userGiftId=${userGiftId}, status=${status}`);

    if (!userGiftId || !status) {
      console.log(`❌ Неполные данные: userGiftId=${userGiftId}, status=${status}`);
      return NextResponse.json(
        { error: "ID выбора и статус обязательны" }, 
        { status: 400 }
      );
    }

    if (!['APPROVED', 'REJECTED', 'REDEEMED'].includes(status)) {
      console.log(`❌ Неверный статус: ${status}`);
      return NextResponse.json(
        { error: "Неверный статус" }, 
        { status: 400 }
      );
    }

    // Проверяем, что выбор существует и принадлежит ребенку
    const userGift = await prisma.userGift.findUnique({
      where: { id: userGiftId },
      include: {
        user: true,
        gift: true
      }
    });

    console.log(`🔍 Найденный userGift:`, userGift ? {
      id: userGift.id,
      status: userGift.status,
      userId: userGift.userId,
      userName: userGift.user.name,
      userRole: userGift.user.role,
      giftTitle: userGift.gift.title
    } : 'не найден');

    if (!userGift) {
      console.log(`❌ Выбор подарка не найден`);
      return NextResponse.json(
        { error: "Выбор подарка не найден" }, 
        { status: 404 }
      );
    }

    // В семейной системе все родители могут управлять выборами всех детей
    if (userGift.user.role !== 'CHILD') {
      console.log(`❌ Выбор принадлежит не ребенку: ${userGift.user.role}`);
      return NextResponse.json(
        { error: "Можно управлять только выборами детей" }, 
        { status: 403 }
      );
    }

    console.log(`✅ Родитель ${(session as any).user.name} управляет выбором ребенка ${userGift.user.name}`);

    // Логика обновления баллов при смене статуса
    let updatedUser = null;
    
    if (status === 'APPROVED' && userGift.status === 'REQUESTED') {
      // При одобрении списываем баллы
      updatedUser = await prisma.user.update({
        where: { id: userGift.userId },
        data: {
          points: {
            decrement: userGift.gift.points
          }
        }
      });
      console.log(`💰 У ${userGift.user.name} списано ${userGift.gift.points} звёзд`);
    } else if (status === 'REJECTED' && userGift.status === 'APPROVED') {
      // При отклонении возвращаем баллы
      updatedUser = await prisma.user.update({
        where: { id: userGift.userId },
        data: {
          points: {
            increment: userGift.gift.points
          }
        }
      });
      console.log(`💰 ${userGift.user.name} вернули ${userGift.gift.points} звёзд`);
    }

    // Обновляем статус выбора
    const updatedUserGift = await prisma.userGift.update({
      where: { id: userGiftId },
      data: { status },
      include: {
        gift: true,
        user: true
      }
    });

    console.log(`✅ Статус выбора обновлен: ${userGift.status} → ${status}`);

    return NextResponse.json({
      success: true,
      userGift: updatedUserGift,
      updatedUser: updatedUser ? {
        id: updatedUser.id,
        name: updatedUser.name,
        points: updatedUser.points
      } : null
    });
  } catch (error) {
    console.error("❌ Ошибка при обновлении статуса выбора:", error);
    return NextResponse.json(
      { 
        error: "Внутренняя ошибка сервера",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 