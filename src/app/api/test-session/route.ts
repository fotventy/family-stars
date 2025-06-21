import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    console.log("=== TEST SESSION ===");
    console.log("Full session:", JSON.stringify(session, null, 2));
    console.log("User ID:", session?.user?.id);
    console.log("User name:", session?.user?.name);
    console.log("User role:", session?.user?.role);
    
    return NextResponse.json({
      session,
      hasSession: !!session,
      hasUserId: !!session?.user?.id,
      userId: session?.user?.id,
      userName: session?.user?.name,
      userRole: session?.user?.role
    });
  } catch (error) {
    console.error("Test session error:", error);
    return NextResponse.json({ error: "Test failed", details: error }, { status: 500 });
  }
} 