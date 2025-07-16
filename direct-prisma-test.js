// Test file to check Prisma directly
const { PrismaClient } = require('@prisma/client');

async function directTest() {
  console.log('🧪 Direct Prisma test...');
  
  const client = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });
  
  try {
    console.log('1. Connecting...');
    await client.$connect();
    console.log('✅ Connected');
    
    console.log('2. Testing query...');
    const count = await client.user.count();
    console.log('✅ User count:', count);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('❌ Stack:', error.stack);
  } finally {
    await client.$disconnect();
  }
}

directTest();
