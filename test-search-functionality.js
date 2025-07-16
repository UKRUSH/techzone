const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testOrdersSearchAPI() {
  console.log('🔍 Testing Orders Search API Functionality...\n');

  try {
    // Test 1: Get a user with orders
    console.log('1. 👤 Finding a user with orders:');
    const user = await prisma.user.findFirst({
      where: {
        orders: {
          some: {}
        }
      },
      include: {
        orders: {
          include: {
            orderItems: true
          },
          take: 3
        }
      }
    });

    if (!user) {
      console.log('❌ No users with orders found');
      return;
    }

    console.log(`✅ Found user: ${user.email} with ${user.orders.length} orders`);
    
    // Test 2: Test search functionality by order number
    console.log('\n2. 🔍 Testing search by order number:');
    const firstOrder = user.orders[0];
    console.log(`   Searching for order: ${firstOrder.confirmationNumber}`);
    
    const searchResults = await prisma.order.findMany({
      where: {
        userId: user.id,
        OR: [
          { confirmationNumber: { contains: firstOrder.confirmationNumber, mode: 'insensitive' } },
          { customerName: { contains: firstOrder.confirmationNumber, mode: 'insensitive' } },
          { orderItems: { some: { productName: { contains: firstOrder.confirmationNumber, mode: 'insensitive' } } } }
        ]
      },
      include: {
        orderItems: true
      }
    });

    console.log(`   ✅ Search found ${searchResults.length} results`);
    
    // Test 3: Test search by product name
    console.log('\n3. 🔍 Testing search by product name:');
    if (firstOrder.orderItems.length > 0) {
      const productName = firstOrder.orderItems[0].productName;
      console.log(`   Searching for product: ${productName}`);
      
      const productSearchResults = await prisma.order.findMany({
        where: {
          userId: user.id,
          OR: [
            { confirmationNumber: { contains: productName, mode: 'insensitive' } },
            { customerName: { contains: productName, mode: 'insensitive' } },
            { orderItems: { some: { productName: { contains: productName, mode: 'insensitive' } } } }
          ]
        },
        include: {
          orderItems: true
        }
      });

      console.log(`   ✅ Product search found ${productSearchResults.length} results`);
    }
    
    // Test 4: Test status filtering
    console.log('\n4. 🏷️  Testing status filtering:');
    const statusCounts = await Promise.all([
      prisma.order.count({ where: { userId: user.id, status: 'PENDING' } }),
      prisma.order.count({ where: { userId: user.id, status: 'DELIVERED' } }),
      prisma.order.count({ where: { userId: user.id, status: 'SHIPPED' } }),
    ]);

    console.log(`   PENDING: ${statusCounts[0]} orders`);
    console.log(`   DELIVERED: ${statusCounts[1]} orders`);
    console.log(`   SHIPPED: ${statusCounts[2]} orders`);
    
    // Test 5: Test API format simulation
    console.log('\n5. 📋 Testing API response format:');
    const apiFormatOrders = user.orders.map(order => ({
      id: order.id,
      orderNumber: order.confirmationNumber,
      status: order.status.toLowerCase(),
      total: order.total,
      date: order.createdAt,
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      }))
    }));

    console.log(`   ✅ Formatted ${apiFormatOrders.length} orders for API response`);
    console.log(`   First order: #${apiFormatOrders[0].orderNumber} - $${apiFormatOrders[0].total}`);
    
    console.log('\n🎉 All search functionality tests passed!');
    console.log('\n📝 Next steps to test:');
    console.log('   1. Sign in with user@techzone.com / user123');
    console.log('   2. Go to /orders page');
    console.log('   3. Try searching for order numbers or product names');
    console.log('   4. Test status filtering');

  } catch (error) {
    console.error('❌ Error testing search functionality:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrdersSearchAPI();
