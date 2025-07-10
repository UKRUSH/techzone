const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function checkAndFixOrders() {
  try {
    console.log('🔍 Checking orders status...\n');
    
    // Get all orders
    const allOrders = await prisma.order.findMany({
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    
    console.log(`Found ${allOrders.length} total orders`);
    
    // Check orders with null userId
    const nullUserIdOrders = await prisma.order.findMany({
      where: {
        userId: null
      }
    });
    
    console.log(`Orders with NULL userId: ${nullUserIdOrders.length}`);
    console.log(`Orders with valid userId: ${allOrders.length - nullUserIdOrders.length}\n`);
    
    if (nullUserIdOrders.length > 0) {
      console.log('🔧 Fixing orders with null userId...\n');
      
      for (const order of nullUserIdOrders) {
        console.log(`Checking order ${order.id} (${order.customerEmail})`);
        
        // Find user by email
        const user = await prisma.user.findUnique({
          where: { email: order.customerEmail }
        });
        
        if (user) {
          // Update order with correct userId
          await prisma.order.update({
            where: { id: order.id },
            data: { userId: user.id }
          });
          console.log(`✅ Fixed order ${order.id} - linked to user ${user.name}`);
        } else {
          console.log(`❌ No user found for email ${order.customerEmail} - keeping as guest order`);
        }
      }
    }
    
    // Final status check
    const finalNullOrders = await prisma.order.findMany({
      where: {
        userId: null
      }
    });
    
    console.log(`\n📊 Final Status:`);
    console.log(`- Total orders: ${allOrders.length}`);
    console.log(`- Orders with NULL userId: ${finalNullOrders.length}`);
    console.log(`- Orders with valid userId: ${allOrders.length - finalNullOrders.length}`);
    
    // Test user order fetch
    console.log(`\n🧪 Testing user order fetch...`);
    const testUser = await prisma.user.findUnique({
      where: { email: 'user@techzone.com' }
    });
    
    if (testUser) {
      const userOrders = await prisma.order.findMany({
        where: { userId: testUser.id },
        include: {
          orderItems: true
        }
      });
      console.log(`User ${testUser.name} has ${userOrders.length} orders`);
      userOrders.forEach(order => {
        console.log(`  - Order ${order.id}: Rs. ${order.total} (${order.status})`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkAndFixOrders();
