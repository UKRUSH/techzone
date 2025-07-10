const { PrismaClient } = require('@prisma/client');

// Use singleton pattern
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function testRealOrdersAPI() {
  console.log('🧪 Testing Real Orders API endpoint...\n');

  try {
    // Start the server if not running and test the actual API
    const fetch = (await import('node-fetch')).default;
    
    console.log('1. 🔍 Testing unauthenticated request...');
    const unauthResponse = await fetch('http://localhost:3000/api/user/orders');
    console.log(`   Status: ${unauthResponse.status}`);
    
    if (!unauthResponse.ok) {
      const errorText = await unauthResponse.text();
      console.log(`   Response: ${errorText}`);
    }
    
    console.log('\n2. 📊 Checking what orders data structure looks like from database...');
    
    // Get user and orders directly from database
    const user = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' },
      select: { id: true, email: true }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    const orders = await prisma.order.findMany({
      where: { userId: user.id },
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
      orderBy: { createdAt: 'desc' }
    });

    console.log(`   Found ${orders.length} orders for ${user.email}`);
    
    orders.forEach((order, index) => {
      console.log(`\n   Order ${index + 1}:`);
      console.log(`   - ID: ${order.id}`);
      console.log(`   - Confirmation: ${order.confirmationNumber}`);
      console.log(`   - Status: ${order.status}`);
      console.log(`   - Total: $${order.total}`);
      console.log(`   - Items: ${order.orderItems.length}`);
      order.orderItems.forEach((item, i) => {
        console.log(`     ${i + 1}. ${item.productName} (qty: ${item.quantity}, price: $${item.price})`);
      });
    });

    console.log('\n3. 🧪 Testing orders API response format...');
    
    // Simulate the exact API response format
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

    console.log('\n   Formatted response structure:');
    console.log(`   - Orders count: ${formattedOrders.length}`);
    
    if (formattedOrders.length > 0) {
      const firstOrder = formattedOrders[0];
      console.log('\n   First order structure:');
      console.log(`   - Has orderNumber: ${!!firstOrder.orderNumber}`);
      console.log(`   - Has date: ${!!firstOrder.date}`);
      console.log(`   - Has status: ${!!firstOrder.status}`);
      console.log(`   - Has items array: ${Array.isArray(firstOrder.items)}`);
      console.log(`   - Items count: ${firstOrder.items.length}`);
      console.log(`   - First item has name: ${!!firstOrder.items[0]?.name}`);
      console.log(`   - Has shipping: ${!!firstOrder.shipping}`);
      console.log(`   - Has payment: ${!!firstOrder.payment}`);
    }

    console.log('\n4. 🎯 Checking what the frontend expects vs what API provides...');
    
    // Check each field the frontend uses
    const frontendChecks = {
      'order.orderNumber': formattedOrders[0]?.orderNumber,
      'order.status': formattedOrders[0]?.status,
      'order.total': formattedOrders[0]?.total,
      'order.date': formattedOrders[0]?.date,
      'order.items.length': formattedOrders[0]?.items?.length,
      'order.items[0].name': formattedOrders[0]?.items?.[0]?.name,
      'order.shipping.trackingNumber': formattedOrders[0]?.shipping?.trackingNumber,
      'order.payment.amount': formattedOrders[0]?.payment?.amount
    };

    Object.entries(frontendChecks).forEach(([field, value]) => {
      console.log(`   ${field}: ${value !== undefined ? '✅' : '❌'} (${value})`);
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testRealOrdersAPI();
