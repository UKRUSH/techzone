const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testUserOrdersAPI() {
  console.log('🔍 Testing User Orders API for Recent Activity...\n');

  try {
    // Test 1: Find a user with orders and check their data
    console.log('1. 👤 Finding user with proper order data:');
    const testUser = await prisma.user.findFirst({
      where: {
        email: 'user@techzone.com' // Known test user
      },
      include: {
        orders: {
          include: {
            orderItems: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    if (!testUser) {
      console.log('❌ Test user not found');
      return;
    }

    console.log(`   ✅ Found user: ${testUser.email}`);
    console.log(`   📦 Orders: ${testUser.orders.length}`);

    // Test 2: Simulate the exact API response format
    console.log('\n2. 🔧 Simulating API response format:');
    const apiResponse = {
      success: true,
      orders: testUser.orders.map(order => ({
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
        })),
        shipping: {
          trackingNumber: order.trackingNumber || null,
          address: order.address || 'Standard delivery'
        }
      })),
      pagination: {
        page: 1,
        totalPages: 1,
        total: testUser.orders.length,
        hasNext: false,
        hasPrev: false
      }
    };

    console.log(`   ✅ API response would contain ${apiResponse.orders.length} orders`);
    
    // Test 3: Check each order's data
    console.log('\n3. 📋 Order details for Recent Activity:');
    apiResponse.orders.forEach((order, index) => {
      console.log(`   Order ${index + 1}:`);
      console.log(`     • Number: #${order.orderNumber}`);
      console.log(`     • Status: ${order.status}`);
      console.log(`     • Total: $${order.total}`);
      console.log(`     • Items: ${order.items.length}`);
      if (order.items.length > 0) {
        console.log(`     • First item: ${order.items[0].name} (×${order.items[0].quantity})`);
      }
      console.log(`     • Date: ${new Date(order.date).toLocaleDateString()}`);
    });

    // Test 4: Check if any orders are missing items
    console.log('\n4. ⚠️  Checking for orders without items:');
    const ordersWithoutItems = apiResponse.orders.filter(order => order.items.length === 0);
    if (ordersWithoutItems.length > 0) {
      console.log(`   ❌ Found ${ordersWithoutItems.length} orders without items:`);
      ordersWithoutItems.forEach(order => {
        console.log(`     • Order #${order.orderNumber} - $${order.total} - ${order.status}`);
      });
    } else {
      console.log('   ✅ All orders have items');
    }

    // Test 5: Simulate Recent Activity component logic
    console.log('\n5. 🎯 Recent Activity component simulation:');
    const recentActivityData = apiResponse.orders.slice(0, 3);
    
    if (recentActivityData.length === 0) {
      console.log('   📭 Component would show: "No orders yet" state');
    } else {
      console.log(`   📱 Component would show ${recentActivityData.length} recent orders:`);
      recentActivityData.forEach((order, index) => {
        const statusProgress = {
          'delivered': 100,
          'shipped': 75,
          'processing': 50,
          'confirmed': 50,
          'pending': 25,
          'cancelled': 0
        };
        
        const progress = statusProgress[order.status] || 25;
        console.log(`     ${index + 1}. #${order.orderNumber} - ${order.status} (${progress}% complete)`);
        console.log(`        $${order.total} • ${order.items.length} items • ${new Date(order.date).toLocaleDateString()}`);
      });
    }

    console.log('\n🎉 Test completed successfully!');
    console.log('\n📝 Next steps to fix Recent Activity:');
    console.log('   1. Sign in with user@techzone.com / user123');
    console.log('   2. Go to http://localhost:3002/profile');
    console.log('   3. Check browser console for any errors');
    console.log('   4. Verify the Recent Activity section displays orders');

  } catch (error) {
    console.error('❌ Error during test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserOrdersAPI();
