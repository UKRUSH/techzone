import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session: session,
      user: session?.user || null,
      authenticated: !!session?.user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error("Error checking session:", error);
    return NextResponse.json(
      { error: "Failed to check session", details: error.message },
      { status: 500 }
    );
  }
}
