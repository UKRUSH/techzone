const { PrismaClient } = require('@prisma/client');

async function findCurrentUser() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Get all users to see what's available
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log('\n👥 All Users in Database:');
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ID: ${user.id}`);
      console.log(`      Email: ${user.email}`);
      console.log(`      Name: ${user.name}`);
      console.log(`      Created: ${user.createdAt}`);
      console.log('');
    });
    
    // Check if shan@gmail.com exists
    const shanUser = await prisma.user.findUnique({
      where: {
        email: 'shan@gmail.com'
      }
    });
    
    console.log('🔍 Looking for shan@gmail.com:');
    if (shanUser) {
      console.log(`   Found: ID ${shanUser.id}, Name: ${shanUser.name}`);
    } else {
      console.log('   Not found');
    }
    
    // Check cart items for shan@gmail.com specifically
    if (shanUser) {
      const shanCartItems = await prisma.cartItem.findMany({
        where: {
          userId: shanUser.id
        },
        include: {
          variant: {
            include: {
              product: true
            }
          }
        }
      });
      
      console.log(`\n🛒 Cart items for shan@gmail.com (${shanCartItems.length} items):`);
      shanCartItems.forEach((item, index) => {
        console.log(`   ${index + 1}. ID: ${item.id}`);
        console.log(`      Product: ${item.variant?.product?.name}`);
        console.log(`      Quantity: ${item.quantity}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

findCurrentUser();
