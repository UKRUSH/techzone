const { PrismaClient } = require('@prisma/client');

// Use singleton pattern
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

async function testOrdersAPI() {
  console.log('🧪 Testing Orders API data format...\n');

  try {
    // Get a user that has orders
    const user = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' },
      select: { id: true, email: true }
    });

    if (!user) {
      console.log('❌ User not found');
      return;
    }

    console.log(`👤 Testing for user: ${user.email} (ID: ${user.id})\n`);

    // Simulate the exact API logic
    const where = {
      userId: user.id
    };

    const orders = await prisma.order.findMany({
      where,
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
      take: 10
    });

    console.log(`📦 Found ${orders.length} orders from database\n`);

    // Format orders exactly like the API does
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
      date: order.createdAt, // Add this field that UI expects
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
        amount: order.total, // Add amount field that UI expects
        details: order.paymentDetails
      },
      shipping: {
        address: `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingCountry}`,
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
        product: item.product,
        variant: item.variant,
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

    console.log('📋 Formatted orders structure:');
    formattedOrders.forEach((order, index) => {
      console.log(`\n${index + 1}. Order #${order.orderNumber}:`);
      console.log(`   - ID: ${order.id}`);
      console.log(`   - Status: ${order.status}`);
      console.log(`   - Total: $${order.total}`);
      console.log(`   - Date: ${order.date}`);
      console.log(`   - Items count: ${order.items.length}`);
      console.log(`   - Items names: ${order.items.map(item => item.name).join(', ')}`);
      console.log(`   - Has shipping address: ${!!order.shippingAddress.address}`);
      console.log(`   - Has payment info: ${!!order.payment.method}`);
    });

    // Test what the frontend UI would see
    console.log('\n🖥️  Frontend UI Test:');
    console.log(`orders.length: ${formattedOrders.length}`);
    console.log(`orders[0].date exists: ${!!formattedOrders[0]?.date}`);
    console.log(`orders[0].items[0].name exists: ${!!formattedOrders[0]?.items[0]?.name}`);
    console.log(`orders[0].orderNumber exists: ${!!formattedOrders[0]?.orderNumber}`);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrdersAPI();
