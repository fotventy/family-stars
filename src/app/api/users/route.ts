import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { hash } from "bcryptjs";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (
      !session ||
      ((session as any).user.role !== "PARENT" &&
        (session as any).user.role !== "FAMILY_ADMIN")
    ) {
      return NextResponse.json(
        { error: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const familyId = (session as any).user.familyId as string | undefined;
    const where: { role: string; familyId?: string | null } = { role: "CHILD" };
    if (familyId) where.familyId = familyId;

    const users = await prisma.user.findMany({
      where,
      select: {
        id: true,
        name: true,
        role: true,
        points: true,
        createdAt: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || ((session as any).user.role !== "PARENT" && (session as any).user.role !== "FAMILY_ADMIN")) {
      return NextResponse.json(
        { error: "Insufficient permissions" }, 
        { status: 403 }
      );
    }

    const { name, password, role = "CHILD" } = await request.json();

    if (!name || !password) {
      return NextResponse.json(
        { error: "Name and password are required" },
        { status: 400 }
      );
    }
    if (password.length < 6 || password.length > 128) {
      return NextResponse.json(
        { error: "Password must be 6 to 128 characters" },
        { status: 400 }
      );
    }
    if (name.length > 100) {
      return NextResponse.json(
        { error: "Name is too long" },
        { status: 400 }
      );
    }

    const familyId = (session as any).user.familyId as string | undefined;
    const existingUser = await prisma.user.findFirst({
      where: familyId ? { name, familyId } : { name },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "A user with this name already exists in this family" },
        { status: 400 }
      );
    }

    const hashedPassword = await hash(password, 10);
    const newUser = await prisma.user.create({
      data: {
        name,
        password: hashedPassword,
        role,
        ...(familyId ? { familyId } : {}),
      },
    });

    return NextResponse.json(
      { 
        id: newUser.id, 
        name: newUser.name, 
        role: newUser.role 
      }, 
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || ((session as any).user.role !== "PARENT" && (session as any).user.role !== "FAMILY_ADMIN")) {
      return NextResponse.json(
        { error: "Insufficient permissions" }, 
        { status: 403 }
      );
    }

    const { id, name, password } = await request.json();
    const familyId = (session as any).user.familyId as string | undefined;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (familyId && target.familyId !== familyId) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    const updateData: { name?: string; password?: string } = {};

    if (name) {
      const existingUser = await prisma.user.findFirst({
        where: familyId ? { name, familyId } : { name },
      });

      if (existingUser && existingUser.id !== id) {
        return NextResponse.json(
          { error: "A user with this name already exists in this family" },
          { status: 400 }
        );
      }

      updateData.name = name;
    }

    if (password) {
      if (password.length < 6 || password.length > 128) {
        return NextResponse.json(
          { error: "Password must be 6 to 128 characters" },
          { status: 400 }
        );
      }
      updateData.password = await hash(password, 10);
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: updateData
    });

    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      role: updatedUser.role
    });
  } catch (error) {
    console.error("Error updating user:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || ((session as any).user.role !== "PARENT" && (session as any).user.role !== "FAMILY_ADMIN")) {
      return NextResponse.json(
        { error: "Insufficient permissions" }, 
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");
    const familyId = (session as any).user.familyId as string | undefined;

    if (!id) {
      return NextResponse.json(
        { error: "User ID is required" },
        { status: 400 }
      );
    }

    const target = await prisma.user.findUnique({ where: { id } });
    if (!target) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if (familyId && target.familyId !== familyId) {
      return NextResponse.json({ error: "Insufficient permissions" }, { status: 403 });
    }

    await prisma.user.delete({ where: { id } });

    return NextResponse.json({ message: "User deleted" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
} 