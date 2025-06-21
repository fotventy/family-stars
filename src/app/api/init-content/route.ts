import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("📋 Инициализируем базовые задачи и подарки...");

    // Базовые задачи
    const baseTasks = [
      { title: "Убрать комнату", description: "Навести порядок", points: 15, emoji: "✨" },
      { title: "Сделать зарядку", description: "10 минут упражнений", points: 10, emoji: "💪" },
      { title: "Помыть посуду", description: "После обеда", points: 12, emoji: "🍽️" },
      { title: "Выучить стихотворение", description: "Наизусть", points: 20, emoji: "📖" },
      { title: "Помочь с готовкой", description: "Быть помощником", points: 15, emoji: "👨‍🍳" },
      { title: "Полить цветы", description: "Все растения дома", points: 8, emoji: "🌱" },
      { title: "Сделать домашнее задание", description: "Без напоминаний", points: 25, emoji: "📚" },
      { title: "Покормить питомца", description: "Вовремя", points: 10, emoji: "🐕" },
      { title: "Убрать игрушки", description: "На свои места", points: 10, emoji: "🧸" },
      { title: "Почистить зубы", description: "Утром и вечером", points: 5, emoji: "🦷" },
      { title: "Заправить кровать", description: "Аккуратно", points: 8, emoji: "🛏️" },
      { title: "Вынести мусор", description: "Без напоминаний", points: 12, emoji: "🗑️" },
    ];

    // Базовые подарки
    const baseGifts = [
      { title: "Час игры", description: "Дополнительный час игр", cost: 25, emoji: "🎮" },
      { title: "Сладость", description: "Любимая конфета", cost: 10, emoji: "🍬" },
      { title: "Поздний отбой", description: "На 30 минут позже", cost: 30, emoji: "😴" },
      { title: "Выбор фильма", description: "Семейный просмотр", cost: 20, emoji: "🎬" },
      { title: "Пицца на выбор", description: "Заказать любимую", cost: 50, emoji: "🍕" },
      { title: "Поход в кино", description: "С друзьями", cost: 100, emoji: "🎭" },
      { title: "Новая игрушка", description: "До 1000 рублей", cost: 150, emoji: "🎁" },
      { title: "День без уборки", description: "Выходной от дел", cost: 40, emoji: "🏖️" },
      { title: "Поход в парк", description: "Семейная прогулка", cost: 35, emoji: "🌳" },
      { title: "Мороженое", description: "Любое на выбор", cost: 15, emoji: "🍦" },
      { title: "Книга", description: "Новая интересная", cost: 80, emoji: "📚" },
      { title: "Поход в кафе", description: "С семьей", cost: 120, emoji: "☕" },
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