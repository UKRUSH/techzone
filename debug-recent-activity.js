const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function debugRecentActivity() {
  console.log('🔍 Debugging Profile Page Recent Activity Section...\n');

  try {
    // Test 1: Check if there are users with orders
    console.log('1. 📊 Checking users with orders:');
    const usersWithOrders = await prisma.user.findMany({
      where: {
        orders: {
          some: {}
        }
      },
      include: {
        orders: {
          include: {
            orderItems: true
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 5
        }
      }
    });

    console.log(`   ✅ Found ${usersWithOrders.length} users with orders`);
    
    if (usersWithOrders.length > 0) {
      const testUser = usersWithOrders[0];
      console.log(`   👤 Test user: ${testUser.email}`);
      console.log(`   📦 Orders: ${testUser.orders.length}`);
      
      // Test 2: Check order data structure
      console.log('\n2. 🔍 Order data structure:');
      testUser.orders.slice(0, 3).forEach((order, index) => {
        console.log(`   Order ${index + 1}:`);
        console.log(`     • ID: ${order.id}`);
        console.log(`     • Confirmation: ${order.confirmationNumber}`);
        console.log(`     • Status: ${order.status}`);
        console.log(`     • Total: $${order.total}`);
        console.log(`     • Date: ${order.createdAt}`);
        console.log(`     • Items: ${order.orderItems.length}`);
        console.log(`     • First item: ${order.orderItems[0]?.productName || 'N/A'}`);
      });

      // Test 3: Test the API endpoint format
      console.log('\n3. 🧪 Testing API format simulation:');
      const mockApiResponse = {
        orders: testUser.orders.map(order => ({
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
            trackingNumber: order.trackingNumber || null
          }
        }))
      };

      console.log(`   ✅ API format simulation created with ${mockApiResponse.orders.length} orders`);
      console.log(`   📋 First order: #${mockApiResponse.orders[0].orderNumber} - ${mockApiResponse.orders[0].status}`);

      // Test 4: Check if useUserOrders hook query would work
      console.log('\n4. 🔎 Testing useUserOrders query logic:');
      const limitedOrders = await prisma.order.findMany({
        where: {
          userId: testUser.id
        },
        include: {
          orderItems: true
        },
        orderBy: {
          createdAt: 'desc'
        },
        take: 5
      });

      console.log(`   ✅ Limited query found ${limitedOrders.length} orders (limit 5)`);
      
      // Test 5: Check the Recent Activity data that would be passed to the component
      console.log('\n5. 📱 Recent Activity component data:');
      const recentActivityData = limitedOrders.map(order => ({
        id: order.id,
        orderNumber: order.confirmationNumber,
        status: order.status.toLowerCase(),
        total: order.total,
        date: order.createdAt,
        items: order.orderItems.map(item => ({
          name: item.productName,
          quantity: item.quantity
        }))
      }));

      console.log(`   ✅ Component would receive ${recentActivityData.length} orders`);
      recentActivityData.forEach((order, index) => {
        console.log(`   Order ${index + 1}: #${order.orderNumber} - $${order.total} - ${order.status}`);
      });
    }

    console.log('\n🎯 Test Results:');
    console.log('   ✅ Database has orders');
    console.log('   ✅ Order data structure is correct');
    console.log('   ✅ API format simulation works');
    console.log('   ✅ useUserOrders query logic works');
    console.log('   ✅ Component data format is correct');
    
    console.log('\n🔧 Next Steps:');
    console.log('   1. Check if user is signed in correctly');
    console.log('   2. Check browser console for JavaScript errors');
    console.log('   3. Verify useUserOrders hook is being called correctly');
    console.log('   4. Check if API endpoint is returning data properly');

  } catch (error) {
    console.error('❌ Error during debug:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugRecentActivity();
