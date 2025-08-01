const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testStockUpdate() {
  console.log('🧪 Testing Stock Update Functionality');
  console.log('=' .repeat(50));

  try {
    // 1. Find a product with variants
    const product = await prisma.product.findFirst({
      include: {
        variants: {
          include: {
            inventoryLevels: true
          }
        }
      }
    });

    if (!product) {
      console.log('❌ No products found. Please seed the database first.');
      return;
    }

    if (product.variants.length === 0) {
      console.log('❌ No variants found for this product.');
      return;
    }

    const variant = product.variants[0];
    console.log(`📦 Testing with product: ${product.name}`);
    console.log(`🔧 Variant ID: ${variant.id}`);
    console.log(`📊 Current inventory levels:`, variant.inventoryLevels);

    // 2. Test creating/updating inventory
    let inventory = variant.inventoryLevels[0];
    
    if (!inventory) {
      console.log('📝 No inventory found, checking for default location...');
      
      let defaultLocation = await prisma.location.findFirst({
        where: { name: 'Main Warehouse' }
      });

      if (!defaultLocation) {
        console.log('🏗️ Creating default location...');
        defaultLocation = await prisma.location.create({
          data: {
            name: 'Main Warehouse',
            address: 'Default location'
          }
        });
        console.log('✅ Created default location:', defaultLocation.id);
      }

      console.log('📝 Creating new inventory entry...');
      inventory = await prisma.inventory.create({
        data: {
          variantId: variant.id,
          locationId: defaultLocation.id,
          stock: 100,
          reserved: 0,
          incoming: 0
        }
      });
      console.log('✅ Created inventory:', inventory);
    } else {
      console.log('📝 Updating existing inventory...');
      const newStock = (inventory.stock || 0) + 10;
      
      inventory = await prisma.inventory.update({
        where: { id: inventory.id },
        data: { stock: newStock }
      });
      console.log(`✅ Updated stock from ${inventory.stock - 10} to ${inventory.stock}`);
    }

    // 3. Verify the update by fetching the product again
    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        variants: {
          include: {
            inventoryLevels: true
          }
        }
      }
    });

    const updatedVariant = updatedProduct.variants[0];
    const updatedInventory = updatedVariant.inventoryLevels[0];

    console.log('\n🔍 Verification:');
    console.log(`Product: ${updatedProduct.name}`);
    console.log(`Variant: ${updatedVariant.id}`);
    console.log(`Current Stock: ${updatedInventory?.stock || 0}`);
    console.log(`Reserved: ${updatedInventory?.reserved || 0}`);

    console.log('\n🎉 Stock update test completed successfully!');

  } catch (error) {
    console.error('❌ Error during stock update testing:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testStockUpdate();
