import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST() {
  try {
    console.log("🔧 Устанавливаем связи parent-child...");

    // Находим первого родителя (Папа или Мама)
    const parent = await prisma.user.findFirst({
      where: { role: "PARENT" }
    });

    if (!parent) {
      return NextResponse.json({
        success: false,
        error: "Родитель не найден"
      }, { status: 404 });
    }

    console.log(`👨‍👩‍👧‍👦 Найден родитель: ${parent.name} (${parent.id})`);

    // Обновляем всех детей, устанавливая им parentId
    const children = await prisma.user.findMany({
      where: { role: "CHILD" }
    });

    console.log(`👶 Найдено детей: ${children.length}`);

    for (const child of children) {
      await prisma.user.update({
        where: { id: child.id },
        data: { parentId: parent.id }
      });
      console.log(`✅ ${child.name} теперь ребенок ${parent.name}`);
    }

    // Проверяем результат
    const updatedChildren = await prisma.user.findMany({
      where: { role: "CHILD" },
      include: { parent: true }
    });

    console.log("✅ Связи parent-child установлены!");

    return NextResponse.json({
      success: true,
      message: "Связи parent-child успешно установлены!",
      parent: {
        id: parent.id,
        name: parent.name
      },
      children: updatedChildren.map(child => ({
        id: child.id,
        name: child.name,
        parentId: child.parentId,
        parentName: child.parent?.name
      }))
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