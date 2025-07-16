const { PrismaClient } = require('@prisma/client');

async function testOrderDetails() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Testing order details in database...');
    
    // Find the user
    const user = await prisma.user.findFirst({
      where: {
        email: 'rush@gmail.com'
      }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', user.email);
    
    // Get orders for this user
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id
      },
      include: {
        orderItems: {
          include: {
            product: true
          }
        }
      }
    });
    
    console.log('📊 Orders found:', orders.length);
    
    if (orders.length > 0) {
      const order = orders[0];
      console.log('\n🔍 First order details:');
      console.log('- ID:', order.id);
      console.log('- Order Number:', order.orderNumber);
      console.log('- Customer Name:', order.customerName);
      console.log('- Customer Email:', order.customerEmail);
      console.log('- Customer Phone:', order.customerPhone);
      console.log('- Shipping Address:', order.shippingAddress);
      console.log('- Shipping City:', order.shippingCity);
      console.log('- Shipping District:', order.shippingDistrict);
      console.log('- Total:', order.total);
      console.log('- Status:', order.status);
      console.log('- Items count:', order.orderItems.length);
      
      if (order.orderItems.length > 0) {
        console.log('\n📦 Order Items:');
        order.orderItems.forEach((item, index) => {
          console.log(`  ${index + 1}. Product Name: ${item.productName || 'No name'}`);
          console.log(`     Product ID: ${item.productId}`);
          console.log(`     Quantity: ${item.quantity}`);
          console.log(`     Price: $${item.price}`);
          console.log(`     Product from relation: ${item.product?.name || 'No product relation'}`);
          console.log('');
        });
      }
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrderDetails();
