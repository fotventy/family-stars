import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  // Создаем родителей
  const papa = await prisma.user.create({
    data: {
      name: 'Папа',
      password: await bcrypt.hash('papa2024', 10),
      role: 'PARENT',
      points: 0
    }
  });

  const mama = await prisma.user.create({
    data: {
      name: 'Мама',
      password: await bcrypt.hash('mama2024', 10),
      role: 'PARENT',
      points: 0
    }
  });

  // Создаем детей
  const children = [
    { name: 'Назар', password: 'nazar2024' },
    { name: 'Влад', password: 'vlad2024' },
    { name: 'Никита', password: 'nikita2024' }
  ];

  const childUsers = await Promise.all(
    children.map(async (child) => {
      return prisma.user.create({
        data: {
          name: child.name,
          password: await bcrypt.hash(child.password, 10),
          role: 'CHILD',
          parentId: papa.id,
          points: 50 // Начальные баллы для тестирования
        }
      });
    })
  );

  // Создаем интересные задачи для детей
  const tasks = [
    { title: 'Сделать зарядку', description: '10 минут утренней зарядки 💪', points: 10 },
    { title: 'Убрать свою комнату', description: 'Навести порядок в своей комнате 🧹', points: 15 },
    { title: 'Помыть посуду', description: 'Помыть посуду после ужина 🍽️', points: 12 },
    { title: 'Сделать домашнее задание', description: 'Выполнить все уроки на завтра 📚', points: 20 },
    { title: 'Почистить зубы', description: 'Утром и вечером почистить зубы 🦷', points: 5 },
    { title: 'Заправить кровать', description: 'Заправить свою кровать с утра 🛏️', points: 8 },
    { title: 'Вынести мусор', description: 'Вынести мусор из дома 🗑️', points: 10 },
    { title: 'Помочь маме с готовкой', description: 'Помочь маме приготовить обед 👩‍🍳', points: 15 },
    { title: 'Полить цветы', description: 'Полить все цветы в доме 🌱', points: 8 },
    { title: 'Прочитать книгу', description: 'Прочитать минимум 30 минут 📖', points: 18 }
  ];

  await prisma.task.createMany({
    data: tasks
  });

  // Создаем крутые призы для детей (современные и интересные)
  const gifts = [
    { title: 'Час игры в Fortnite', description: 'Дополнительный час игры в любимую игру 🎮', points: 25 },
    { title: 'Час игры в Minecraft', description: 'Строй и исследуй целый час без ограничений ⛏️', points: 25 },
    { title: 'Час на YouTube', description: 'Смотри любимых блогеров целый час 📺', points: 20 },
    { title: 'Чупа-чупс', description: 'Вкусная леденцовая конфета 🍭', points: 10 },
    { title: 'Кока-кола', description: 'Баночка любимой газировки 🥤', points: 15 },
    { title: 'Пицца на выбор', description: 'Закажем любимую пиццу 🍕', points: 80 },
    { title: 'Поход в кино', description: 'Билет на новый фильм в кинотеатре 🎬', points: 100 },
    { title: 'Новая игра для телефона', description: 'Покупка игры в App Store или Google Play 📱', points: 60 },
    { title: 'Лего набор', description: 'Новый набор Лего на выбор 🧱', points: 150 },
    { title: 'Поздний отбой', description: 'Можешь лечь спать на час позже 😴', points: 30 },
    { title: 'Выбор фильма на вечер', description: 'Ты выбираешь фильм для всей семьи 🎥', points: 20 },
    { title: 'Макдоналдс', description: 'Поход в Макдоналдс с любимым меню 🍟', points: 70 },
    { title: 'Новые наушники', description: 'Крутые беспроводные наушники 🎧', points: 200 },
    { title: 'Игровая мышка', description: 'Крутая геймерская мышка 🖱️', points: 120 },
    { title: 'Поход в аквапарк', description: 'Целый день развлечений в аквапарке 🏊‍♂️', points: 250 }
  ];

  await prisma.gift.createMany({
    data: gifts
  });

  console.log('✅ База данных успешно заполнена тестовыми данными!');
  console.log('👨‍💼 Родители: Папа/papa2024, Мама/mama2024');
  console.log('👦 Дети: Назар/nazar2024, Влад/vlad2024, Никита/nikita2024');
  console.log('🌟 У каждого ребенка есть 50 стартовых звёзд для тестирования');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

export {}; 