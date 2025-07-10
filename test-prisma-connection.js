const { PrismaClient } = require('@prisma/client');

async function testPrismaConnection() {
  let prisma;
  
  try {
    console.log('🔍 Testing Prisma connection and queries...');
    
    // Create new Prisma client
    prisma = new PrismaClient();
    
    console.log('\n1. Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    console.log('\n2. Testing user count...');
    const userCount = await prisma.user.count();
    console.log(`✅ Users: ${userCount}`);
    
    console.log('\n3. Testing order count...');
    const orderCount = await prisma.order.count();
    console.log(`✅ Orders: ${orderCount}`);
    
    console.log('\n4. Testing complex order query (similar to API)...');
    const testUserId = '686ea9bc5c570aa3683d377c'; // John Doe from our earlier test
    
    const orders = await prisma.order.findMany({
      where: { userId: testUserId },
      include: {
        orderItems: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                images: true
              }
            },
            variant: {
              select: {
                id: true,
                sku: true,
                attributes: true
              }
            }
          }
        },
        delivery: true
      },
      orderBy: { createdAt: 'desc' },
      take: 10
    });
    
    console.log(`✅ Found ${orders.length} orders for test user`);
    
    console.log('\n5. Testing count query...');
    const totalCount = await prisma.order.count({ 
      where: { userId: testUserId } 
    });
    console.log(`✅ Total count: ${totalCount}`);
    
    console.log('\n🎉 All Prisma tests passed! Database connection is working.');
    
  } catch (error) {
    console.error('\n❌ Prisma test failed:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.message.includes('Response from the Engine was empty')) {
      console.error('\n💡 This is the same error we see in the API!');
      console.error('Possible causes:');
      console.error('- Prisma client needs regeneration');
      console.error('- Database connection timeout');
      console.error('- MongoDB connection string issue');
      console.error('- Prisma version incompatibility');
    }
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

testPrismaConnection();
