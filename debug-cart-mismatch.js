const { PrismaClient } = require('@prisma/client');

async function debugCartMismatch() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Get all cart items from database
    const dbCartItems = await prisma.cartItem.findMany({
      include: {
        user: {
          select: {
            email: true,
            name: true
          }
        },
        variant: {
          include: {
            product: {
              select: {
                name: true,
                id: true
              }
            }
          }
        }
      }
    });
    
    console.log('\n📋 Database Cart Items:');
    if (dbCartItems.length === 0) {
      console.log('   ❌ No cart items in database');
    } else {
      dbCartItems.forEach((item, index) => {
        console.log(`   ${index + 1}. Cart Item ID: ${item.id}`);
        console.log(`      User: ${item.user?.email || 'No user'}`);
        console.log(`      Product: ${item.variant?.product?.name || 'No product'}`);
        console.log(`      Variant ID: ${item.variantId}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Created: ${item.createdAt}`);
        console.log('');
      });
    }
    
    // Test what happens when we try to update a non-existent item
    console.log('\n🧪 Testing non-existent cart item update:');
    const fakeItemId = '687816712aaa10c16c2b25b9'; // This should not exist
    try {
      const updateResult = await prisma.cartItem.update({
        where: { id: fakeItemId },
        data: { quantity: 5 }
      });
      console.log('   ⚠️ Unexpectedly updated fake item:', updateResult);
    } catch (error) {
      console.log('   ✅ Correctly failed to update fake item:', error.message);
    }
    
    // Test updating a real item
    if (dbCartItems.length > 0) {
      const realItemId = dbCartItems[0].id;
      console.log(`\n🧪 Testing real cart item update (ID: ${realItemId}):`);
      try {
        const updateResult = await prisma.cartItem.update({
          where: { id: realItemId },
          data: { quantity: dbCartItems[0].quantity + 1 },
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        });
        console.log('   ✅ Successfully updated real item:', {
          id: updateResult.id,
          quantity: updateResult.quantity,
          product: updateResult.variant?.product?.name
        });
        
        // Revert the change
        await prisma.cartItem.update({
          where: { id: realItemId },
          data: { quantity: dbCartItems[0].quantity }
        });
        console.log('   ✅ Reverted change');
      } catch (error) {
        console.log('   ❌ Failed to update real item:', error.message);
      }
    }
    
    console.log('\n💡 Next Steps:');
    console.log('1. Check browser console for cart item IDs being sent in frontend');
    console.log('2. Compare frontend cart state with database items above');
    console.log('3. If IDs don\'t match, frontend has stale data');
    console.log('4. Force refresh frontend cart state');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

debugCartMismatch();
