import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("🔄 Очищаем и пересоздаем контент...");

    // Удаляем все старые задачи и подарки
    await prisma.userTask.deleteMany({});
    await prisma.userGift.deleteMany({});
    await prisma.task.deleteMany({});
    await prisma.gift.deleteMany({});

    console.log("🗑️ Старый контент удален");

    // Базовые задачи (из оригинального seed.ts)
    const baseTasks = [
      { title: 'Сделать зарядку', description: '10 минут утренней зарядки 💪', points: 10, emoji: '💪' },
      { title: 'Убрать свою комнату', description: 'Навести порядок в своей комнате 🧹', points: 15, emoji: '🧹' },
      { title: 'Помыть посуду', description: 'Помыть посуду после ужина 🍽️', points: 12, emoji: '🍽️' },
      { title: 'Сделать домашнее задание', description: 'Выполнить все уроки на завтра 📚', points: 20, emoji: '📚' },
      { title: 'Почистить зубы', description: 'Утром и вечером почистить зубы 🦷', points: 5, emoji: '🦷' },
      { title: 'Заправить кровать', description: 'Заправить свою кровать с утра 🛏️', points: 8, emoji: '🛏️' },
      { title: 'Вынести мусор', description: 'Вынести мусор из дома 🗑️', points: 10, emoji: '🗑️' },
      { title: 'Помочь маме с готовкой', description: 'Помочь маме приготовить обед 👩‍🍳', points: 15, emoji: '👩‍🍳' },
      { title: 'Полить цветы', description: 'Полить все цветы в доме 🌱', points: 8, emoji: '🌱' },
      { title: 'Прочитать книгу', description: 'Прочитать минимум 30 минут 📖', points: 18, emoji: '📖' }
    ];

    // Базовые подарки (из оригинального seed.ts)
    const baseGifts = [
      { title: 'Час игры в Fortnite', description: 'Дополнительный час игры в любимую игру 🎮', points: 25, emoji: '🎮' },
      { title: 'Час игры в Minecraft', description: 'Строй и исследуй целый час без ограничений ⛏️', points: 25, emoji: '🎮' },
      { title: 'Час на YouTube', description: 'Смотри любимых блогеров целый час 📺', points: 20, emoji: '📺' },
      { title: 'Чупа-чупс', description: 'Вкусная леденцовая конфета 🍭', points: 10, emoji: '🍭' },
      { title: 'Кока-кола', description: 'Баночка любимой газировки 🥤', points: 15, emoji: '🥤' },
      { title: 'Пицца на выбор', description: 'Закажем любимую пиццу 🍕', points: 80, emoji: '🍕' },
      { title: 'Поход в кино', description: 'Билет на новый фильм в кинотеатре 🎬', points: 100, emoji: '🎬' },
      { title: 'Новая игра для телефона', description: 'Покупка игры в App Store или Google Play 📱', points: 60, emoji: '📱' },
      { title: 'Лего набор', description: 'Новый набор Лего на выбор 🧱', points: 150, emoji: '🧱' },
      { title: 'Поздний отбой', description: 'Можешь лечь спать на час позже 😴', points: 30, emoji: '😴' },
      { title: 'Выбор фильма на вечер', description: 'Ты выбираешь фильм для всей семьи 🎥', points: 20, emoji: '🎥' },
      { title: 'Макдоналдс', description: 'Поход в Макдоналдс с любимым меню 🍟', points: 70, emoji: '🍟' },
      { title: 'Новые наушники', description: 'Крутые беспроводные наушники 🎧', points: 200, emoji: '🎧' },
      { title: 'Игровая мышка', description: 'Крутая геймерская мышка 🖱️', points: 120, emoji: '🖱️' },
      { title: 'Поход в аквапарк', description: 'Целый день развлечений в аквапарке 🏊‍♂️', points: 250, emoji: '🏊‍♂️' }
    ];

    // Создаем задачи
    await prisma.task.createMany({
      data: baseTasks.map(task => ({
        title: task.title,
        description: task.description,
        points: task.points
      }))
    });

    // Создаем подарки
    await prisma.gift.createMany({
      data: baseGifts.map(gift => ({
        title: gift.title,
        description: gift.description,
        points: gift.points
      }))
    });

    // Получаем общее количество
    const totalTasks = await prisma.task.count();
    const totalGifts = await prisma.gift.count();

    console.log(`🎉 Контент пересоздан!`);
    console.log(`📊 Создано задач: ${totalTasks}`);
    console.log(`📊 Создано подарков: ${totalGifts}`);

    return NextResponse.json({
      success: true,
      message: `Контент успешно пересоздан! ${totalTasks} задач и ${totalGifts} подарков`,
      statistics: {
        tasks: totalTasks,
        gifts: totalGifts
      }
    });

  } catch (error) {
    console.error("❌ Ошибка пересоздания контента:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Ошибка пересоздания контента",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 