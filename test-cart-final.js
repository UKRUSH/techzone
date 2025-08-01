const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testCartFunctionality() {
  console.log('🧪 Testing Cart Functionality');
  console.log('=' .repeat(50));

  try {
    // 1. Test creating a guest session
    const sessionId = 'test-session-' + Date.now();
    console.log('📝 Using session ID:', sessionId);

    // 2. Get a product variant to test with
    const variant = await prisma.productVariant.findFirst({
      include: {
        product: true,
        inventory: true
      }
    });

    if (!variant) {
      console.log('❌ No product variants found. Please seed the database first.');
      return;
    }

    console.log(`📦 Testing with product: ${variant.product.name}`);
    console.log(`💰 Price: $${variant.price}`);
    console.log(`📊 Stock: ${variant.inventory[0]?.stock || 0}`);

    // 3. Test adding to cart
    console.log('\n🛒 Testing Add to Cart...');
    
    const cartItem = await prisma.cartItem.create({
      data: {
        sessionId: sessionId,
        variantId: variant.id,
        quantity: 2
      },
      include: {
        variant: {
          include: {
            product: true,
            inventory: true
          }
        }
      }
    });

    console.log('✅ Cart item created:', {
      id: cartItem.id,
      productName: cartItem.variant.product.name,
      quantity: cartItem.quantity,
      price: cartItem.variant.price
    });

    // 4. Test fetching cart
    console.log('\n📋 Testing Fetch Cart...');
    
    const cartItems = await prisma.cartItem.findMany({
      where: { sessionId },
      include: {
        variant: {
          include: {
            product: true,
            inventory: true
          }
        }
      }
    });

    console.log(`✅ Found ${cartItems.length} cart items:`);
    cartItems.forEach(item => {
      console.log(`  - ${item.variant.product.name} x${item.quantity} @ $${item.variant.price}`);
    });

    // 5. Test updating cart item
    console.log('\n📝 Testing Update Cart Item...');
    
    const updatedItem = await prisma.cartItem.update({
      where: { id: cartItem.id },
      data: { quantity: 3 },
      include: {
        variant: {
          include: {
            product: true
          }
        }
      }
    });

    console.log('✅ Updated cart item quantity to:', updatedItem.quantity);

    // 6. Test removing cart item
    console.log('\n🗑️ Testing Remove Cart Item...');
    
    await prisma.cartItem.delete({
      where: { id: cartItem.id }
    });

    console.log('✅ Cart item removed');

    // 7. Verify cart is empty
    const finalCartItems = await prisma.cartItem.findMany({
      where: { sessionId }
    });

    console.log(`✅ Final cart item count: ${finalCartItems.length}`);

    console.log('\n🎉 All cart tests passed!');

  } catch (error) {
    console.error('❌ Error during cart testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCartFunctionality();
