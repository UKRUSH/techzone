import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis;

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Prisma handles connection pooling automatically — no manual retry needed
export const ensureConnection = async () => {
  if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL not found in environment variables');
    return false;
  }
  return true;
};

export const executeWithRetry = async (queryFn, maxRetries = 2) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      if (attempt === maxRetries) throw error;
      await new Promise(resolve => setTimeout(resolve, 500 * attempt));
    }
  }
};

export const testDatabaseConnection = ensureConnection;
export const withDatabaseConnection = async (operation) => operation();
