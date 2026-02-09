/**
 * Default tasks and gifts per locale. Created for each new family on registration.
 */

export type DefaultTask = { title: string; description: string; points: number; emoji?: string };
export type DefaultGift = { title: string; description: string; points: number; emoji?: string };

const TASKS_RU: DefaultTask[] = [
  { title: "Заправить кровать", description: "Заправить свою кровать с утра", points: 8, emoji: "🛏️" },
  { title: "Сделать зарядку", description: "10 минут утренней зарядки", points: 10, emoji: "💪" },
  { title: "Почистить зубы", description: "Утром и вечером почистить зубы", points: 5, emoji: "🦷" },
  { title: "Убрать свою комнату", description: "Навести порядок в своей комнате", points: 15, emoji: "🧹" },
  { title: "Сделать домашнее задание", description: "Выполнить все уроки на завтра", points: 20, emoji: "📚" },
  { title: "Помыть посуду", description: "Помыть посуду после ужина", points: 12, emoji: "🍽️" },
  { title: "Вынести мусор", description: "Вынести мусор из дома", points: 10, emoji: "🗑️" },
  { title: "Помочь маме с готовкой", description: "Помочь маме приготовить обед", points: 30, emoji: "👩‍🍳" },
  { title: "Сходить в магазин", description: "Нужно что-то купить? Сходи в магазин", points: 20, emoji: "🛒" },
  { title: "Полить цветы", description: "Полить все цветы в доме", points: 8, emoji: "🌱" },
  { title: "Прочитать книгу", description: "Прочитать минимум 30 минут", points: 18, emoji: "📖" },
];

const GIFTS_RU: DefaultGift[] = [
  { title: "Чупа-чупс", description: "Вкусная леденцовая конфета", points: 10, emoji: "🍭" },
  { title: "Кока-кола", description: "Баночка любимой газировки", points: 15, emoji: "🥤" },
  { title: "Час на YouTube", description: "Смотри любимых блогеров", points: 20, emoji: "📺" },
  { title: "Выбор фильма на вечер", description: "Ты выбираешь фильм для всей семьи", points: 25, emoji: "🎥" },
  { title: "Час игры в Fortnite", description: "Дополнительный час игры", points: 30, emoji: "🎮" },
  { title: "Час игры в Minecraft", description: "Строй и исследуй целый час", points: 30, emoji: "⛏️" },
  { title: "Поздний отбой", description: "Можешь лечь спать на час позже", points: 25, emoji: "😴" },
  { title: "Новая игра для телефона", description: "Покупка игры в App Store или Google Play", points: 60, emoji: "📱" },
  { title: "Макдоналдс", description: "Поход в Макдоналдс с любимым меню", points: 70, emoji: "🍟" },
  { title: "Пицца на выбор", description: "Закажем любимую пиццу", points: 80, emoji: "🍕" },
  { title: "Поход в кино", description: "Билет на новый фильм в кинотеатре", points: 100, emoji: "🎬" },
  { title: "Игровая мышка", description: "Крутая геймерская мышка", points: 250, emoji: "🖱️" },
  { title: "Новые наушники", description: "Крутые беспроводные наушники", points: 1000, emoji: "🎧" },
  { title: "Поход в аквапарк", description: "Целый день развлечений в аквапарке", points: 2000, emoji: "🏊‍♂️" },
];

const TASKS_EN: DefaultTask[] = [
  { title: "Make the bed", description: "Make your bed in the morning", points: 8, emoji: "🛏️" },
  { title: "Do morning exercises", description: "10 minutes of morning exercise", points: 10, emoji: "💪" },
  { title: "Brush teeth", description: "Brush teeth morning and evening", points: 5, emoji: "🦷" },
  { title: "Clean your room", description: "Tidy up your room", points: 15, emoji: "🧹" },
  { title: "Do homework", description: "Complete all lessons for tomorrow", points: 20, emoji: "📚" },
  { title: "Wash dishes", description: "Wash dishes after dinner", points: 12, emoji: "🍽️" },
  { title: "Take out the trash", description: "Take out the trash from home", points: 10, emoji: "🗑️" },
  { title: "Help mom with cooking", description: "Help mom prepare lunch", points: 30, emoji: "👩‍🍳" },
  { title: "Go to the store", description: "Need to buy something? Go to the store", points: 20, emoji: "🛒" },
  { title: "Water the plants", description: "Water all the plants at home", points: 8, emoji: "🌱" },
  { title: "Read a book", description: "Read for at least 30 minutes", points: 18, emoji: "📖" },
];

const GIFTS_EN: DefaultGift[] = [
  { title: "Lollipop", description: "A tasty lollipop", points: 10, emoji: "🍭" },
  { title: "Soda", description: "A can of your favorite soda", points: 15, emoji: "🥤" },
  { title: "Hour on YouTube", description: "Watch your favorite YouTubers", points: 20, emoji: "📺" },
  { title: "Movie choice for the evening", description: "You choose the movie for the family", points: 25, emoji: "🎥" },
  { title: "Hour of Fortnite", description: "Extra hour of gaming", points: 30, emoji: "🎮" },
  { title: "Hour of Minecraft", description: "Build and explore for an hour", points: 30, emoji: "⛏️" },
  { title: "Late bedtime", description: "Stay up an hour later", points: 25, emoji: "😴" },
  { title: "New mobile game", description: "Buy a game on App Store or Google Play", points: 60, emoji: "📱" },
  { title: "McDonald's", description: "Trip to McDonald's with your favorite menu", points: 70, emoji: "🍟" },
  { title: "Pizza of choice", description: "Order your favorite pizza", points: 80, emoji: "🍕" },
  { title: "Trip to the cinema", description: "Ticket to a new movie", points: 100, emoji: "🎬" },
  { title: "Gaming mouse", description: "Cool gaming mouse", points: 250, emoji: "🖱️" },
  { title: "New headphones", description: "Cool wireless headphones", points: 1000, emoji: "🎧" },
  { title: "Trip to the water park", description: "A full day at the water park", points: 2000, emoji: "🏊‍♂️" },
];

const TASKS_BY_LOCALE: Record<string, DefaultTask[]> = {
  ru: TASKS_RU,
  en: TASKS_EN,
};
const GIFTS_BY_LOCALE: Record<string, DefaultGift[]> = {
  ru: GIFTS_RU,
  en: GIFTS_EN,
};

export function getDefaultTasks(locale: string): DefaultTask[] {
  return TASKS_BY_LOCALE[locale] ?? TASKS_BY_LOCALE.ru ?? TASKS_RU;
}

export function getDefaultGifts(locale: string): DefaultGift[] {
  return GIFTS_BY_LOCALE[locale] ?? GIFTS_BY_LOCALE.ru ?? GIFTS_RU;
}
