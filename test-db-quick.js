const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function quickTest() {
  try {
    console.log('🔄 Testing database...');
    
    // Test connection
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Test user count
    const userCount = await prisma.user.count();
    console.log('👥 Total users:', userCount);
    
    // Test order count
    const orderCount = await prisma.order.count();
    console.log('📦 Total orders:', orderCount);
    
    // Test specific user
    const testUser = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' },
      select: { id: true, email: true }
    });
    
    if (testUser) {
      console.log('👤 Test user found:', testUser.email);
      
      // Get orders for this user
      const userOrders = await prisma.order.findMany({
        where: { userId: testUser.id },
        select: { id: true, confirmationNumber: true, status: true, total: true }
      });
      
      console.log('📋 User orders:', userOrders.length);
      userOrders.forEach((order, index) => {
        console.log(`  ${index + 1}. ${order.confirmationNumber} - ${order.status} - $${order.total}`);
      });
    } else {
      console.log('❌ Test user not found');
    }
    
    await prisma.$disconnect();
    console.log('✅ Test completed');
    
  } catch (error) {
    console.error('❌ Database error:', error.message);
    if (error.code === 'P1001') {
      console.error('   This is a connection timeout error');
      console.error('   Check your database connection string');
    }
    process.exit(1);
  }
}

quickTest();
