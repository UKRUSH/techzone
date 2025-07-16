const { PrismaClient } = require('@prisma/client');

async function fixCartIssues() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    console.log('\n🧹 Cart Cleanup & Fix Process');
    console.log('============================');
    
    // Option 1: Clear all cart items (if you want a fresh start)
    console.log('\n1. Would clear all cart items for fresh start...');
    
    // Option 2: Reassign cart items to a specific user
    console.log('\n2. Available users for cart reassignment:');
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 5
    });
    
    users.forEach((user, index) => {
      console.log(`   ${index + 1}. ${user.email} (${user.name}) - ID: ${user.id}`);
    });
    
    // Option 3: Create shan@gmail.com user if needed
    console.log('\n3. Checking if we need to create shan@gmail.com user...');
    const shanExists = await prisma.user.findUnique({
      where: { email: 'shan@gmail.com' }
    });
    
    if (!shanExists) {
      console.log('   shan@gmail.com does not exist');
      console.log('   Recommendation: Create this user or sign in with existing user');
    } else {
      console.log('   shan@gmail.com exists');
    }
    
    console.log('\n🎯 Recommended Solutions:');
    console.log('A. Clear cart and start fresh:');
    console.log('   - Delete all cart items');
    console.log('   - Let user add items again with correct session');
    
    console.log('B. Create missing user account:');
    console.log('   - Create shan@gmail.com user');
    console.log('   - Reassign cart items to this user');
    
    console.log('C. Use existing account:');
    console.log('   - Sign in as rush@gmail.com or another existing user');
    console.log('   - Cart items will work correctly');
    
    // Show current cart state
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
    
    console.log('\n📋 Current Cart State:');
    cartItems.forEach((item, index) => {
      console.log(`   ${index + 1}. ${item.variant?.product?.name} (Qty: ${item.quantity})`);
      console.log(`      Owner: ${item.user?.email} (${item.user?.name})`);
      console.log(`      Item ID: ${item.id}`);
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

fixCartIssues();
