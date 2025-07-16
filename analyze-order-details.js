const { PrismaClient } = require('@prisma/client');

async function analyzeOrderDetails() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Get all orders to analyze what data is available
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
        user: {
          select: {
            email: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: 3 // Just get a few recent orders for analysis
    });
    
    console.log('\n📋 Current Order Details Analysis:');
    if (orders.length === 0) {
      console.log('   ❌ No orders found in database');
      return;
    }
    
    orders.forEach((order, index) => {
      console.log(`\n📦 Order ${index + 1}:`);
      console.log(`   ID: ${order.id}`);
      console.log(`   Confirmation Number: ${order.confirmationNumber || 'NOT SET'}`);
      console.log(`   User: ${order.user?.email || 'NO USER'}`);
      console.log(`   Customer: ${order.customerName || 'NOT SET'}`);
      console.log(`   Status: ${order.status || 'NOT SET'}`);
      console.log(`   Total: $${order.total || 0}`);
      console.log(`   Created: ${order.createdAt}`);
      
      // Shipping details
      console.log(`   Shipping Address: ${order.shippingAddress || 'NOT SET'}`);
      console.log(`   Shipping City: ${order.shippingCity || 'NOT SET'}`);
      console.log(`   Shipping District: ${order.shippingDistrict || 'NOT SET'}`);
      console.log(`   Shipping Postal Code: ${order.shippingPostalCode || 'NOT SET'}`);
      console.log(`   Shipping Country: ${order.shippingCountry || 'NOT SET'}`);
      
      // Payment details
      console.log(`   Payment Method: ${order.paymentMethod || 'NOT SET'}`);
      console.log(`   Subtotal: $${order.subtotal || 'NOT SET'}`);
      console.log(`   Tax: $${order.tax || 'NOT SET'}`);
      console.log(`   Shipping Cost: $${order.shipping || 'NOT SET'}`);
      
      // Customer contact details
      console.log(`   Customer Email: ${order.customerEmail || 'NOT SET'}`);
      console.log(`   Customer Phone: ${order.customerPhone || 'NOT SET'}`);
      
      // Order items
      console.log(`   Order Items (${order.orderItems.length}):`);
      if (order.orderItems.length === 0) {
        console.log('     ❌ No order items found');
      } else {
        order.orderItems.forEach((item, itemIndex) => {
          console.log(`     ${itemIndex + 1}. Product: ${item.productName || 'Unknown'}`);
          console.log(`        Quantity: ${item.quantity || 0}`);
          console.log(`        Price: $${item.price || 0}`);
          console.log(`        Product ID: ${item.productId || 'NOT SET'}`);
          console.log(`        Variant ID: ${item.variantId || 'NOT SET'}`);
        });
      }
    });
    
    console.log('\n🔍 Missing Details Analysis:');
    const sampleOrder = orders[0];
    
    const missingFields = [];
    if (!sampleOrder.confirmationNumber) missingFields.push('Confirmation Number');
    if (!sampleOrder.shippingDistrict) missingFields.push('Shipping District');
    if (!sampleOrder.shippingPostalCode) missingFields.push('Postal Code');
    if (!sampleOrder.customerPhone) missingFields.push('Customer Phone');
    if (!sampleOrder.subtotal) missingFields.push('Subtotal');
    if (!sampleOrder.tax) missingFields.push('Tax');
    if (!sampleOrder.shipping) missingFields.push('Shipping Cost');
    
    if (missingFields.length > 0) {
      console.log('❌ Missing order details:', missingFields.join(', '));
    } else {
      console.log('✅ All order details are present');
    }
    
    console.log('\n🔧 Frontend Display Issues:');
    console.log('1. Orders show in list but details view may be incomplete');
    console.log('2. Need to enhance order detail display with all available fields');
    console.log('3. Missing fields should be handled gracefully');
    console.log('4. Consider adding tracking information, delivery estimates');
    
    // Test API format
    console.log('\n📡 API Format Test:');
    const formattedOrder = {
      id: sampleOrder.id,
      orderNumber: sampleOrder.confirmationNumber,
      status: sampleOrder.status?.toLowerCase(),
      total: sampleOrder.total,
      date: new Date(sampleOrder.createdAt).toLocaleDateString(),
      customerName: sampleOrder.customerName,
      customerEmail: sampleOrder.customerEmail,
      customerPhone: sampleOrder.customerPhone,
      shippingAddress: sampleOrder.shippingAddress,
      shippingCity: sampleOrder.shippingCity,
      shippingDistrict: sampleOrder.shippingDistrict,
      shippingPostalCode: sampleOrder.shippingPostalCode,
      paymentMethod: sampleOrder.paymentMethod,
      subtotal: sampleOrder.subtotal,
      tax: sampleOrder.tax,
      shipping: sampleOrder.shipping,
      items: sampleOrder.orderItems.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      shipping: {
        address: `${sampleOrder.shippingAddress}, ${sampleOrder.shippingCity}`,
        district: sampleOrder.shippingDistrict,
        postalCode: sampleOrder.shippingPostalCode,
        method: 'Standard Delivery',
        trackingNumber: `LK${sampleOrder.id}TZ`,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      payment: {
        method: sampleOrder.paymentMethod,
        amount: sampleOrder.total
      }
    };
    
    console.log('Enhanced order format:', JSON.stringify(formattedOrder, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

analyzeOrderDetails();
