// Test script to check admin products and stock levels
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testAdminStockUpdate() {
  console.log('🧪 Testing Admin Stock Update Functionality');
  console.log('=' .repeat(60));

  try {
    // 1. Get first product with variants and inventory
    console.log('\n📦 Fetching product with inventory data...');
    const product = await prisma.product.findFirst({
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        variants: {
          include: {
            inventoryLevels: {
              select: {
                id: true,
                stock: true,
                reserved: true,
                locationId: true,
                location: {
                  select: {
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!product) {
      console.log('❌ No products found. Please seed the database first.');
      return;
    }

    console.log(`📋 Found product: ${product.name}`);
    console.log(`🏷️ Category: ${product.category?.name || 'None'}`);
    console.log(`🏭 Brand: ${product.brand?.name || 'None'}`);
    console.log(`🔢 Variants: ${product.variants.length}`);

    // Display current inventory levels
    product.variants.forEach((variant, idx) => {
      console.log(`\n📦 Variant ${idx + 1}: ${variant.id}`);
      console.log(`💰 Price: $${variant.price}`);
      console.log(`📊 Inventory levels: ${variant.inventoryLevels.length}`);
      
      variant.inventoryLevels.forEach((inventory, invIdx) => {
        console.log(`  📍 Location ${invIdx + 1}: ${inventory.location?.name || 'Unknown'}`);
        console.log(`  📦 Stock: ${inventory.stock}`);
        console.log(`  🔒 Reserved: ${inventory.reserved}`);
        console.log(`  ✅ Available: ${inventory.stock - inventory.reserved}`);
      });
    });

    // 2. Test updating stock via API-like operation
    console.log('\n🔧 Testing stock update...');
    const firstVariant = product.variants[0];
    const currentInventory = firstVariant.inventoryLevels[0];
    const newStockValue = currentInventory.stock + 10;
    
    console.log(`📝 Updating stock from ${currentInventory.stock} to ${newStockValue}`);
    
    // Update inventory like the API does
    const updatedInventory = await prisma.inventory.update({
      where: { id: currentInventory.id },
      data: { stock: newStockValue }
    });
    
    console.log(`✅ Updated inventory: ${JSON.stringify(updatedInventory, null, 2)}`);

    // 3. Verify the update by fetching again
    console.log('\n🔍 Verifying update...');
    const updatedProduct = await prisma.product.findUnique({
      where: { id: product.id },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } },
        variants: {
          include: {
            inventoryLevels: {
              select: {
                id: true,
                stock: true,
                reserved: true
              }
            }
          }
        }
      }
    });

    const verifyInventory = updatedProduct.variants[0].inventoryLevels[0];
    console.log(`🎯 Verification - Stock: ${verifyInventory.stock}, Reserved: ${verifyInventory.reserved}`);
    console.log(`🎯 Available: ${verifyInventory.stock - verifyInventory.reserved}`);

    // 4. Test the admin page data structure
    console.log('\n📊 Testing admin page data extraction...');
    const adminStock = updatedProduct.variants?.[0]?.inventoryLevels?.[0]?.stock || 0;
    console.log(`🔧 Admin reads stock as: ${adminStock}`);
    
    if (adminStock === newStockValue) {
      console.log('✅ Admin stock reading is CORRECT');
    } else {
      console.log('❌ Admin stock reading is INCORRECT');
      console.log(`Expected: ${newStockValue}, Got: ${adminStock}`);
    }

    console.log('\n🎉 Stock update test completed!');

  } catch (error) {
    console.error('❌ Error during stock update test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testAdminStockUpdate();
