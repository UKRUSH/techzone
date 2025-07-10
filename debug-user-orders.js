const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function debugUserOrders() {
  try {
    console.log('🔍 Debugging user orders issue...');
    
    // Check all users and their orders
    console.log('\n1. All users and their orders:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        orders: {
          select: {
            id: true,
            confirmationNumber: true,
            status: true,
            total: true,
            customerEmail: true,
            createdAt: true
          }
        }
      }
    });
    
    users.forEach(user => {
      console.log(`\n👤 User: ${user.name} (${user.email})`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Orders: ${user.orders.length}`);
      
      if (user.orders.length > 0) {
        user.orders.forEach((order, i) => {
          console.log(`   ${i+1}. ${order.confirmationNumber} - ${order.status} - $${order.total} - Customer: ${order.customerEmail}`);
        });
      } else {
        console.log('   No orders found');
      }
    });
    
    // Check orders without userId (guest orders)
    console.log('\n2. Guest orders (no userId):');
    const guestOrders = await prisma.order.findMany({
      where: { userId: null },
      select: {
        id: true,
        confirmationNumber: true,
        status: true,
        total: true,
        customerEmail: true,
        customerName: true,
        createdAt: true
      }
    });
    
    console.log(`Found ${guestOrders.length} guest orders:`);
    guestOrders.forEach((order, i) => {
      console.log(`   ${i+1}. ${order.confirmationNumber} - ${order.customerName} (${order.customerEmail}) - ${order.status} - $${order.total}`);
    });
    
    // Check if there are orders with wrong email associations
    console.log('\n3. All orders with email check:');
    const allOrders = await prisma.order.findMany({
      select: {
        id: true,
        confirmationNumber: true,
        userId: true,
        customerEmail: true,
        customerName: true,
        status: true,
        total: true,
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });
    
    console.log(`Total orders in database: ${allOrders.length}`);
    allOrders.forEach((order, i) => {
      const userMatch = order.user?.email === order.customerEmail ? '✅' : '❌';
      console.log(`   ${i+1}. ${order.confirmationNumber} - User ID: ${order.userId || 'NULL'} - Customer: ${order.customerEmail} - DB User: ${order.user?.email || 'N/A'} ${userMatch}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugUserOrders();
