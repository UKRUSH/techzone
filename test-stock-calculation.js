const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStockCalculation() {
  try {
    console.log('🧪 Testing stock calculation logic...\n');

    // Get a product variant with inventory
    const variant = await prisma.productVariant.findFirst({
      include: {
        product: true,
        inventoryLevels: true
      }
    });

    if (!variant) {
      console.log('❌ No variants found');
      return;
    }

    console.log('📦 Testing variant:', variant.sku || variant.id);
    console.log('🏭 Product:', variant.product.name);

    // Calculate total stock manually
    const totalStock = variant.inventoryLevels.reduce((total, inventory) => {
      console.log(`   📍 Location inventory: ${inventory.stock} (reserved: ${inventory.reserved})`);
      return total + (inventory.stock - inventory.reserved);
    }, 0);

    console.log('\n📊 Stock Calculation:');
    console.log('   Total Available Stock:', Math.max(0, totalStock));
    console.log('   Stock Status:', totalStock > 0 ? '✅ In Stock' : '❌ Out of Stock');

    // Test the cart API stock calculation by simulating the logic
    const variantWithCalculatedStock = {
      ...variant,
      totalStock: Math.max(0, totalStock)
    };

    console.log('\n🔧 API would return:');
    console.log('   variant.totalStock:', variantWithCalculatedStock.totalStock);
    console.log('   Display would show:', variantWithCalculatedStock.totalStock > 0 ? `${variantWithCalculatedStock.totalStock} in stock` : 'Out of stock');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testStockCalculation();
