const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testOrdersAPI() {
  try {
    console.log('🔄 Testing database connection and orders API...');
    
    // Test 1: Basic connection
    console.log('\n1. Testing basic database connection...');
    const userCount = await prisma.user.count();
    console.log(`✅ Database connected. Total users: ${userCount}`);
    
    // Test 2: Count orders
    console.log('\n2. Testing order count...');
    const orderCount = await prisma.order.count();
    console.log(`✅ Total orders in database: ${orderCount}`);
    
    // Test 3: Find a test user
    console.log('\n3. Looking for test users...');
    const users = await prisma.user.findMany({
      take: 3,
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    console.log('✅ Found users:', users);
    
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\n4. Testing orders for user: ${testUser.email}`);
      
      // Test 4: Get orders for a specific user
      const userOrders = await prisma.order.findMany({
        where: {
          userId: testUser.id
        },
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
        take: 5
      });
      
      console.log(`✅ Found ${userOrders.length} orders for user ${testUser.email}`);
      
      if (userOrders.length > 0) {
        console.log('📦 Sample order:', {
          id: userOrders[0].id,
          confirmationNumber: userOrders[0].confirmationNumber,
          status: userOrders[0].status,
          total: userOrders[0].total,
          itemCount: userOrders[0].orderItems.length,
          createdAt: userOrders[0].createdAt
        });
      }
    }
    
    console.log('\n✅ All database tests passed!');
    
  } catch (error) {
    console.error('\n❌ Database test failed:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
  } finally {
    await prisma.$disconnect();
  }
}

testOrdersAPI();
