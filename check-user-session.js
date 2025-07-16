const { PrismaClient } = require('@prisma/client');

async function checkUserSession() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Find the user with email containing 'shan'
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: 'shan'
        }
      },
      select: {
        id: true,
        email: true,
        name: true
      }
    });
    
    console.log('\n👤 Current User:');
    if (user) {
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
    } else {
      console.log('   No user found with email containing "shan"');
    }
    
    // Find cart items for this specific user ID
    if (user) {
      const userCartItems = await prisma.cartItem.findMany({
        where: {
          userId: user.id
        },
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      });
      
      console.log('\n🛒 Cart Items for this User:');
      if (userCartItems.length === 0) {
        console.log('   No cart items found');
      } else {
        userCartItems.forEach((item, index) => {
          console.log(`   ${index + 1}. ID: ${item.id}`);
          console.log(`      Product: ${item.variant?.product?.name || 'Unknown'}`);
          console.log(`      Quantity: ${item.quantity}`);
          console.log('');
        });
      }
    }
    
    // Show the cart items that do exist and their user IDs
    const allCartItems = await prisma.cartItem.findMany({
      include: {
        user: {
          select: {
            id: true,
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
    
    console.log('📋 All Cart Items and Their Owners:');
    allCartItems.forEach((item, index) => {
      console.log(`   ${index + 1}. Cart Item ID: ${item.id}`);
      console.log(`      Owner User ID: ${item.userId}`);
      console.log(`      Owner Email: ${item.user?.email || 'No user'}`);
      console.log(`      Session ID: ${item.sessionId || 'none'}`);
      console.log(`      Product: ${item.variant?.product?.name || 'Unknown'}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUserSession();
