const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testOrderUserIdFix() {
  console.log('🧪 Testing Order UserId Fix...\n');

  try {
    // 1. Check current orders with null userId
    console.log('1. 📊 Current orders with null userId:');
    const nullOrders = await prisma.order.findMany({
      where: { userId: null },
      select: {
        id: true,
        confirmationNumber: true,
        customerEmail: true,
        customerName: true,
        total: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    console.log(`   Found ${nullOrders.length} orders with null userId:`);
    nullOrders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.confirmationNumber} - ${order.customerEmail} - $${order.total}`);
    });

    // 2. Check users that should have these orders
    console.log('\n2. 👥 Users that might have orders:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        _count: {
          select: { orders: true }
        }
      }
    });

    users.forEach(user => {
      console.log(`   - ${user.email} (${user.name}) - ${user._count.orders} orders`);
    });

    // 3. Try to match null orders to users by email
    console.log('\n3. 🔗 Matching null orders to users by email:');
    let matchedCount = 0;

    for (const order of nullOrders) {
      const user = users.find(u => u.email === order.customerEmail);
      if (user) {
        console.log(`   ✅ Order ${order.confirmationNumber} matches user ${user.email}`);
        
        // Update the order to link it to the user
        try {
          await prisma.order.update({
            where: { id: order.id },
            data: { userId: user.id }
          });
          console.log(`      → Updated order ${order.confirmationNumber} with userId: ${user.id}`);
          matchedCount++;
        } catch (error) {
          console.log(`      ❌ Failed to update order: ${error.message}`);
        }
      } else {
        console.log(`   ❌ Order ${order.confirmationNumber} has no matching user for ${order.customerEmail}`);
      }
    }

    console.log(`\n   📈 Successfully linked ${matchedCount} orders to users`);

    // 4. Verify the fix
    console.log('\n4. ✅ Verification after fix:');
    const updatedUsers = await prisma.user.findMany({
      include: {
        orders: {
          select: {
            confirmationNumber: true,
            total: true,
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    updatedUsers.forEach(user => {
      if (user.orders.length > 0) {
        console.log(`\n   👤 ${user.email} (${user.name}):`);
        user.orders.forEach((order, index) => {
          console.log(`      ${index + 1}. ${order.confirmationNumber} - $${order.total} - ${order.status}`);
        });
      }
    });

    // 5. Check remaining null orders
    const remainingNullOrders = await prisma.order.count({
      where: { userId: null }
    });

    console.log(`\n5. 📊 Summary:`);
    console.log(`   - Orders fixed: ${matchedCount}`);
    console.log(`   - Orders still with null userId: ${remainingNullOrders}`);
    console.log(`   - Total users with orders: ${updatedUsers.filter(u => u.orders.length > 0).length}`);

    if (remainingNullOrders === 0) {
      console.log('\n🎉 All orders are now properly linked to users!');
    } else {
      console.log('\n⚠️ Some orders still have null userId (these might be genuine guest orders)');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testOrderUserIdFix();
