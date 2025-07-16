// Database Connection Diagnostic Script
const { PrismaClient } = require('@prisma/client');
require('dotenv').config({ path: '.env.local' });

console.log('🔍 Database Connection Diagnostic');
console.log('================================');

// Check environment variables
console.log('📋 Environment Check:');
console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? '✅ Set' : '❌ Missing'}`);
console.log(`NODE_ENV: ${process.env.NODE_ENV || 'development'}`);
console.log(`NEXTAUTH_URL: ${process.env.NEXTAUTH_URL || 'Not set'}`);

if (process.env.DATABASE_URL) {
  console.log(`\n🔗 Database URL Format: ${process.env.DATABASE_URL.substring(0, 20)}...`);
  
  // Extract database info
  try {
    const url = new URL(process.env.DATABASE_URL);
    console.log(`📊 Database Info:`);
    console.log(`  Protocol: ${url.protocol}`);
    console.log(`  Host: ${url.hostname}`);
    console.log(`  Database: ${url.pathname.substring(1)}`);
    console.log(`  Username: ${url.username}`);
  } catch (urlError) {
    console.log(`❌ Invalid DATABASE_URL format: ${urlError.message}`);
  }
}

async function testDatabaseConnection() {
  console.log('\n🧪 Testing Database Connection...');
  
  const prisma = new PrismaClient({
    log: ['query', 'info', 'warn', 'error'],
  });

  try {
    console.log('🔄 Step 1: Connecting to Prisma...');
    await prisma.$connect();
    console.log('✅ Prisma connection established');

    console.log('🔄 Step 2: Testing database ping...');
    await prisma.$runCommandRaw({ ping: 1 });
    console.log('✅ Database ping successful');

    console.log('🔄 Step 3: Testing simple query...');
    const userCount = await prisma.user.count();
    console.log(`✅ Found ${userCount} users in database`);

    console.log('🔄 Step 4: Testing user lookup...');
    const firstUser = await prisma.user.findFirst();
    console.log(`✅ First user: ${firstUser ? firstUser.email : 'No users found'}`);

    console.log('\n🎉 All database tests passed!');
    return true;

  } catch (error) {
    console.log('\n❌ Database connection failed:');
    console.log(`Error Type: ${error.constructor.name}`);
    console.log(`Error Message: ${error.message}`);
    
    if (error.code) {
      console.log(`Error Code: ${error.code}`);
    }
    
    if (error.meta) {
      console.log(`Error Meta:`, error.meta);
    }
    
    // Common error analysis
    if (error.message.includes('ENOTFOUND')) {
      console.log('\n💡 Suggestion: Check your internet connection and MongoDB Atlas cluster status');
    } else if (error.message.includes('authentication')) {
      console.log('\n💡 Suggestion: Check your MongoDB username and password');
    } else if (error.message.includes('Engine is not yet connected')) {
      console.log('\n💡 Suggestion: Database engine initialization issue - try restarting the application');
    } else if (error.message.includes('timeout')) {
      console.log('\n💡 Suggestion: Network timeout - check your internet connection');
    }
    
    return false;

  } finally {
    try {
      await prisma.$disconnect();
      console.log('🔌 Disconnected from database');
    } catch (disconnectError) {
      console.log('⚠️ Error during disconnect:', disconnectError.message);
    }
  }
}

async function main() {
  const success = await testDatabaseConnection();
  
  console.log('\n📋 Summary:');
  console.log(`Database Connection: ${success ? '✅ Working' : '❌ Failed'}`);
  
  if (!success) {
    console.log('\n🔧 Troubleshooting Steps:');
    console.log('1. Check your .env.local file for correct DATABASE_URL');
    console.log('2. Verify MongoDB Atlas cluster is running');
    console.log('3. Check network connectivity');
    console.log('4. Verify database credentials');
    console.log('5. Try restarting the development server');
  }
  
  process.exit(success ? 0 : 1);
}

main().catch((error) => {
  console.error('🚨 Unexpected error:', error);
  process.exit(1);
});
