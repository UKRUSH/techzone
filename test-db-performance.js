import { prisma, executeWithRetry, testDatabaseConnection } from './lib/prisma.js';

console.log('🧪 Testing optimized database connection...');

async function testDatabasePerformance() {
  console.log('\n📊 Running database performance tests...');
  
  try {
    // Test 1: Connection speed
    console.log('1️⃣ Testing connection speed...');
    const startTime = Date.now();
    const isConnected = await testDatabaseConnection();
    const connectionTime = Date.now() - startTime;
    console.log(`✅ Connection test: ${connectionTime}ms (${isConnected ? 'SUCCESS' : 'FAILED'})`);
    
    // Test 2: Simple query with retry
    console.log('\n2️⃣ Testing simple query with retry logic...');
    const queryStart = Date.now();
    const result = await executeWithRetry(async () => {
      return await prisma.user.count();
    });
    const queryTime = Date.now() - queryStart;
    
    if (result.success) {
      console.log(`✅ User count query: ${queryTime}ms (Found ${result.data} users)`);
    } else {
      console.log(`❌ User count query failed: ${result.error}`);
    }
    
    // Test 3: Complex query with retry
    console.log('\n3️⃣ Testing complex query with retry logic...');
    const complexStart = Date.now();
    const complexResult = await executeWithRetry(async () => {
      return await prisma.product.findMany({
        take: 5,
        include: {
          brand: true,
          category: true
        }
      });
    });
    const complexTime = Date.now() - complexStart;
    
    if (complexResult.success) {
      console.log(`✅ Complex product query: ${complexTime}ms (Found ${complexResult.data.length} products)`);
    } else {
      console.log(`❌ Complex product query failed: ${complexResult.error}`);
    }
    
    console.log('\n🎉 Database performance test complete!');
    console.log('📈 Optimizations applied:');
    console.log('   - Connection pooling with maxPoolSize=10');
    console.log('   - Reduced timeouts (connectTimeout=10s, requestTimeout=5s)');
    console.log('   - MongoDB connection optimizations');
    console.log('   - Automatic retry logic with exponential backoff');
    console.log('   - Enhanced error handling');
    
  } catch (error) {
    console.error('❌ Database test failed:', error.message);
  } finally {
    await prisma.$disconnect();
    process.exit(0);
  }
}

testDatabasePerformance();
