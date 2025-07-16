const { PrismaClient } = require('@prisma/client');

async function debugCurrentCartState() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Check all cart items
    const allCartItems = await prisma.cartItem.findMany({
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
    
    console.log('\n📋 Current Cart Items in Database:');
    if (allCartItems.length === 0) {
      console.log('   ✅ No cart items in database (as expected after cleanup)');
    } else {
      allCartItems.forEach((item, index) => {
        console.log(`   ${index + 1}. Item ID: ${item.id}`);
        console.log(`      Product: ${item.variant?.product?.name || 'Unknown'}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      User: ${item.user?.email || 'Guest'}`);
        console.log(`      Session ID: ${item.sessionId || 'None'}`);
        console.log('');
      });
    }
    
    console.log('🔍 Possible Issues:');
    console.log('1. Frontend still has cached/stale cart items');
    console.log('2. LocalStorage contains old guest session data');
    console.log('3. Browser cache needs to be cleared');
    
    console.log('\n🎯 Next Steps to Debug:');
    console.log('1. Open browser developer tools');
    console.log('2. Check Console logs when updating quantity');
    console.log('3. Check Network tab for API request/response details');
    console.log('4. Clear browser cache and localStorage');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCurrentCartState();
