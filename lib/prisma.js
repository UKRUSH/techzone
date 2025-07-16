import { PrismaClient } from '@prisma/client'

// Enhanced connection management with fallback strategies
let isConnected = false;
let connectionPromise = null;
let retryCount = 0;
const MAX_RETRIES = 5;

// Create a robust Prisma client instance
const createPrismaClient = () => {
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    throw new Error('DATABASE_URL is required');
  }

  const config = {
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  };
  
  return new PrismaClient(config);
};

// Global Prisma instance - simplified approach
const globalForPrisma = globalThis;
export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}

// Ultra-robust connection function with multiple fallback strategies
export const ensureConnection = async () => {
  // Skip during build
  if (process.env.NODE_ENV === 'production' && !process.env.VERCEL) {
    console.log('⏭️ Skipping DB connection during build');
    return true;
  }
  
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment variables');
    return false;
  }

  // If we have an active connection promise, wait for it
  if (connectionPromise) {
    try {
      await connectionPromise;
      return isConnected;
    } catch (error) {
      connectionPromise = null;
      isConnected = false;
    }
  }

  // If already connected, test it
  if (isConnected) {
    try {
      await prisma.$executeRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.log('🔄 Connection test failed, reconnecting...');
      isConnected = false;
    }
  }

  // Create new connection promise
  connectionPromise = establishConnection();
  
  try {
    await connectionPromise;
    isConnected = true;
    connectionPromise = null;
    console.log('✅ Database connection established successfully');
    return true;
  } catch (error) {
    isConnected = false;
    connectionPromise = null;
    console.error('❌ Failed to establish database connection:', error.message);
    return false;
  }
};

async function establishConnection() {
  const maxRetries = 5;
  let lastError = null;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`🔄 Connection attempt ${attempt}/${maxRetries}...`);
      
      // Clean disconnect first
      try {
        await prisma.$disconnect();
        await new Promise(resolve => setTimeout(resolve, 500));
      } catch (disconnectError) {
        // Ignore disconnect errors
      }
      
      // Progressive backoff delay
      if (attempt > 1) {
        const delay = Math.min(1000 * Math.pow(2, attempt - 1), 10000);
        console.log(`⏳ Waiting ${delay}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
      
      // Attempt connection
      console.log('🔌 Connecting to database...');
      await prisma.$connect();
      
      // Test connection with a simple query
      console.log('🧪 Testing connection...');
      try {
        // For MongoDB, use a simple ping
        await prisma.$runCommandRaw({ ping: 1 });
      } catch (pingError) {
        // Fallback to a simple query
        await prisma.$executeRaw`SELECT 1`;
      }
      
      console.log(`✅ Connection successful on attempt ${attempt}`);
      retryCount = 0;
      return;
      
    } catch (error) {
      lastError = error;
      console.error(`❌ Attempt ${attempt} failed:`, error.message);
      
      // Analyze error type for better debugging
      if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
        console.error('🌐 DNS/Network issue detected');
      } else if (error.message.includes('authentication')) {
        console.error('🔐 Authentication issue detected');
      } else if (error.message.includes('timeout')) {
        console.error('⏰ Timeout issue detected');
      }
    }
  }
  
  retryCount++;
  throw new Error(`Failed to connect after ${maxRetries} attempts. Last error: ${lastError?.message}`);
}

// Connection warming function - called immediately
async function warmConnection() {
  // Only warm in development and if we have a valid DATABASE_URL
  if (process.env.NODE_ENV === 'development') {
    // Give a small delay to ensure env vars are loaded
    await new Promise(resolve => setTimeout(resolve, 100));
    
    if (!process.env.DATABASE_URL) {
      console.log('⚠️ No DATABASE_URL found for connection warming');
      return;
    }
    
    try {
      console.log('🔥 Warming up Prisma connection...');
      console.log('🔗 Database URL present:', process.env.DATABASE_URL ? 'Yes' : 'No');
      
      await prisma.$connect();
      console.log('✅ Prisma connected during warming');
      
      await prisma.$runCommandRaw({ ping: 1 });
      console.log('✅ Database ping successful during warming');
      
      isConnected = true;
      console.log('✅ Connection warmed up successfully');
    } catch (error) {
      console.log('⚠️ Connection warming failed:', error.message);
      console.log('⚠️ This is normal if the database is temporarily unavailable');
      isConnected = false;
    }
  }
}

// Start warming the connection with a small delay in development
if (process.env.NODE_ENV === 'development') {
  // Use setTimeout to ensure this runs after the module is fully loaded
  setTimeout(() => {
    warmConnection().catch(error => {
      console.log('⚠️ Background connection warming failed:', error.message);
    });
  }, 200);
}

// Simplified executeWithRetry function
export async function executeWithRetry(queryFn, maxRetries = 2) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await queryFn();
    } catch (error) {
      console.error(`Query attempt ${attempt} failed:`, error.message);
      
      if (attempt === maxRetries) {
        throw error;
      }
      
      // Wait before retry
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
}

// Special function for API routes with automatic retry
export const withDatabaseConnection = async (operation, maxRetries = 3) => {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Ensure connection before operation
      const connected = await ensureConnection();
      if (!connected) {
        throw new Error(`Database connection failed on attempt ${attempt}`);
      }
      
      // Execute the operation
      return await operation();
      
    } catch (error) {
      console.error(`🔄 Operation attempt ${attempt}/${maxRetries} failed:`, error.message);
      
      // Reset connection state for retry
      isConnected = false;
      connectionPromise = null;
      
      if (attempt === maxRetries) {
        throw new Error(`Operation failed after ${maxRetries} attempts: ${error.message}`);
      }
      
      // Wait before retry with exponential backoff
      const delay = Math.min(1000 * Math.pow(2, attempt), 5000);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
};
