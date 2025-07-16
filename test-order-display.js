const { PrismaClient } = require('@prisma/client');

async function testOrderDisplay() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Get the user and their order
    const user = await prisma.user.findUnique({
      where: { email: 'rush@gmail.com' },
      select: { id: true }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    // Get the order with all the data the API should return
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
    
    if (orders.length === 0) {
      console.log('❌ No orders found');
      return;
    }
    
    const order = orders[0];
    
    console.log('\n🎯 Real Customer Data:');
    console.log(`   Name: ${order.customerName}`);
    console.log(`   Email: ${order.customerEmail}`);
    console.log(`   Phone: ${order.customerPhone}`);
    
    console.log('\n🚚 Real Shipping Data:');
    console.log(`   Address: ${order.shippingAddress}`);
    console.log(`   Address 2: ${order.shippingAddress2 || 'N/A'}`);
    console.log(`   City: ${order.shippingCity}`);
    console.log(`   District: ${order.shippingDistrict}`);
    console.log(`   Postal Code: ${order.shippingPostalCode}`);
    console.log(`   Country: ${order.shippingCountry}`);
    
    console.log('\n📦 Real Order Items:');
    order.orderItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.productName} (Qty: ${item.quantity}, Price: $${item.price})`);
    });
    
    console.log('\n🔧 Frontend Should Display:');
    console.log('✅ Orders List Card:');
    console.log(`   - Customer: ${order.customerName}`);
    console.log(`   - Shipping To: ${order.shippingAddress}, ${order.shippingCity}`);
    console.log(`   - Items: ${order.orderItems.map(item => item.productName).join(', ')}`);
    
    console.log('\n✅ Order Details View:');
    console.log(`   - Customer Info: Name, Email, Phone all available`);
    console.log(`   - Full Address: ${order.shippingAddress}, ${order.shippingCity}, ${order.shippingDistrict} ${order.shippingPostalCode}, ${order.shippingCountry}`);
    console.log(`   - Payment Method: ${order.paymentMethod}`);
    console.log(`   - Items with Details: Each item should show name, quantity, price`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrderDisplay();
