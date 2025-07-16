// Debug session and database user lookup
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from '@prisma/client';

export async function GET() {
  console.log("🔍 DEBUG: Session and User Lookup");
  let prisma = null;
  
  try {
    // Get session details
    const session = await getServerSession(authOptions);
    console.log("📋 Session details:", {
      hasSession: !!session,
      sessionUser: session?.user,
      email: session?.user?.email,
      name: session?.user?.name,
      image: session?.user?.image
    });
    
    if (!session?.user?.email) {
      return NextResponse.json({ 
        error: "No session found",
        debug: {
          session: session,
          hasUser: !!session?.user,
          hasEmail: !!session?.user?.email
        }
      }, { status: 401 });
    }

    // Connect to database
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    });
    
    await prisma.$connect();
    console.log("✅ Database connected");
    
    // Search for user in multiple ways
    const searchEmail = session.user.email;
    console.log("🔍 Searching for user with email:", searchEmail);
    
    // 1. Exact match
    const userExact = await prisma.user.findUnique({
      where: { email: searchEmail }
    });
    
    // 2. Get all users to see what emails exist
    const allUsers = await prisma.user.findMany({
      select: { id: true, email: true, name: true, createdAt: true }
    });
    
    // 3. Case-insensitive search
    const userCaseInsensitive = await prisma.user.findFirst({
      where: { 
        email: {
          equals: searchEmail,
          mode: 'insensitive'
        }
      }
    });
    
    // 4. Partial match search
    const usersPartialMatch = await prisma.user.findMany({
      where: {
        email: {
          contains: searchEmail.split('@')[0], // username part
          mode: 'insensitive'
        }
      },
      select: { id: true, email: true, name: true }
    });
    
    console.log("📊 Search results:", {
      searchEmail,
      foundExact: !!userExact,
      foundCaseInsensitive: !!userCaseInsensitive,
      partialMatches: usersPartialMatch.length,
      totalUsers: allUsers.length
    });
    
    return NextResponse.json({
      debug: true,
      session: {
        email: session.user.email,
        name: session.user.name,
        image: session.user.image
      },
      database: {
        searchEmail,
        userFound: !!userExact,
        userFoundCaseInsensitive: !!userCaseInsensitive,
        userDetails: userExact || userCaseInsensitive || null,
        partialMatches: usersPartialMatch,
        allUsersEmails: allUsers.map(u => ({ id: u.id, email: u.email, name: u.name })),
        totalUsersInDb: allUsers.length
      },
      recommendations: {
        exactMatchFound: !!userExact,
        caseIssue: !userExact && !!userCaseInsensitive,
        userNeedsCreation: !userExact && !userCaseInsensitive,
        possibleMatches: usersPartialMatch.length > 0
      }
    });
    
  } catch (error) {
    console.error("❌ Debug error:", error);
    return NextResponse.json({
      error: "Debug failed",
      details: error.message,
      stack: error.stack
    }, { status: 500 });
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}
