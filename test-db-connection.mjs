// Enhanced connection test with detailed error reporting
import { PrismaClient } from '@prisma/client';

console.log('🔍 Database Connection Test');
console.log('==========================');

// Test with detailed logging
const prisma = new PrismaClient({
  log: ['query', 'info', 'warn', 'error'],
  errorFormat: 'pretty'
});

async function testConnection() {
  console.log('🔄 Starting connection test...');
  
  try {
    // Test 1: Basic connection
    console.log('📡 Test 1: Basic Prisma connection...');
    await prisma.$connect();
    console.log('✅ Prisma connected');
    
    // Test 2: MongoDB ping
    console.log('📡 Test 2: MongoDB ping...');
    const pingResult = await prisma.$runCommandRaw({ ping: 1 });
    console.log('✅ MongoDB ping successful:', pingResult);
    
    // Test 3: Count users
    console.log('📡 Test 3: User count query...');
    const userCount = await prisma.user.count();
    console.log(`✅ User count: ${userCount}`);
    
    // Test 4: Find first user
    if (userCount > 0) {
      console.log('📡 Test 4: Finding first user...');
      const user = await prisma.user.findFirst({
        select: { id: true, email: true, name: true }
      });
      console.log('✅ First user:', user);
    }
    
    console.log('\n🎉 All database tests passed!');
    return true;
    
  } catch (error) {
    console.log('\n❌ Database test failed!');
    console.log('Error details:');
    console.log('- Name:', error.name);
    console.log('- Message:', error.message);
    console.log('- Code:', error.code);
    
    if (error.meta) {
      console.log('- Meta:', error.meta);
    }
    
    // Analyze common errors
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Issue: DNS resolution failed');
      console.log('🔧 Solution: Check internet connection and MongoDB Atlas URL');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n💡 Issue: Authentication failed');
      console.log('🔧 Solution: Check MongoDB username and password in DATABASE_URL');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Issue: Connection timeout');
      console.log('🔧 Solution: Check network connectivity to MongoDB Atlas');
    } else if (error.message.includes('Engine is not yet connected')) {
      console.log('\n💡 Issue: Prisma engine not initialized');
      console.log('🔧 Solution: Restart the application');
    }
    
    console.log('\n🔗 MongoDB Atlas Checklist:');
    console.log('1. ✓ Check if cluster is running (not paused)');
    console.log('2. ✓ Verify IP whitelist includes your current IP');
    console.log('3. ✓ Confirm database user has correct permissions');
    console.log('4. ✓ Test connection string in MongoDB Compass');
    
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

testConnection().then(success => {
  process.exit(success ? 0 : 1);
});
