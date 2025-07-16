const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testRecentActivityIssue() {
  console.log('🔍 Testing Recent Activity Section Issue...\n');

  try {
    // 1. Check users with orders
    console.log('1. 👥 Users with orders:');
    const usersWithOrders = await prisma.user.findMany({
      where: { orders: { some: {} } },
      include: {
        orders: {
          include: { orderItems: true },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    usersWithOrders.forEach(user => {
      console.log(`   📧 ${user.email} - ${user.orders.length} orders`);
    });

    // 2. Test specific user API format
    console.log('\n2. 🧪 Testing API response format for user@techzone.com:');
    
    const testUser = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' },
      include: {
        orders: {
          include: {
            orderItems: {
              include: {
                product: { select: { id: true, name: true, images: true } },
                variant: { select: { id: true, sku: true, attributes: true } }
              }
            },
            delivery: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    });

    if (testUser) {
      console.log(`   ✅ Found user: ${testUser.email}`);
      console.log(`   📦 Orders count: ${testUser.orders.length}`);
      
      // Format orders like the API does
      const formattedOrders = testUser.orders.map(order => ({
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
          address: order.shippingAddress ? `${order.shippingAddress}, ${order.shippingCity}` : 'No address',
          method: 'Standard Shipping',
          trackingNumber: order.delivery?.trackingNumber
        }
      }));

      console.log('\n   📋 Formatted orders for Recent Activity:');
      formattedOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order #${order.orderNumber}:`);
        console.log(`      - Status: ${order.status}`);
        console.log(`      - Total: $${order.total}`);
        console.log(`      - Date: ${order.date.toLocaleDateString()}`);
        console.log(`      - Items: ${order.items.length}`);
        order.items.forEach((item, i) => {
          console.log(`        ${i + 1}. ${item.name} (qty: ${item.quantity})`);
        });
      });

      // 3. Test the exact useUserOrders API call
      console.log('\n3. 🔍 Testing useUserOrders hook simulation:');
      console.log('   Hook should call: /api/user/orders?limit=5');
      console.log('   Expected response:');
      console.log(`   {`);
      console.log(`     orders: [${formattedOrders.length} orders],`);
      console.log(`     pagination: { page: 1, totalPages: 1, total: ${formattedOrders.length} },`);
      console.log(`     success: true`);
      console.log(`   }`);
    }

    // 4. Check Recent Activity section conditions
    console.log('\n4. 🎯 Recent Activity Section Debug:');
    console.log('   Conditions to check:');
    console.log('   - ordersLoading: should be false');
    console.log('   - recentOrders: should be array with orders');
    console.log('   - recentOrders.length > 0: should be true');
    console.log('   - User authentication: required');
    
    console.log('\n📝 Debug Steps:');
    console.log('   1. Sign in with: user@techzone.com / user123');
    console.log('   2. Go to: http://localhost:3001/profile');
    console.log('   3. Check browser console for API errors');
    console.log('   4. Look for "Recent Activity" section');
    console.log('   5. Should show 3 orders with progress bars');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRecentActivityIssue();
