import { NextResponse } from "next/server";
import { PrismaClient } from '@prisma/client';

export async function GET() {
  console.log("🔧 Direct database connection test");
  
  let testPrisma = null;
  
  try {
    // Create a fresh Prisma client for testing
    console.log("📋 Environment check:");
    console.log("- DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("- NODE_ENV:", process.env.NODE_ENV);
    
    if (!process.env.DATABASE_URL) {
      throw new Error("DATABASE_URL not found in environment variables");
    }
    
    // Log the first part of the URL for debugging (safely)
    const dbUrl = process.env.DATABASE_URL;
    console.log("- DB URL format:", dbUrl.substring(0, 20) + "...");
    
    testPrisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
    
    console.log("🔌 Attempting to connect...");
    await testPrisma.$connect();
    console.log("✅ Connected to database");
    
    console.log("🧪 Testing ping...");
    await testPrisma.$runCommandRaw({ ping: 1 });
    console.log("✅ Ping successful");
    
    console.log("📊 Testing user count...");
    const userCount = await testPrisma.user.count();
    console.log(`✅ Found ${userCount} users`);
    
    console.log("🎉 All direct tests passed!");
    
    return NextResponse.json({
      success: true,
      message: "Direct database connection successful",
      userCount,
      tests: ["connect", "ping", "query"],
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error("❌ Direct connection test failed:", error);
    
    // Enhanced error analysis
    let errorType = "unknown";
    let suggestion = "Check your database configuration";
    
    if (error.message.includes("ENOTFOUND") || error.message.includes("getaddrinfo")) {
      errorType = "dns";
      suggestion = "Check internet connection and MongoDB Atlas URL";
    } else if (error.message.includes("authentication")) {
      errorType = "auth";
      suggestion = "Verify MongoDB username and password";
    } else if (error.message.includes("timeout")) {
      errorType = "timeout";
      suggestion = "Check network connectivity to MongoDB Atlas";
    } else if (error.message.includes("Engine is not yet connected")) {
      errorType = "engine";
      suggestion = "Restart the application";
    }
    
    return NextResponse.json({
      success: false,
      message: "Direct database connection failed",
      error: error.message,
      errorType,
      suggestion,
      timestamp: new Date().toISOString()
    }, { status: 503 });
    
  } finally {
    if (testPrisma) {
      try {
        await testPrisma.$disconnect();
        console.log("🔌 Disconnected from test client");
      } catch (disconnectError) {
        console.error("⚠️ Error disconnecting:", disconnectError.message);
      }
    }
  }
}
