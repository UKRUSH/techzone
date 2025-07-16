// Direct MongoDB connection test using Prisma
const { PrismaClient } = require('@prisma/client');

async function testDirectConnection() {
  console.log('🔧 Starting direct database connection test...');
  console.log('🌍 Environment:', process.env.NODE_ENV || 'development');
  
  // Check for DATABASE_URL
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found in environment');
    process.exit(1);
  }
  
  console.log('📦 DATABASE_URL configured:', process.env.DATABASE_URL.replace(/mongodb\+srv:\/\/([^:]+):([^@]+)@/, 'mongodb+srv://*****:*****@'));
  
  let prisma = null;
  
  try {
    // Create Prisma client with explicit config
    console.log('🔌 Creating Prisma client...');
    prisma = new PrismaClient({
      log: ['query', 'info', 'warn', 'error'],
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      },
      errorFormat: 'pretty'
    });
    
    // Test connection
    console.log('🔗 Testing connection...');
    await prisma.$connect();
    console.log('✅ Connection established successfully');
    
    // Test ping with MongoDB-compatible command
    console.log('🏓 Testing ping...');
    const startTime = Date.now();
    await prisma.$runCommandRaw({ ping: 1 });
    const pingTime = Date.now() - startTime;
    console.log(`✅ Ping successful: ${pingTime}ms`);
    
    // Test database operations
    console.log('📊 Testing database operations...');
    
    // Count users
    const userCount = await prisma.user.count();
    console.log(`👥 Users in database: ${userCount}`);
    
    // Test finding first user
    const firstUser = await prisma.user.findFirst({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      }
    });
    
    if (firstUser) {
      console.log('👤 First user found:', {
        id: firstUser.id,
        email: firstUser.email,
        name: firstUser.name,
        created: firstUser.createdAt
      });
    } else {
      console.log('👤 No users found in database');
    }
    
    // Test products count
    const productCount = await prisma.product.count();
    console.log(`📦 Products in database: ${productCount}`);
    
    console.log('🎉 All database tests passed successfully!');
    
  } catch (error) {
    console.error('❌ Database test failed:');
    console.error('Error message:', error.message);
    console.error('Error code:', error.code || 'UNKNOWN');
    console.error('Error type:', error.constructor.name);
    
    if (error.meta) {
      console.error('Error metadata:', error.meta);
    }
    
    // Categorize the error
    if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('🌐 DNS Resolution Error - Check your internet connection and MongoDB Atlas URL');
    } else if (error.message.includes('Authentication failed')) {
      console.error('🔐 Authentication Error - Check your database credentials');
    } else if (error.message.includes('timeout') || error.message.includes('ETIMEDOUT')) {
      console.error('⏱️ Connection Timeout - Check network connectivity or MongoDB Atlas IP whitelist');
    } else if (error.message.includes('Engine')) {
      console.error('⚙️ Prisma Engine Error - Engine may not be properly initialized');
    } else {
      console.error('❓ Unknown Error Type - Check MongoDB Atlas status and configuration');
    }
    
    process.exit(1);
    
  } finally {
    if (prisma) {
      console.log('🔌 Disconnecting from database...');
      await prisma.$disconnect();
      console.log('✅ Database disconnected');
    }
  }
}

// Load environment variables if .env.local exists
try {
  require('dotenv').config({ path: '.env.local' });
  console.log('📄 Loaded environment variables from .env.local');
} catch (envError) {
  console.log('📄 No .env.local file found or error loading it');
}

// Run the test
testDirectConnection().catch(console.error);
