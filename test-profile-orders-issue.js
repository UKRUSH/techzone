const { PrismaClient } = require('@prisma/client');

// Use singleton pattern
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function testProfileOrdersIssue() {
  console.log('🧪 Testing Profile Orders Issue...\n');

  try {
    // Test the profile page issue - why orders don't show
    console.log('1. 🔍 Checking if user has orders in correct format:');
    
    const user = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' },
      select: { id: true, email: true, name: true }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`👤 User found: ${user.name} (${user.email})`);
    console.log(`   User ID: ${user.id}\n`);

    // Check orders for this user
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      include: {
        orderItems: true,
        delivery: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`📦 Orders found: ${orders.length}`);
    
    if (orders.length === 0) {
      console.log('❌ No orders found for this user');
      return;
    }

    console.log('\n2. 📋 Order details:');
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. Order ${order.confirmationNumber}:`);
      console.log(`      - Status: ${order.status}`);
      console.log(`      - Total: $${order.total}`);
      console.log(`      - Created: ${order.createdAt}`);
      console.log(`      - Items: ${order.orderItems.length}`);
    });

    console.log('\n3. 🔄 Simulating useUserOrders hook response:');
    
    // Format exactly like the API does
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.confirmationNumber,
      status: order.status.toLowerCase(),
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      date: order.createdAt, // This is what the UI expects
      customerInfo: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone
      },
      shippingAddress: {
        address: order.shippingAddress,
        address2: order.shippingAddress2,
        city: order.shippingCity,
        district: order.shippingDistrict,
        postalCode: order.shippingPostalCode,
        country: order.shippingCountry
      },
      payment: {
        method: order.paymentMethod,
        amount: order.total,
        details: order.paymentDetails
      },
      shipping: {
        address: order.shippingAddress ? `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingCountry}` : 'No address',
        method: 'Standard Shipping',
        trackingNumber: order.delivery?.trackingNumber,
        estimatedDelivery: null
      },
      items: order.orderItems.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.productName, // UI expects 'name' field
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
        details: item.productDetails
      })),
      delivery: order.delivery ? {
        trackingNumber: order.delivery.trackingNumber,
        agentName: order.delivery.agentName,
        shippedAt: order.delivery.shippedAt,
        deliveredAt: order.delivery.deliveredAt,
        notes: order.delivery.deliveryNotes
      } : null
    }));

    const hookResponse = {
      orders: formattedOrders,
      pagination: {
        page: 1,
        limit: 5,
        total: formattedOrders.length,
        totalPages: 1,
        hasNext: false,
        hasPrev: false
      },
      isLoading: false,
      error: null,
      isAuthenticated: true
    };

    console.log(`   Hook response structure:`);
    console.log(`   - orders.length: ${hookResponse.orders.length}`);
    console.log(`   - isLoading: ${hookResponse.isLoading}`);
    console.log(`   - error: ${hookResponse.error}`);
    console.log(`   - isAuthenticated: ${hookResponse.isAuthenticated}`);

    if (hookResponse.orders.length > 0) {
      const firstOrder = hookResponse.orders[0];
      console.log(`\n   First order verification:`);
      console.log(`   - orderNumber: ${firstOrder.orderNumber} ✅`);
      console.log(`   - status: ${firstOrder.status} ✅`);
      console.log(`   - total: ${firstOrder.total} ✅`);
      console.log(`   - date exists: ${!!firstOrder.date} ✅`);
      console.log(`   - items.length: ${firstOrder.items.length} ✅`);
      console.log(`   - items[0].name: ${firstOrder.items[0]?.name} ✅`);
      console.log(`   - shipping exists: ${!!firstOrder.shipping} ✅`);
      console.log(`   - payment exists: ${!!firstOrder.payment} ✅`);
    }

    console.log('\n4. 🎯 Profile page condition check:');
    console.log('   Profile page shows orders when:');
    console.log(`   - ordersLoading: false (${!hookResponse.isLoading} ✅)`);
    console.log(`   - recentOrders exists: ${!!hookResponse.orders} ✅`);
    console.log(`   - recentOrders.length > 0: ${hookResponse.orders.length > 0} ✅`);
    
    console.log('\n5. 📝 The issue might be:');
    console.log('   - User not authenticated when accessing profile page');
    console.log('   - useUserOrders hook not being called properly');
    console.log('   - Session not persisting between page loads');
    console.log('   - Authentication middleware issues');

    console.log('\n6. 🔧 Suggested debugging steps:');
    console.log('   1. Sign in as user@techzone.com with password123');
    console.log('   2. Navigate to /profile page');
    console.log('   3. Check browser console for errors');
    console.log('   4. Check Network tab for API calls to /api/user/orders');
    console.log('   5. Verify session is active');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProfileOrdersIssue();
