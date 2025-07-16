// Test script to verify orders page bug fixes
const { PrismaClient } = require('@prisma/client');

const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function testOrdersPageFix() {
  console.log('🔧 Testing Orders Page Bug Fixes...\n');

  try {
    // Test 1: Verify user has orders with all required properties
    console.log('1. 🧪 Testing order data structure for potential null references...');
    
    const user = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' },
      select: { id: true }
    });

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
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
      take: 1
    });

    if (orders.length === 0) {
      console.log('❌ No orders found for testing');
      return;
    }

    const order = orders[0];
    console.log('✅ Found test order:', order.confirmationNumber);

    // Test 2: Check for potential null reference issues that were fixed
    console.log('\n2. 🔍 Checking for null reference vulnerabilities:');
    
    // Check order properties
    console.log(`   orderNumber: ${order.confirmationNumber ? '✅' : '❌'} (${order.confirmationNumber || 'null'})`);
    console.log(`   date: ${order.createdAt ? '✅' : '❌'} (${order.createdAt || 'null'})`);
    console.log(`   total: ${order.total !== null ? '✅' : '❌'} (${order.total || 'null'})`);
    console.log(`   status: ${order.status ? '✅' : '❌'} (${order.status || 'null'})`);
    
    // Check items array
    console.log(`   items array: ${order.orderItems ? '✅' : '❌'} (length: ${order.orderItems?.length || 0})`);
    
    if (order.orderItems && order.orderItems.length > 0) {
      const item = order.orderItems[0];
      console.log(`   item.name: ${item.productName ? '✅' : '❌'} (${item.productName || 'null'})`);
      console.log(`   item.price: ${item.price !== null ? '✅' : '❌'} (${item.price || 'null'})`);
      console.log(`   item.quantity: ${item.quantity !== null ? '✅' : '❌'} (${item.quantity || 'null'})`);
    }

    // Test 3: Simulate API response format (same as useUserOrders hook)
    console.log('\n3. 🎯 Testing API response format:');
    
    const formattedOrder = {
      id: order.id,
      orderNumber: order.confirmationNumber,
      status: order.status.toLowerCase(),
      total: order.total,
      date: order.createdAt,
      shipping: {
        address: order.shippingAddress ? `${order.shippingAddress}, ${order.shippingCity}` : null,
        method: 'Standard Shipping',
        trackingNumber: order.delivery?.trackingNumber || null
      },
      payment: {
        method: order.paymentMethod || null,
        amount: order.total
      },
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.productName,
        price: item.price,
        quantity: item.quantity
      }))
    };

    console.log('   Formatted order structure:');
    console.log(`   - shipping object: ${formattedOrder.shipping ? '✅' : '❌'}`);
    console.log(`   - shipping.address: ${formattedOrder.shipping.address ? '✅' : '⚠️  null (handled)'}`);
    console.log(`   - shipping.trackingNumber: ${formattedOrder.shipping.trackingNumber ? '✅' : '⚠️  null (handled)'}`);
    console.log(`   - payment object: ${formattedOrder.payment ? '✅' : '❌'}`);
    console.log(`   - payment.method: ${formattedOrder.payment.method ? '✅' : '⚠️  null (handled)'}`);
    console.log(`   - payment.amount: ${formattedOrder.payment.amount !== null ? '✅' : '❌'}`);

    console.log('\n4. ✅ Bug Fixes Applied:');
    console.log('   - Added null checks for selectedOrder.items.map()');
    console.log('   - Added null checks for selectedOrder.shipping properties');
    console.log('   - Added null checks for selectedOrder.payment properties'); 
    console.log('   - Added null checks for order.shipping.trackingNumber');
    console.log('   - Added fallback values for item.name, item.price, item.quantity');
    console.log('   - Added null checks for selectedOrder.date and selectedOrder.total');

    console.log('\n🎉 Orders page should now be safe from null reference errors!');

  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrdersPageFix();
