import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

export async function PUT(request) {
  console.log("🔧 Direct user update test");
  
  let directPrisma = null;
  
  try {
    // Create a fresh Prisma client
    directPrisma = new PrismaClient({
      log: ['error', 'warn'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
    
    console.log("🔌 Connecting directly...");
    await directPrisma.$connect();
    console.log("✅ Direct connection established");
    
    // Get session
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    
    console.log("👤 User:", session.user.email);
    
    // Parse request data
    const updateData = await request.json();
    console.log("📝 Update data:", Object.keys(updateData));
    
    const { name, email, phone, address } = updateData;
    
    // Simple validation
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Invalid email format" }, { status: 400 });
    }
    
    if (phone && !/^0\d{9}$/.test(phone.replace(/\s/g, ''))) {
      return NextResponse.json({ 
        error: "Phone number must be exactly 10 digits starting with 0" 
      }, { status: 400 });
    }
    
    // Direct update without complex includes
    console.log("💾 Updating user directly...");
    const updatedUser = await directPrisma.user.update({
      where: {
        email: session.user.email
      },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        phone: phone || null,
        address: address || null,
        updatedAt: new Date()
      },
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
    
    console.log("✅ User updated successfully");
    
    // Return simplified user data
    return NextResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address,
      image: updatedUser.image,
      role: updatedUser.role,
      memberSince: updatedUser.createdAt,
      lastUpdated: updatedUser.updatedAt,
      message: "Profile updated successfully"
    });
    
  } catch (error) {
    console.error("❌ Direct update failed:", error);
    
    if (error.code === 'P2025') {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    
    return NextResponse.json({
      error: "Failed to update profile",
      details: error.message,
      code: error.code || "UNKNOWN"
    }, { status: 500 });
    
  } finally {
    if (directPrisma) {
      try {
        await directPrisma.$disconnect();
        console.log("🔌 Disconnected from direct client");
      } catch (disconnectError) {
        console.error("⚠️ Error disconnecting:", disconnectError.message);
      }
    }
  }
}
