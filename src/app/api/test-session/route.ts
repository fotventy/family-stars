import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("=== TEST SESSION ===");
    console.log("Full session:", JSON.stringify(session, null, 2));
    console.log("User ID:", (session as any)?.user?.id);
    console.log("User name:", (session as any)?.user?.name);
    console.log("User role:", (session as any)?.user?.role);
    
    return NextResponse.json({
      session,
      hasSession: !!session,
      hasUserId: !!(session as any)?.user?.id,
      userId: (session as any)?.user?.id,
      userName: (session as any)?.user?.name,
      userRole: (session as any)?.user?.role
    });
  } catch (error) {
    console.error("Test session error:", error);
    return NextResponse.json({ error: "Test failed", details: error }, { status: 500 });
  }
} 