// Debug profile update endpoint
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

export async function PUT(request) {
  console.log("🔧 DEBUG: Profile update started");
  
  let debugPrisma = null;
  
  try {
    // Get session first
    const session = await getServerSession(authOptions);
    console.log("👤 Session check:", {
      hasSession: !!session,
      email: session?.user?.email
    });
    
    if (!session?.user?.email) {
      console.log("❌ No session found");
      return NextResponse.json({ error: "No session found" }, { status: 401 });
    }
    
    // Parse request data
    let updateData;
    try {
      updateData = await request.json();
      console.log("📝 Update data received:", updateData);
    } catch (jsonError) {
      console.error("❌ JSON parse error:", jsonError);
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }
    
    // Create fresh Prisma client
    console.log("🔌 Creating Prisma client...");
    debugPrisma = new PrismaClient({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
    
    // Connect
    console.log("🔗 Connecting to database...");
    await debugPrisma.$connect();
    console.log("✅ Connected successfully");
    
    // Validate phone if provided
    if (updateData.phone && !/^0\d{9}$/.test(updateData.phone.replace(/\s/g, ''))) {
      return NextResponse.json({ 
        error: "Phone number must be exactly 10 digits starting with 0" 
      }, { status: 400 });
    }
    
    // Find user first
    console.log("🔍 Finding user...");
    const existingUser = await debugPrisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, email: true, name: true, phone: true, address: true }
    });
    
    if (!existingUser) {
      console.log("❌ User not found");
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    console.log("👤 Current user data:", existingUser);
    
    // Prepare update data
    const { name, email, phone, address } = updateData;
    const updateFields = {
      ...(name !== undefined && { name }),
      ...(email !== undefined && { email }),
      phone: phone || null,
      address: address || null,
      updatedAt: new Date()
    };
    
    console.log("📝 Fields to update:", updateFields);
    
    // Perform update
    console.log("💾 Updating user...");
    const updatedUser = await debugPrisma.user.update({
      where: { email: session.user.email },
      data: updateFields,
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        image: true,
        role: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    console.log("✅ User updated successfully:", updatedUser);
    
    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
      debug: {
        originalData: existingUser,
        updateFields: updateFields,
        result: updatedUser
      }
    });
    
  } catch (error) {
    console.error("❌ Debug update failed:", error);
    
    let errorMessage = "Failed to update profile";
    let errorCode = 500;
    
    if (error.code === 'P2025') {
      errorMessage = "User not found";
      errorCode = 404;
    } else if (error.message.includes('Engine')) {
      errorMessage = "Database engine error";
    } else if (error.message.includes('timeout')) {
      errorMessage = "Database timeout";
    }
    
    return NextResponse.json({
      error: errorMessage,
      details: error.message,
      code: error.code || "UNKNOWN",
      debug: true
    }, { status: errorCode });
    
  } finally {
    if (debugPrisma) {
      try {
        await debugPrisma.$disconnect();
        console.log("🔌 Disconnected from debug client");
      } catch (disconnectError) {
        console.error("⚠️ Disconnect error:", disconnectError.message);
      }
    }
  }
}
