const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testOrdersAfterFix() {
  console.log('🧪 Testing Orders After UserId Fix...\n');

  try {
    // 1. Check users with orders
    console.log('1. 👥 Users with orders after fix:');
    const usersWithOrders = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            id: true,
            confirmationNumber: true,
            status: true,
            total: true,
            createdAt: true,
            orderItems: {
              select: {
                productName: true,
                quantity: true,
                price: true
              }
            }
          },
          orderBy: { createdAt: 'desc' }
        }
      },
      where: {
        orders: {
          some: {}
        }
      }
    });

    usersWithOrders.forEach(user => {
      console.log(`\n👤 ${user.email} (${user.name}):`);
      console.log(`   Total orders: ${user.orders.length}`);
      
      user.orders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order ${order.confirmationNumber}:`);
        console.log(`      - Status: ${order.status}`);
        console.log(`      - Total: $${order.total}`);
        console.log(`      - Date: ${order.createdAt.toLocaleDateString()}`);
        console.log(`      - Items: ${order.orderItems.length}`);
        order.orderItems.forEach((item, i) => {
          console.log(`        ${i + 1}. ${item.productName} (qty: ${item.quantity}) - $${item.price}`);
        });
      });
    });

    // 2. Test specific user orders API simulation
    console.log('\n2. 🔧 Testing orders API for user@techzone.com:');
    
    const testUser = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' },
      select: { id: true, email: true }
    });

    if (testUser) {
      const userOrders = await prisma.order.findMany({
        where: { userId: testUser.id },
        include: {
          orderItems: {
            include: {
              product: {
                select: { id: true, name: true, images: true }
              },
              variant: {
                select: { id: true, sku: true, attributes: true }
              }
            }
          },
          delivery: true
        },
        orderBy: { createdAt: 'desc' },
        take: 5
      });

      console.log(`   Found ${userOrders.length} orders for ${testUser.email}`);
      
      // Format like the API does
      const formattedOrders = userOrders.map(order => ({
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
        },
        payment: {
          method: order.paymentMethod,
          amount: order.total
        }
      }));

      console.log('\n   📋 Formatted orders for frontend:');
      formattedOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order #${order.orderNumber}:`);
        console.log(`      - Status: ${order.status}`);
        console.log(`      - Total: $${order.total}`);
        console.log(`      - Items: ${order.items.length}`);
        order.items.forEach((item, i) => {
          console.log(`        ${i + 1}. ${item.name} (qty: ${item.quantity})`);
        });
      });

      console.log('\n   ✅ Orders API would return:');
      console.log(`   - orders.length: ${formattedOrders.length}`);
      console.log(`   - isLoading: false`);
      console.log(`   - error: null`);
      console.log(`   - isAuthenticated: true`);
    }

    // 3. Summary
    console.log('\n3. 📊 Summary:');
    console.log(`   ✅ Users with orders: ${usersWithOrders.length}`);
    console.log(`   ✅ Total linked orders: ${usersWithOrders.reduce((total, user) => total + user.orders.length, 0)}`);
    
    const totalOrders = await prisma.order.count();
    const nullUserIdOrders = await prisma.order.count({ where: { userId: null } });
    
    console.log(`   ✅ Total orders in database: ${totalOrders}`);
    console.log(`   ✅ Guest orders (null userId): ${nullUserIdOrders}`);
    console.log(`   ✅ Linked orders: ${totalOrders - nullUserIdOrders}`);

    console.log('\n🎯 Next steps:');
    console.log('   1. Sign in as user@techzone.com with password: user123');
    console.log('   2. Go to profile page: http://localhost:3000/profile');
    console.log('   3. Check "Recent Activity" section - should show 2 orders');
    console.log('   4. Try creating a new order while signed in');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrdersAfterFix();
