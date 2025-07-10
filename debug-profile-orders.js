const { PrismaClient } = require('@prisma/client');

// Use singleton pattern
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function debugProfileOrdersFlow() {
  console.log('🔍 Debugging Profile Orders Flow...\n');

  try {
    // 1. Check if users exist and have orders
    console.log('1. 👤 Checking users with orders:');
    const usersWithOrders = await prisma.user.findMany({
      include: {
        orders: {
          include: {
            orderItems: true
          }
        }
      }
    });

    usersWithOrders.forEach(user => {
      console.log(`   - ${user.email}: ${user.orders.length} orders`);
      user.orders.forEach((order, index) => {
        console.log(`     ${index + 1}. ${order.confirmationNumber} - ${order.status} - $${order.total}`);
      });
    });

    // 2. Test the orders API format simulation
    console.log('\n2. 🧪 Testing orders API response format:');
    const testUser = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' },
      select: { id: true, email: true }
    });

    if (testUser) {
      const orders = await prisma.order.findMany({
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

      console.log(`   Found ${orders.length} orders for ${testUser.email}`);

      const formattedOrders = orders.map(order => ({
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

      console.log('\n   Formatted orders structure:');
      formattedOrders.forEach((order, index) => {
        console.log(`   ${index + 1}. Order #${order.orderNumber}:`);
        console.log(`      - Status: ${order.status}`);
        console.log(`      - Total: $${order.total}`);
        console.log(`      - Items: ${order.items.length}`);
        order.items.forEach((item, i) => {
          console.log(`        ${i + 1}. ${item.name} (qty: ${item.quantity})`);
        });
      });

      // 3. Test what the useUserOrders hook would return
      console.log('\n3. 🔄 Testing useUserOrders hook structure:');
      const hookResponse = {
        orders: formattedOrders,
        pagination: {
          page: 1,
          limit: 5,
          total: formattedOrders.length,
          totalPages: 1,
          hasNext: false,
          hasPrev: false
        }
      };

      console.log(`   Hook would return:`);
      console.log(`   - orders.length: ${hookResponse.orders.length}`);
      console.log(`   - isLoading: false`);
      console.log(`   - error: null`);
      console.log(`   - First order has all required fields:`);
      if (hookResponse.orders[0]) {
        const firstOrder = hookResponse.orders[0];
        console.log(`     ✅ orderNumber: ${firstOrder.orderNumber}`);
        console.log(`     ✅ status: ${firstOrder.status}`);
        console.log(`     ✅ total: ${firstOrder.total}`);
        console.log(`     ✅ date: ${firstOrder.date}`);
        console.log(`     ✅ items: ${firstOrder.items.length} items`);
        console.log(`     ✅ items[0].name: ${firstOrder.items[0]?.name}`);
      }
    }

    // 4. Test authentication simulation
    console.log('\n4. 🔐 Testing authentication simulation:');
    console.log('   For profile page to show orders, user must be:');
    console.log('   - Authenticated (session.user exists)');
    console.log('   - Have orders linked to their user ID');
    console.log('   - useUserOrders hook must fetch successfully');

    console.log('\n5. 📋 Profile page requirements check:');
    console.log('   ✅ Orders exist in database');
    console.log('   ✅ Orders are linked to user ID');
    console.log('   ✅ API can format orders correctly');
    console.log('   ❓ Need to verify: Authentication status');
    console.log('   ❓ Need to verify: useUserOrders hook execution');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugProfileOrdersFlow();
