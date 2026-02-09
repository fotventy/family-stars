import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/adminGuard";

export async function GET(request: Request) {
  const err = await requireAdmin(request);
  if (err) return err;
  try {
    console.log("Testing database connection...");
    
    await prisma.$connect();
    console.log("Database connected.");
    
    const userCount = await prisma.user.count();
    console.log(`Users count: ${userCount}`);
    
    const taskCount = await prisma.task.count();
    const giftCount = await prisma.gift.count();
    const userTaskCount = await prisma.userTask.count();
    const userGiftCount = await prisma.userGift.count();
    
    const stats = {
      users: userCount,
      tasks: taskCount,
      gifts: giftCount,
      userTasks: userTaskCount,
      userGifts: userGiftCount
    };
    
    console.log("Database stats:", stats);
    
    const dbUrl = process.env.DATABASE_URL;
    const hasDbUrl = !!dbUrl;
    const dbProvider = dbUrl?.startsWith('postgresql://') ? 'PostgreSQL' : 
                      dbUrl?.startsWith('postgres://') ? 'PostgreSQL' :
                      dbUrl?.startsWith('file:') ? 'SQLite' : 'Unknown';
    
    return NextResponse.json({
      success: true,
      message: "Database is working.",
      database: {
        connected: true,
        provider: dbProvider,
        hasConnectionString: hasDbUrl,
        connectionStringPrefix: dbUrl?.substring(0, 20) + '...' || 'not set'
      },
      statistics: stats,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("Database connection error:", error);
    
    return NextResponse.json({
      success: false,
      error: "Failed to connect to database",
      details: error instanceof Error ? error.message : String(error),
      database: {
        connected: false,
        hasConnectionString: !!process.env.DATABASE_URL,
        connectionStringPrefix: process.env.DATABASE_URL?.substring(0, 20) + '...' || 'not set'
      },
      timestamp: new Date().toISOString()
    }, { status: 500 });
    
  } finally {
    await prisma.$disconnect();
  }
} 