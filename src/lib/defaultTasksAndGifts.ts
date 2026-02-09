/**
 * Default tasks and gifts per locale. Source: db_export (RU); translated to all app locales.
 * Written into Task and Gift tables (with familyId) when a family is created (register-family)
 * or when an existing family has no tasks/gifts (seed-defaults API).
 */

export type DefaultTask = { title: string; description: string; points: number; emoji?: string };
export type DefaultGift = { title: string; description: string; points: number; emoji?: string };

// ——— RU (from db_export) ———
const TASKS_RU: DefaultTask[] = [
  { title: "Заправить кровать", description: "Заправить свою кровать с утра 🛏️", points: 8, emoji: "🛏️" },
  { title: "Сделать зарядку", description: "10 минут утренней зарядки 💪", points: 10, emoji: "💪" },
  { title: "Почистить зубы", description: "Утром и вечером почистить зубы 🦷", points: 5, emoji: "🦷" },
  { title: "Убрать свою комнату", description: "Навести порядок в своей комнате 🧹", points: 15, emoji: "🧹" },
  { title: "Помыть посуду", description: "Помыть посуду после ужина 🍽️", points: 12, emoji: "🍽️" },
  { title: "Сделать домашнее задание", description: "Выполнить все уроки на завтра 📚", points: 20, emoji: "📚" },
  { title: "Сходить в магазин", description: "Нужно что-то купить? Возьми деньги и запиши (ОБЯЗАТЕЛЬНО, а то забудешь), что нужно купить", points: 20, emoji: "🛒" },
  { title: "Вынести мусор", description: "Вынести мусор из дома 🗑️", points: 10, emoji: "🗑️" },
  { title: "Помочь маме с готовкой", description: "Помочь маме приготовить обед 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_RU: DefaultGift[] = [
  { title: "Чупа-чупс", description: "Вкусная леденцовая конфета 🍭", points: 10, emoji: "🍭" },
  { title: "Кока-кола", description: "Баночка любимой газировки 🥤", points: 15, emoji: "🥤" },
  { title: "Выбор фильма на вечер", description: "Ты выбираешь фильм для всей семьи 🎥", points: 20, emoji: "🎥" },
  { title: "Час на YouTube", description: "Смотри любимых блогеров целый час 📺", points: 20, emoji: "📺" },
  { title: "Час игры в Minecraft", description: "Строй и исследуй целый час без ограничений ⛏️", points: 25, emoji: "⛏️" },
  { title: "Час игры в Fortnite", description: "Дополнительный час игры в любимую игру 🎮", points: 25, emoji: "🎮" },
  { title: "Новая игра для телефона", description: "Покупка игры в App Store или Google Play 📱", points: 60, emoji: "📱" },
  { title: "Поздний отбой", description: "Можешь лечь спать на час позже 😴", points: 30, emoji: "😴" },
  { title: "Макдоналдс", description: "Поход в Макдоналдс с любимым меню 🍟", points: 70, emoji: "🍟" },
  { title: "Пицца на выбор", description: "Закажем любимую пиццу 🍕", points: 80, emoji: "🍕" },
  { title: "Поход в кино", description: "Билет на новый фильм в кинотеатре 🎬", points: 100, emoji: "🎬" },
  { title: "Поход в аквапарк", description: "Целый день развлечений в аквапарке 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "Игровая мышка", description: "Крутая геймерская мышка 🖱️", points: 1000, emoji: "🖱️" },
  { title: "Новые наушники", description: "Крутые беспроводные наушники 🎧", points: 2000, emoji: "🎧" },
];

// ——— EN ———
const TASKS_EN: DefaultTask[] = [
  { title: "Make the bed", description: "Make your bed in the morning 🛏️", points: 8, emoji: "🛏️" },
  { title: "Do morning exercises", description: "10 minutes of morning exercise 💪", points: 10, emoji: "💪" },
  { title: "Brush teeth", description: "Brush teeth morning and evening 🦷", points: 5, emoji: "🦷" },
  { title: "Clean your room", description: "Tidy up your room 🧹", points: 15, emoji: "🧹" },
  { title: "Wash dishes", description: "Wash dishes after dinner 🍽️", points: 12, emoji: "🍽️" },
  { title: "Do homework", description: "Complete all lessons for tomorrow 📚", points: 20, emoji: "📚" },
  { title: "Go to the store", description: "Need to buy something? Take money and write down (MUST, or you'll forget) what to buy", points: 20, emoji: "🛒" },
  { title: "Take out the trash", description: "Take out the trash from home 🗑️", points: 10, emoji: "🗑️" },
  { title: "Help mom with cooking", description: "Help mom prepare lunch 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_EN: DefaultGift[] = [
  { title: "Lollipop", description: "A tasty lollipop 🍭", points: 10, emoji: "🍭" },
  { title: "Soda", description: "A can of your favorite soda 🥤", points: 15, emoji: "🥤" },
  { title: "Movie choice for the evening", description: "You choose the movie for the family 🎥", points: 20, emoji: "🎥" },
  { title: "Hour on YouTube", description: "Watch your favorite YouTubers for an hour 📺", points: 20, emoji: "📺" },
  { title: "Hour of Minecraft", description: "Build and explore for an hour with no limits ⛏️", points: 25, emoji: "⛏️" },
  { title: "Hour of Fortnite", description: "Extra hour of your favorite game 🎮", points: 25, emoji: "🎮" },
  { title: "New mobile game", description: "Buy a game on App Store or Google Play 📱", points: 60, emoji: "📱" },
  { title: "Late bedtime", description: "Stay up an hour later 😴", points: 30, emoji: "😴" },
  { title: "McDonald's", description: "Trip to McDonald's with your favorite menu 🍟", points: 70, emoji: "🍟" },
  { title: "Pizza of choice", description: "Order your favorite pizza 🍕", points: 80, emoji: "🍕" },
  { title: "Trip to the cinema", description: "Ticket to a new movie 🎬", points: 100, emoji: "🎬" },
  { title: "Trip to the water park", description: "A full day at the water park 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "Gaming mouse", description: "Cool gaming mouse 🖱️", points: 1000, emoji: "🖱️" },
  { title: "New headphones", description: "Cool wireless headphones 🎧", points: 2000, emoji: "🎧" },
];

// ——— DE ———
const TASKS_DE: DefaultTask[] = [
  { title: "Bett machen", description: "Am Morgen das Bett machen 🛏️", points: 8, emoji: "🛏️" },
  { title: "Morgenübungen", description: "10 Minuten Morgengymnastik 💪", points: 10, emoji: "💪" },
  { title: "Zähne putzen", description: "Morgens und abends Zähne putzen 🦷", points: 5, emoji: "🦷" },
  { title: "Zimmer aufräumen", description: "Ordnung im Zimmer machen 🧹", points: 15, emoji: "🧹" },
  { title: "Geschirr spülen", description: "Nach dem Abendessen abwaschen 🍽️", points: 12, emoji: "🍽️" },
  { title: "Hausaufgaben machen", description: "Alle Aufgaben für morgen erledigen 📚", points: 20, emoji: "📚" },
  { title: "Einkaufen gehen", description: "Etwas zu kaufen? Nimm Geld mit und schreib (UNBEDINGT) auf, was du kaufen sollst", points: 20, emoji: "🛒" },
  { title: "Müll rausbringen", description: "Müll aus dem Haus bringen 🗑️", points: 10, emoji: "🗑️" },
  { title: "Mama beim Kochen helfen", description: "Mama beim Mittagessen helfen 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_DE: DefaultGift[] = [
  { title: "Lutscher", description: "Leckerer Lollipop 🍭", points: 10, emoji: "🍭" },
  { title: "Cola", description: "Dose deiner Lieblingslimonade 🥤", points: 15, emoji: "🥤" },
  { title: "Filmauswahl für den Abend", description: "Du wählst den Film für die Familie 🎥", points: 20, emoji: "🎥" },
  { title: "Stunde YouTube", description: "Eine Stunde deine Lieblings-YouTuber schauen 📺", points: 20, emoji: "📺" },
  { title: "Stunde Minecraft", description: "Eine Stunde bauen und erkunden ohne Limit ⛏️", points: 25, emoji: "⛏️" },
  { title: "Stunde Fortnite", description: "Extra Stunde in deinem Lieblingsspiel 🎮", points: 25, emoji: "🎮" },
  { title: "Neues Handyspiel", description: "Spiel im App Store oder Google Play kaufen 📱", points: 60, emoji: "📱" },
  { title: "Später ins Bett", description: "Eine Stunde länger aufbleiben 😴", points: 30, emoji: "😴" },
  { title: "McDonald's", description: "McDonald's-Besuch mit deinem Lieblingsmenü 🍟", points: 70, emoji: "🍟" },
  { title: "Pizza nach Wahl", description: "Deine Lieblingspizza bestellen 🍕", points: 80, emoji: "🍕" },
  { title: "Kino-Besuch", description: "Ticket für einen neuen Film 🎬", points: 100, emoji: "🎬" },
  { title: "Besuch im Aquapark", description: "Einen Tag Spaß im Aquapark 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "Gaming-Maus", description: "Coole Gaming-Maus 🖱️", points: 1000, emoji: "🖱️" },
  { title: "Neue Kopfhörer", description: "Coole kabellose Kopfhörer 🎧", points: 2000, emoji: "🎧" },
];

// ——— FR ———
const TASKS_FR: DefaultTask[] = [
  { title: "Faire le lit", description: "Faire son lit le matin 🛏️", points: 8, emoji: "🛏️" },
  { title: "Faire des exercices", description: "10 minutes d'exercice le matin 💪", points: 10, emoji: "💪" },
  { title: "Se brosser les dents", description: "Se brosser les dents matin et soir 🦷", points: 5, emoji: "🦷" },
  { title: "Ranger sa chambre", description: "Ranger sa chambre 🧹", points: 15, emoji: "🧹" },
  { title: "Faire la vaisselle", description: "Faire la vaisselle après le dîner 🍽️", points: 12, emoji: "🍽️" },
  { title: "Faire les devoirs", description: "Finir toutes les leçons pour demain 📚", points: 20, emoji: "📚" },
  { title: "Aller faire les courses", description: "Besoin d'acheter quelque chose ? Prends l'argent et note (OBLIGATOIRE) ce qu'il faut acheter", points: 20, emoji: "🛒" },
  { title: "Sortir les poubelles", description: "Sortir les poubelles 🗑️", points: 10, emoji: "🗑️" },
  { title: "Aider maman à cuisiner", description: "Aider maman à préparer le déjeuner 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_FR: DefaultGift[] = [
  { title: "Sucette", description: "Une délicieuse sucette 🍭", points: 10, emoji: "🍭" },
  { title: "Soda", description: "Une canette de ton soda préféré 🥤", points: 15, emoji: "🥤" },
  { title: "Choix du film du soir", description: "Tu choisis le film pour la famille 🎥", points: 20, emoji: "🎥" },
  { title: "Une heure sur YouTube", description: "Regarder tes YouTubers préférés une heure 📺", points: 20, emoji: "📺" },
  { title: "Une heure de Minecraft", description: "Construire et explorer une heure sans limite ⛏️", points: 25, emoji: "⛏️" },
  { title: "Une heure de Fortnite", description: "Une heure de plus sur ton jeu préféré 🎮", points: 25, emoji: "🎮" },
  { title: "Nouveau jeu mobile", description: "Acheter un jeu sur App Store ou Google Play 📱", points: 60, emoji: "📱" },
  { title: "Coucher tard", description: "Se coucher une heure plus tard 😴", points: 30, emoji: "😴" },
  { title: "McDonald's", description: "Sortie McDonald's avec ton menu préféré 🍟", points: 70, emoji: "🍟" },
  { title: "Pizza au choix", description: "Commander ta pizza préférée 🍕", points: 80, emoji: "🍕" },
  { title: "Sortie cinéma", description: "Place pour un nouveau film 🎬", points: 100, emoji: "🎬" },
  { title: "Sortie aquapark", description: "Une journée à l'aquapark 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "Souris gamer", description: "Une souris gamer cool 🖱️", points: 1000, emoji: "🖱️" },
  { title: "Nouveaux écouteurs", description: "Des écouteurs sans fil cool 🎧", points: 2000, emoji: "🎧" },
];

// ——— IT ———
const TASKS_IT: DefaultTask[] = [
  { title: "Fare il letto", description: "Fare il letto la mattina 🛏️", points: 8, emoji: "🛏️" },
  { title: "Fare ginnastica", description: "10 minuti di ginnastica mattutina 💪", points: 10, emoji: "💪" },
  { title: "Lavarsi i denti", description: "Lavarsi i denti mattina e sera 🦷", points: 5, emoji: "🦷" },
  { title: "Ordinare la stanza", description: "Mettere in ordine la propria stanza 🧹", points: 15, emoji: "🧹" },
  { title: "Lavare i piatti", description: "Lavare i piatti dopo cena 🍽️", points: 12, emoji: "🍽️" },
  { title: "Fare i compiti", description: "Completare tutte le lezioni per domani 📚", points: 20, emoji: "📚" },
  { title: "Andare a fare la spesa", description: "Devi comprare qualcosa? Prendi i soldi e scrivi (OBBLIGATORIO) cosa comprare", points: 20, emoji: "🛒" },
  { title: "Portare fuori la spazzatura", description: "Portare la spazzatura fuori 🗑️", points: 10, emoji: "🗑️" },
  { title: "Aiutare la mamma a cucinare", description: "Aiutare la mamma a preparare il pranzo 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_IT: DefaultGift[] = [
  { title: "Lollipop", description: "Un buon lecca-lecca 🍭", points: 10, emoji: "🍭" },
  { title: "Bibita", description: "Una lattina della tua bibita preferita 🥤", points: 15, emoji: "🥤" },
  { title: "Scelta del film per la sera", description: "Scegli tu il film per la famiglia 🎥", points: 20, emoji: "🎥" },
  { title: "Un'ora su YouTube", description: "Guardare i tuoi YouTuber preferiti per un'ora 📺", points: 20, emoji: "📺" },
  { title: "Un'ora di Minecraft", description: "Costruire e esplorare un'ora senza limiti ⛏️", points: 25, emoji: "⛏️" },
  { title: "Un'ora di Fortnite", description: "Un'ora in più sul tuo gioco preferito 🎮", points: 25, emoji: "🎮" },
  { title: "Nuovo gioco per telefono", description: "Comprare un gioco su App Store o Google Play 📱", points: 60, emoji: "📱" },
  { title: "Andare a letto tardi", description: "Rimanere sveglio un'ora in più 😴", points: 30, emoji: "😴" },
  { title: "McDonald's", description: "Gita al McDonald's con il tuo menu preferito 🍟", points: 70, emoji: "🍟" },
  { title: "Pizza a scelta", description: "Ordinare la tua pizza preferita 🍕", points: 80, emoji: "🍕" },
  { title: "Gita al cinema", description: "Biglietto per un nuovo film 🎬", points: 100, emoji: "🎬" },
  { title: "Gita all'acquapark", description: "Una giornata all'acquapark 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "Mouse da gaming", description: "Un bel mouse da gaming 🖱️", points: 1000, emoji: "🖱️" },
  { title: "Nuove cuffie", description: "Cuffie wireless cool 🎧", points: 2000, emoji: "🎧" },
];

// ——— ES ———
const TASKS_ES: DefaultTask[] = [
  { title: "Hacer la cama", description: "Hacer tu cama por la mañana 🛏️", points: 8, emoji: "🛏️" },
  { title: "Hacer ejercicio", description: "10 minutos de ejercicio por la mañana 💪", points: 10, emoji: "💪" },
  { title: "Lavarse los dientes", description: "Lavarse los dientes por la mañana y por la noche 🦷", points: 5, emoji: "🦷" },
  { title: "Ordenar tu habitación", description: "Ordenar tu habitación 🧹", points: 15, emoji: "🧹" },
  { title: "Lavar los platos", description: "Lavar los platos después de cenar 🍽️", points: 12, emoji: "🍽️" },
  { title: "Hacer los deberes", description: "Completar todas las tareas para mañana 📚", points: 20, emoji: "📚" },
  { title: "Ir a la tienda", description: "¿Necesitas comprar algo? Coge el dinero y anota (OBLIGATORIO) qué hay que comprar", points: 20, emoji: "🛒" },
  { title: "Sacar la basura", description: "Sacar la basura de casa 🗑️", points: 10, emoji: "🗑️" },
  { title: "Ayudar a mamá a cocinar", description: "Ayudar a mamá a preparar la comida 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_ES: DefaultGift[] = [
  { title: "Piruleta", description: "Una rica piruleta 🍭", points: 10, emoji: "🍭" },
  { title: "Refresco", description: "Una lata de tu refresco favorito 🥤", points: 15, emoji: "🥤" },
  { title: "Elegir la película de la noche", description: "Tú eliges la película para la familia 🎥", points: 20, emoji: "🎥" },
  { title: "Una hora en YouTube", description: "Ver a tus YouTubers favoritos una hora 📺", points: 20, emoji: "📺" },
  { title: "Una hora de Minecraft", description: "Construir y explorar una hora sin límites ⛏️", points: 25, emoji: "⛏️" },
  { title: "Una hora de Fortnite", description: "Una hora más de tu juego favorito 🎮", points: 25, emoji: "🎮" },
  { title: "Nuevo juego para el móvil", description: "Comprar un juego en App Store o Google Play 📱", points: 60, emoji: "📱" },
  { title: "Acostarse tarde", description: "Quedarse despierto una hora más 😴", points: 30, emoji: "😴" },
  { title: "McDonald's", description: "Ir a McDonald's con tu menú favorito 🍟", points: 70, emoji: "🍟" },
  { title: "Pizza a elegir", description: "Pedir tu pizza favorita 🍕", points: 80, emoji: "🍕" },
  { title: "Ir al cine", description: "Entrada para una película nueva 🎬", points: 100, emoji: "🎬" },
  { title: "Ir al aquapark", description: "Un día entero en el aquapark 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "Ratón gamer", description: "Un ratón gamer molón 🖱️", points: 1000, emoji: "🖱️" },
  { title: "Nuevos auriculares", description: "Unos auriculares inalámbricos molones 🎧", points: 2000, emoji: "🎧" },
];

// ——— ZH ———
const TASKS_ZH: DefaultTask[] = [
  { title: "整理床铺", description: "早上整理好自己的床 🛏️", points: 8, emoji: "🛏️" },
  { title: "做早操", description: "晨练10分钟 💪", points: 10, emoji: "💪" },
  { title: "刷牙", description: "早晚刷牙 🦷", points: 5, emoji: "🦷" },
  { title: "收拾房间", description: "整理自己的房间 🧹", points: 15, emoji: "🧹" },
  { title: "洗碗", description: "晚饭后洗碗 🍽️", points: 12, emoji: "🍽️" },
  { title: "做作业", description: "完成明天要交的功课 📚", points: 20, emoji: "📚" },
  { title: "去商店", description: "要买什么东西？拿钱并（务必）记下要买什么", points: 20, emoji: "🛒" },
  { title: "倒垃圾", description: "把垃圾拿出去 🗑️", points: 10, emoji: "🗑️" },
  { title: "帮妈妈做饭", description: "帮妈妈准备午饭 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_ZH: DefaultGift[] = [
  { title: "棒棒糖", description: "好吃的棒棒糖 🍭", points: 10, emoji: "🍭" },
  { title: "汽水", description: "一罐你喜欢的汽水 🥤", points: 15, emoji: "🥤" },
  { title: "选晚间电影", description: "你来选全家看的电影 🎥", points: 20, emoji: "🎥" },
  { title: "一小时YouTube", description: "看喜欢的博主一小时 📺", points: 20, emoji: "📺" },
  { title: "一小时我的世界", description: "建造和探索一小时，不限 ⛏️", points: 25, emoji: "⛏️" },
  { title: "一小时堡垒之夜", description: "多玩一小时你喜欢的游戏 🎮", points: 25, emoji: "🎮" },
  { title: "新手机游戏", description: "在 App Store 或 Google Play 买游戏 📱", points: 60, emoji: "📱" },
  { title: "晚睡一小时", description: "可以晚睡一小时 😴", points: 30, emoji: "😴" },
  { title: "麦当劳", description: "去麦当劳吃你喜欢的套餐 🍟", points: 70, emoji: "🍟" },
  { title: "自选披萨", description: "点你喜欢的披萨 🍕", points: 80, emoji: "🍕" },
  { title: "去看电影", description: "一张新片电影票 🎬", points: 100, emoji: "🎬" },
  { title: "去水上乐园", description: "水上乐园玩一天 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "游戏鼠标", description: "酷炫游戏鼠标 🖱️", points: 1000, emoji: "🖱️" },
  { title: "新耳机", description: "酷炫无线耳机 🎧", points: 2000, emoji: "🎧" },
];

// ——— PT ———
const TASKS_PT: DefaultTask[] = [
  { title: "Fazer a cama", description: "Fazer a cama de manhã 🛏️", points: 8, emoji: "🛏️" },
  { title: "Fazer exercício", description: "10 minutos de exercício matinal 💪", points: 10, emoji: "💪" },
  { title: "Lavar os dentes", description: "Lavar os dentes de manhã e à noite 🦷", points: 5, emoji: "🦷" },
  { title: "Arrumar o quarto", description: "Arrumar o teu quarto 🧹", points: 15, emoji: "🧹" },
  { title: "Lavar a loiça", description: "Lavar a loiça depois do jantar 🍽️", points: 12, emoji: "🍽️" },
  { title: "Fazer os TPC", description: "Completar todas as tarefas para amanhã 📚", points: 20, emoji: "📚" },
  { title: "Ir às compras", description: "Precisas de comprar algo? Leva o dinheiro e anota (OBRIGATÓRIO) o que comprar", points: 20, emoji: "🛒" },
  { title: "Deitar o lixo fora", description: "Levar o lixo para fora 🗑️", points: 10, emoji: "🗑️" },
  { title: "Ajudar a mãe a cozinhar", description: "Ajudar a mãe a preparar o almoço 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_PT: DefaultGift[] = [
  { title: "Chupa-chupa", description: "Um chupa-chupa delicioso 🍭", points: 10, emoji: "🍭" },
  { title: "Refresco", description: "Uma lata do teu refresco favorito 🥤", points: 15, emoji: "🥤" },
  { title: "Escolher o filme da noite", description: "Tu escolhes o filme para a família 🎥", points: 20, emoji: "🎥" },
  { title: "Uma hora no YouTube", description: "Ver os teus YouTubers favoritos uma hora 📺", points: 20, emoji: "📺" },
  { title: "Uma hora de Minecraft", description: "Construir e explorar uma hora sem limites ⛏️", points: 25, emoji: "⛏️" },
  { title: "Uma hora de Fortnite", description: "Mais uma hora do teu jogo favorito 🎮", points: 25, emoji: "🎮" },
  { title: "Novo jogo para telemóvel", description: "Comprar um jogo na App Store ou Google Play 📱", points: 60, emoji: "📱" },
  { title: "Deitar tarde", description: "Ficar acordado mais uma hora 😴", points: 30, emoji: "😴" },
  { title: "McDonald's", description: "Ir ao McDonald's com o teu menu favorito 🍟", points: 70, emoji: "🍟" },
  { title: "Pizza à escolha", description: "Encomendar a tua pizza favorita 🍕", points: 80, emoji: "🍕" },
  { title: "Ir ao cinema", description: "Bilhete para um filme novo 🎬", points: 100, emoji: "🎬" },
  { title: "Ir ao aquapark", description: "Um dia inteiro no aquapark 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "Rato de gaming", description: "Um rato de gaming fixe 🖱️", points: 1000, emoji: "🖱️" },
  { title: "Novos headphones", description: "Headphones sem fios fixes 🎧", points: 2000, emoji: "🎧" },
];

// ——— JA ———
const TASKS_JA: DefaultTask[] = [
  { title: "ベッドを整える", description: "朝、ベッドを整える 🛏️", points: 8, emoji: "🛏️" },
  { title: "朝の運動", description: "10分間の朝の運動 💪", points: 10, emoji: "💪" },
  { title: "歯を磨く", description: "朝と夜に歯を磨く 🦷", points: 5, emoji: "🦷" },
  { title: "部屋を片付ける", description: "自分の部屋を片付ける 🧹", points: 15, emoji: "🧹" },
  { title: "皿を洗う", description: "夕食後に皿を洗う 🍽️", points: 12, emoji: "🍽️" },
  { title: "宿題をする", description: "明日の授業の準備を全部終わらせる 📚", points: 20, emoji: "📚" },
  { title: "おつかいに行く", description: "何か買うものは？お金を持って、（必ず）買うものをメモする", points: 20, emoji: "🛒" },
  { title: "ゴミを出す", description: "家のゴミを出す 🗑️", points: 10, emoji: "🗑️" },
  { title: "ママの料理を手伝う", description: "ママの昼食作りを手伝う 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_JA: DefaultGift[] = [
  { title: "棒付きキャンディ", description: "おいしい棒付きキャンディ 🍭", points: 10, emoji: "🍭" },
  { title: "ソーダ", description: "好きなソーダの缶 🥤", points: 15, emoji: "🥤" },
  { title: "夜の映画を選ぶ", description: "家族の映画をあなたが選ぶ 🎥", points: 20, emoji: "🎥" },
  { title: "YouTube 1時間", description: "好きな YouTuber を1時間見る 📺", points: 20, emoji: "📺" },
  { title: "マインクラフト 1時間", description: "1時間好きに建築・探検 ⛏️", points: 25, emoji: "⛏️" },
  { title: "フォートナイト 1時間", description: "好きなゲームを1時間追加 🎮", points: 25, emoji: "🎮" },
  { title: "新しいスマホゲーム", description: "App Store か Google Play でゲームを購入 📱", points: 60, emoji: "📱" },
  { title: "夜更かし", description: "1時間遅くまで起きていい 😴", points: 30, emoji: "😴" },
  { title: "マクドナルド", description: "好きなメニューでマクドナルド 🍟", points: 70, emoji: "🍟" },
  { title: "ピザ選び", description: "好きなピザを注文 🍕", points: 80, emoji: "🍕" },
  { title: "映画館", description: "新作映画のチケット 🎬", points: 100, emoji: "🎬" },
  { title: "アクアパーク", description: "アクアパークで1日 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "ゲーミングマウス", description: "かっこいいゲーミングマウス 🖱️", points: 1000, emoji: "🖱️" },
  { title: "新しいヘッドホン", description: "かっこいいワイヤレスヘッドホン 🎧", points: 2000, emoji: "🎧" },
];

// ——— KO ———
const TASKS_KO: DefaultTask[] = [
  { title: "침대 정리하기", description: "아침에 침대 정리하기 🛏️", points: 8, emoji: "🛏️" },
  { title: "아침 운동", description: "10분 아침 운동 💪", points: 10, emoji: "💪" },
  { title: "양치하기", description: "아침 저녁 양치하기 🦷", points: 5, emoji: "🦷" },
  { title: "방 청소", description: "내 방 정리하기 🧹", points: 15, emoji: "🧹" },
  { title: "설거지", description: "저녁 먹고 설거지하기 🍽️", points: 12, emoji: "🍽️" },
  { title: "숙제하기", description: "내일 숙제 다 하기 📚", points: 20, emoji: "📚" },
  { title: "심부름 가기", description: "뭘 사야 해? 돈 가지고 (꼭) 살 것 적어 오기", points: 20, emoji: "🛒" },
  { title: "쓰레기 버리기", description: "집에서 쓰레기 내다 버리기 🗑️", points: 10, emoji: "🗑️" },
  { title: "엄마 요리 도와주기", description: "엄마 점심 준비 도와주기 👩‍🍳", points: 30, emoji: "👩‍🍳" },
];

const GIFTS_KO: DefaultGift[] = [
  { title: "막대 사탕", description: "맛있는 막대 사탕 🍭", points: 10, emoji: "🍭" },
  { title: "탄산음료", description: "좋아하는 탄산음료 한 캔 🥤", points: 15, emoji: "🥤" },
  { title: "저녁 영화 고르기", description: "가족 영화를 네가 고른다 🎥", points: 20, emoji: "🎥" },
  { title: "유튜브 1시간", description: "좋아하는 유튜버 1시간 보기 📺", points: 20, emoji: "📺" },
  { title: "마인크래프트 1시간", description: "1시간 제한 없이 만들고 탐험 ⛏️", points: 25, emoji: "⛏️" },
  { title: "포트나이트 1시간", description: "좋아하는 게임 1시간 더 🎮", points: 25, emoji: "🎮" },
  { title: "새 폰 게임", description: "앱스토어/구글플레이에서 게임 구매 📱", points: 60, emoji: "📱" },
  { title: "늦게 자기", description: "1시간 늦게 자도 됨 😴", points: 30, emoji: "😴" },
  { title: "맥도날드", description: "맥도날드 가서 좋아하는 메뉴 🍟", points: 70, emoji: "🍟" },
  { title: "피자 고르기", description: "좋아하는 피자 시키기 🍕", points: 80, emoji: "🍕" },
  { title: "영화관 가기", description: "신작 영화 표 한 장 🎬", points: 100, emoji: "🎬" },
  { title: "워터파크 가기", description: "워터파크에서 하루 🏊‍♂️", points: 250, emoji: "🏊‍♂️" },
  { title: "게이밍 마우스", description: "멋진 게이밍 마우스 🖱️", points: 1000, emoji: "🖱️" },
  { title: "새 이어폰", description: "멋진 무선 이어폰 🎧", points: 2000, emoji: "🎧" },
];

const TASKS_BY_LOCALE: Record<string, DefaultTask[]> = {
  en: TASKS_EN,
  ru: TASKS_RU,
  de: TASKS_DE,
  fr: TASKS_FR,
  it: TASKS_IT,
  es: TASKS_ES,
  zh: TASKS_ZH,
  pt: TASKS_PT,
  ja: TASKS_JA,
  ko: TASKS_KO,
};

const GIFTS_BY_LOCALE: Record<string, DefaultGift[]> = {
  en: GIFTS_EN,
  ru: GIFTS_RU,
  de: GIFTS_DE,
  fr: GIFTS_FR,
  it: GIFTS_IT,
  es: GIFTS_ES,
  zh: GIFTS_ZH,
  pt: GIFTS_PT,
  ja: GIFTS_JA,
  ko: GIFTS_KO,
};

export function getDefaultTasks(locale: string): DefaultTask[] {
  return TASKS_BY_LOCALE[locale] ?? TASKS_EN;
}

export function getDefaultGifts(locale: string): DefaultGift[] {
  return GIFTS_BY_LOCALE[locale] ?? GIFTS_EN;
}
