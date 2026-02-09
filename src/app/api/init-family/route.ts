import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function POST(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  try {
    console.log("Initializing family...");

    const familyUsers = [
      { name: "Папа", password: "papa2024", role: "PARENT" },
      { name: "Мама", password: "mama2024", role: "PARENT" },
      { name: "Назар", password: "nazar2024", role: "CHILD" },
      { name: "Влад", password: "vlad2024", role: "CHILD" },
      { name: "Никита", password: "nikita2024", role: "CHILD" },
    ];

    const createdUsers = [];
    const existingUsers = [];

    for (const userData of familyUsers) {
      try {
        // Check if user already exists
        const existingUser = await prisma.user.findFirst({
          where: { name: userData.name },
        });

        if (existingUser) {
          console.log(`User ${userData.name} already exists`);
          existingUsers.push({
            name: userData.name,
            role: userData.role,
            status: "already_exists"
          });
          continue;
        }

        const hashedPassword = await hash(userData.password, 10);

        const newUser = await prisma.user.create({
          data: {
            name: userData.name,
            password: hashedPassword,
            role: userData.role as "PARENT" | "CHILD",
            points: userData.role === "CHILD" ? 10 : 0,
          }
        });

        console.log(`Created user: ${newUser.name} (${newUser.role})`);
        createdUsers.push({
          name: newUser.name,
          password: userData.password,
          role: newUser.role,
          points: newUser.points,
          status: "created"
        });

      } catch (userError) {
        console.error(`Error creating user ${userData.name}:`, userError);
        existingUsers.push({
          name: userData.name,
          role: userData.role,
          status: "error",
          error: userError instanceof Error ? userError.message : String(userError)
        });
      }
    }

    const totalUsers = await prisma.user.count();

    console.log(`Family init done. Created: ${createdUsers.length}, existing: ${existingUsers.length}, total: ${totalUsers}`);

    return NextResponse.json({
      success: true,
      message: `Family initialized. Created ${createdUsers.length} new users`,
      statistics: {
        created: createdUsers.length,
        existing: existingUsers.length,
        total: totalUsers
      },
      createdUsers,
      existingUsers
    });

  } catch (error) {
    console.error("Family init error:", error);
    return NextResponse.json(
      { 
        success: false,
        error: "Family initialization failed",
        details: error instanceof Error ? error.message : String(error)
      }, 
      { status: 500 }
    );

  } finally {
    await prisma.$disconnect();
  }
} 