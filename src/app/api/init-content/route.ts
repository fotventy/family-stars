import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function POST(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  try {
    console.log("📋 Инициализируем базовые задачи и подарки...");

    // Базовые задачи (утренние задачи в начале)
    const baseTasks = [
      { title: 'Заправить кровать', description: 'Заправить свою кровать с утра 🛏️', points: 8, emoji: '🛏️' },
      { title: 'Сделать зарядку', description: '10 минут утренней зарядки 💪', points: 10, emoji: '💪' },
      { title: 'Почистить зубы', description: 'Утром и вечером почистить зубы 🦷', points: 5, emoji: '🦷' },
      { title: 'Убрать свою комнату', description: 'Навести порядок в своей комнате 🧹', points: 15, emoji: '🧹' },
      { title: 'Сделать домашнее задание', description: 'Выполнить все уроки на завтра 📚', points: 20, emoji: '📚' },
      { title: 'Помыть посуду', description: 'Помыть посуду после ужина 🍽️', points: 12, emoji: '🍽️' },
      { title: 'Вынести мусор', description: 'Вынести мусор из дома 🗑️', points: 10, emoji: '🗑️' },
      { title: 'Помочь маме с готовкой', description: 'Помочь маме приготовить обед 👩‍🍳', points: 15, emoji: '👩‍🍳' }
    ];

    // Базовые подарки (отсортированы по цене)
    const baseGifts = [
      { title: 'Чупа-чупс', description: 'Вкусная леденцовая конфета 🍭', cost: 10, emoji: '🍭' },
      { title: 'Кока-кола', description: 'Баночка любимой газировки 🥤', cost: 15, emoji: '🥤' },
      { title: 'Час на YouTube', description: 'Смотри любимых блогеров целый час 📺', cost: 20, emoji: '📺' },
      { title: 'Выбор фильма на вечер', description: 'Ты выбираешь фильм для всей семьи 🎥', cost: 20, emoji: '🎥' },
      { title: 'Час игры в Fortnite', description: 'Дополнительный час игры в любимую игру 🎮', cost: 25, emoji: '🎮' },
      { title: 'Час игры в Minecraft', description: 'Строй и исследуй целый час без ограничений ⛏️', cost: 25, emoji: '🎮' },
      { title: 'Поздний отбой', description: 'Можешь лечь спать на час позже 😴', cost: 30, emoji: '😴' },
      { title: 'Новая игра для телефона', description: 'Покупка игры в App Store или Google Play 📱', cost: 60, emoji: '📱' },
      { title: 'Макдоналдс', description: 'Поход в Макдоналдс с любимым меню 🍟', cost: 70, emoji: '🍟' },
      { title: 'Пицца на выбор', description: 'Закажем любимую пиццу 🍕', cost: 80, emoji: '🍕' },
      { title: 'Поход в кино', description: 'Билет на новый фильм в кинотеатре 🎬', cost: 100, emoji: '🎬' },
      { title: 'Игровая мышка', description: 'Крутая геймерская мышка 🖱️', cost: 120, emoji: '🖱️' },
      { title: 'Лего набор', description: 'Новый набор Лего на выбор 🧱', cost: 150, emoji: '🧱' },
      { title: 'Новые наушники', description: 'Крутые беспроводные наушники 🎧', cost: 200, emoji: '🎧' },
      { title: 'Поход в аквапарк', description: 'Целый день развлечений в аквапарке 🏊‍♂️', cost: 250, emoji: '🏊‍♂️' }
    ];

    const createdTasks = [];
    const createdGifts = [];
    const existingTasks = [];
    const existingGifts = [];

    // Создаем задачи
    for (const taskData of baseTasks) {
      try {
        const existingTask = await prisma.task.findFirst({
          where: { title: taskData.title }
        });

        if (existingTask) {
          existingTasks.push(taskData.title);
          continue;
        }

        const newTask = await prisma.task.create({
          data: {
            title: taskData.title,
            description: taskData.description,
            points: taskData.points,
          }
        });

        createdTasks.push({
          title: newTask.title,
          points: newTask.points,
          emoji: taskData.emoji
        });

      } catch (error) {
        console.error(`❌ Ошибка создания задачи ${taskData.title}:`, error);
      }
    }

    // Создаем подарки
    for (const giftData of baseGifts) {
      try {
        const existingGift = await prisma.gift.findFirst({
          where: { title: giftData.title }
        });

        if (existingGift) {
          existingGifts.push(giftData.title);
          continue;
        }

        const newGift = await prisma.gift.create({
          data: {
            title: giftData.title,
            description: giftData.description,
            points: giftData.cost,
          }
        });

        createdGifts.push({
          title: newGift.title,
          cost: newGift.points,
          emoji: giftData.emoji
        });

      } catch (error) {
        console.error(`❌ Ошибка создания подарка ${giftData.title}:`, error);
      }
    }

    // Получаем общее количество
    const totalTasks = await prisma.task.count();
    const totalGifts = await prisma.gift.count();

    console.log(`🎉 Инициализация контента завершена!`);
    console.log(`📊 Создано задач: ${createdTasks.length}`);
    console.log(`📊 Создано подарков: ${createdGifts.length}`);
    console.log(`📊 Всего задач: ${totalTasks}`);
    console.log(`📊 Всего подарков: ${totalGifts}`);

    return NextResponse.json({
      success: true,
      message: `Контент инициализирован! Создано ${createdTasks.length} задач и ${createdGifts.length} подарков`,
      statistics: {
        createdTasks: createdTasks.length,
        createdGifts: createdGifts.length,
        existingTasks: existingTasks.length,
        existingGifts: existingGifts.length,
        totalTasks,
        totalGifts
      },
      createdTasks,
      createdGifts,
      existingTasks,
      existingGifts
    });

  } catch (error) {
    console.error("❌ Ошибка инициализации контента:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Ошибка инициализации контента",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 