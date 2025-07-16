const { PrismaClient } = require('@prisma/client');

async function testConnection() {
  console.log('🧪 Testing MongoDB connection...');
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET');
  
  const prisma = new PrismaClient({
    log: ['error', 'warn', 'info'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  try {
    console.log('Attempting to connect...');
    await prisma.$connect();
    console.log('✅ Connected successfully');
    
    console.log('Testing simple query...');
    const userCount = await prisma.user.count();
    console.log('✅ Query successful. User count:', userCount);
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.error('Error details:', error);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected');
  }
}

testConnection();
