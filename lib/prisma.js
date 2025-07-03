import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma || new PrismaClient({
  // Set shorter connection timeout to fail fast
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Add connection pooling and timeout settings
  log: process.env.NODE_ENV === 'development' ? [] : ['error'],
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

// Create a function to test database connectivity with timeout
export async function testDatabaseConnection() {
  try {
    // Set a timeout for the database test
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('Database connection timeout')), 3000); // 3 second timeout
    });
    
    const dbTestPromise = prisma.$queryRaw`SELECT 1`;
    
    await Promise.race([dbTestPromise, timeoutPromise]);
    return true;
  } catch (error) {
    console.log('Database connection failed:', error.message);
    return false;
  }
}
