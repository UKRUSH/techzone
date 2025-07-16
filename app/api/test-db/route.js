import { NextResponse } from 'next/server';
import { prisma, withDatabaseConnection } from '@/lib/prisma';

export async function GET() {
  console.log("🧪 Database connection test endpoint");
  
  try {
    const result = await withDatabaseConnection(async () => {
      console.log("🔍 Testing database connection...");
      
      // Simple test query
      const userCount = await prisma.user.count();
      console.log(`✅ Found ${userCount} users`);
      
      return {
        status: "connected",
        message: "Database connection successful",
        userCount,
        timestamp: new Date().toISOString()
      };
    });
    
    return NextResponse.json(result);
    
  } catch (error) {
    console.error("❌ Database test failed:", error.message);
    
    return NextResponse.json(
      {
        status: "failed",
        message: "Database connection failed",
        error: error.message,
        timestamp: new Date().toISOString()
      },
      { status: 503 }
    );
  }
}
