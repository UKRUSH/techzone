const { PrismaClient } = require('@prisma/client');

async function getCurrentCartState() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Check if there are any cart items in database
    const cartItems = await prisma.cartItem.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        variant: {
          include: {
            product: true
          }
        }
      }
    });
    
    console.log('\n📋 Current Database Cart State:');
    if (cartItems.length === 0) {
      console.log('   ✅ Database cart is empty (as expected after cleanup)');
    } else {
      console.log(`   ⚠️ Found ${cartItems.length} cart items in database:`);
      cartItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}`);
        console.log(`      User: ${item.user?.email}`);
        console.log(`      Product: ${item.variant?.product?.name}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log('');
      });
    }
    
    console.log('\n🔍 Issue Analysis:');
    if (cartItems.length === 0) {
      console.log('- Database has no cart items (correct after cleanup)');
      console.log('- Frontend still shows old items from cache/state');
      console.log('- When user clicks +/- buttons, API returns 404 "Cart item not found"');
      console.log('- CartProvider error handling needs improvement');
    }
    
    console.log('\n🔧 Solution:');
    console.log('1. Force refresh cart state on page load');
    console.log('2. Clear stale frontend items when API returns 404');
    console.log('3. Show user-friendly "Cart is empty" message');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

getCurrentCartState();
