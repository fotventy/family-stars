import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("🔧 Устанавливаем связи parent-child для семьи...");

    // Находим всех родителей
    const parents = await prisma.user.findMany({
      where: { role: "PARENT" }
    });

    if (parents.length === 0) {
      return NextResponse.json({
        success: false,
        error: "Родители не найдены"
      }, { status: 404 });
    }

    console.log(`👨‍👩‍👧‍👦 Найдено родителей: ${parents.map(p => p.name).join(', ')}`);

    // Найдем основного родителя (Папа, если есть, иначе первый)
    const mainParent = parents.find(p => p.name === 'Папа') || parents[0];
    console.log(`👑 Основной родитель: ${mainParent.name} (${mainParent.id})`);

    // Обновляем всех детей, устанавливая им parentId основного родителя
    const children = await prisma.user.findMany({
      where: { role: "CHILD" }
    });

    console.log(`👶 Найдено детей: ${children.length}`);

    for (const child of children) {
      await prisma.user.update({
        where: { id: child.id },
        data: { parentId: mainParent.id }
      });
      console.log(`✅ ${child.name} теперь ребенок ${mainParent.name}`);
    }

    // Проверяем результат
    const updatedChildren = await prisma.user.findMany({
      where: { role: "CHILD" },
      include: { parent: true }
    });

    console.log("✅ Связи parent-child установлены!");

    return NextResponse.json({
      success: true,
      message: "Связи parent-child успешно установлены для всей семьи!",
      mainParent: {
        id: mainParent.id,
        name: mainParent.name
      },
      allParents: parents.map(p => ({
        id: p.id,
        name: p.name,
        role: p.role
      })),
      children: updatedChildren.map(child => ({
        id: child.id,
        name: child.name,
        parentId: child.parentId,
        parentName: child.parent?.name
      })),
      note: "Все родители в семье теперь имеют доступ ко всем детям"
    });

  } catch (error) {
    console.error("❌ Ошибка установки связей:", error);
    return NextResponse.json({
      success: false,
      error: "Ошибка установки связей parent-child",
      details: error instanceof Error ? error.message : String(error)
    }, { status: 500 });

  } finally {
    await prisma.$disconnect();
  }
} 