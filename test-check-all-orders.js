const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkAllUserOrders() {
  try {
    console.log('🔄 Checking orders for all users...');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    
    console.log(`\nFound ${users.length} users:`);
    
    for (const user of users) {
      const userOrders = await prisma.order.findMany({
        where: {
          userId: user.id
        },
        select: {
          id: true,
          confirmationNumber: true,
          status: true,
          total: true,
          createdAt: true,
          customerName: true,
          customerEmail: true
        }
      });
      
      console.log(`\n👤 User: ${user.name} (${user.email})`);
      console.log(`   Orders: ${userOrders.length}`);
      
      if (userOrders.length > 0) {
        userOrders.forEach((order, index) => {
          console.log(`   ${index + 1}. Order ${order.confirmationNumber} - ${order.status} - $${order.total}`);
        });
      }
    }
    
    // Also check orders without userId (guest orders)
    console.log('\n🛒 Checking guest orders (no userId)...');
    const guestOrders = await prisma.order.findMany({
      where: {
        userId: null
      },
      select: {
        id: true,
        confirmationNumber: true,
        status: true,
        total: true,
        customerName: true,
        customerEmail: true
      }
    });
    
    console.log(`Found ${guestOrders.length} guest orders:`);
    guestOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. Order ${order.confirmationNumber} - ${order.customerName} (${order.customerEmail}) - ${order.status} - $${order.total}`);
    });
    
  } catch (error) {
    console.error('❌ Error checking orders:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAllUserOrders();
