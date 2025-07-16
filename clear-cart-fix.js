const { PrismaClient } = require('@prisma/client');

async function clearCartAndFix() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    console.log('\n🧹 Clearing Cart Items...');
    
    // Delete all cart items to start fresh
    const deletedItems = await prisma.cartItem.deleteMany({});
    
    console.log(`✅ Cleared ${deletedItems.count} cart items`);
    
    console.log('\n🎯 Cart cleared successfully!');
    console.log('Next steps:');
    console.log('1. Refresh the cart page');
    console.log('2. Add new items to cart');
    console.log('3. Cart should work properly now');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearCartAndFix();
