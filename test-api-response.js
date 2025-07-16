const { PrismaClient } = require('@prisma/client');

async function testAPIResponse() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Simulate the exact API query
    const user = await prisma.user.findUnique({
      where: { email: 'rush@gmail.com' },
      select: { id: true }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('👤 User found:', user.id);
    
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      select: {
        id: true,
        confirmationNumber: true,
        status: true,
        total: true,
        subtotal: true,
        tax: true,
        shipping: true,
        createdAt: true,
        customerName: true,
        customerEmail: true,
        customerPhone: true,
        shippingAddress: true,
        shippingAddress2: true,
        shippingCity: true,
        shippingDistrict: true,
        shippingPostalCode: true,
        shippingCountry: true,
        paymentMethod: true,
        orderItems: {
          select: {
            id: true,
            productName: true,
            quantity: true,
            price: true,
            productId: true,
            variantId: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 1
    });
    
    console.log('\n📦 Raw Database Order:');
    console.log(JSON.stringify(orders[0], null, 2));
    
    // Format exactly like the API does
    const formattedOrder = {
      id: orders[0].id,
      orderNumber: orders[0].confirmationNumber,
      status: orders[0].status.toLowerCase(),
      total: orders[0].total,
      date: orders[0].createdAt,
      
      // Customer information
      customerName: orders[0].customerName,
      customerEmail: orders[0].customerEmail,
      customerPhone: orders[0].customerPhone,
      
      // Enhanced shipping information
      shipping: {
        address: orders[0].shippingAddress,
        address2: orders[0].shippingAddress2,
        city: orders[0].shippingCity,
        district: orders[0].shippingDistrict,
        postalCode: orders[0].shippingPostalCode,
        country: orders[0].shippingCountry,
        method: 'Standard Delivery',
        trackingNumber: `LK${orders[0].id}TZ`,
        estimatedDelivery: new Date(orders[0].createdAt.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      
      // Enhanced payment information
      payment: {
        method: orders[0].paymentMethod,
        amount: orders[0].total,
        subtotal: orders[0].subtotal,
        tax: orders[0].tax,
        shippingCost: orders[0].shipping || 0
      },
      
      // Order items with enhanced details
      items: orders[0].orderItems.map(item => ({
        id: item.id,
        name: item.productName, // This is the key - API returns 'name' but database has 'productName'
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
        productId: item.productId,
        variantId: item.variantId
      }))
    };
    
    console.log('\n📡 Formatted API Response:');
    console.log(JSON.stringify(formattedOrder, null, 2));
    
    console.log('\n🔍 Key Issue Found:');
    console.log('Database field: orderItems[].productName =', orders[0].orderItems[0]?.productName);
    console.log('API maps to: items[].name =', formattedOrder.items[0]?.name);
    console.log('Frontend looks for: item.name || item.productName');
    
    console.log('\n✅ The mapping should work correctly!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAPIResponse();
