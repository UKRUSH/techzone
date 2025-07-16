const { PrismaClient } = require('@prisma/client');

async function debugCartIssue() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Get all cart items for current user (you might need to adjust the email)
    const cartItems = await prisma.cartItem.findMany({
      include: {
        variant: {
          include: {
            product: {
              include: {
                brand: true,
                category: true
              }
            }
          }
        }
      }
    });
    
    console.log('\n📋 Database Cart Items:');
    if (cartItems.length === 0) {
      console.log('   No cart items found in database');
    } else {
      cartItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}`);
        console.log(`      User ID: ${item.userId || 'guest'}`);
        console.log(`      Session ID: ${item.sessionId || 'none'}`);
        console.log(`      Product: ${item.variant?.product?.name || 'Unknown'}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Created: ${item.createdAt}`);
        console.log('');
      });
    }
    
    // Get specific user cart items (adjust email as needed)
    const userCartItems = await prisma.cartItem.findMany({
      where: {
        user: {
          email: {
            contains: 'shan' // Adjust this to your email
          }
        }
      },
      include: {
        variant: {
          include: {
            product: true
          }
        },
        user: {
          select: {
            email: true,
            name: true
          }
        }
      }
    });
    
    console.log('🎯 Current User Cart Items:');
    if (userCartItems.length === 0) {
      console.log('   No cart items found for user');
    } else {
      userCartItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}`);
        console.log(`      User: ${item.user?.email} (${item.user?.name})`);
        console.log(`      Product: ${item.variant?.product?.name || 'Unknown'}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log('');
      });
    }
    
    console.log('🔍 Debug Recommendations:');
    console.log('1. Check if the cart item IDs in the frontend match these database IDs');
    console.log('2. Verify the user session is correctly identifying the user');
    console.log('3. Check if there are orphaned cart items from old sessions');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCartIssue();
