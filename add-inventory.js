const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function addInventoryToProducts() {
  try {
    console.log('🔧 Adding inventory levels to existing products...\n');

    // Get all products with variants
    const products = await prisma.product.findMany({
      include: {
        variants: true
      }
    });

    console.log(`Found ${products.length} products`);

    // Create a default location if it doesn't exist
    let location;
    try {
      location = await prisma.location.findFirst();
      if (!location) {
        location = await prisma.location.create({
          data: {
            name: "Main Warehouse",
            address: "123 Main Street, Colombo"
          }
        });
        console.log('✅ Created default location');
      } else {
        console.log('✅ Using existing location:', location.name);
      }
    } catch (error) {
      console.log('ℹ️ Location creation skipped (might already exist)');
    }

    // Add inventory for each variant
    for (const product of products) {
      console.log(`\n📦 Processing product: ${product.name}`);
      
      for (const variant of product.variants) {
        try {
          // Check if inventory already exists
          const existingInventory = await prisma.inventory.findFirst({
            where: { 
              variantId: variant.id,
              locationId: location.id 
            }
          });

          if (!existingInventory) {
            const stockAmount = Math.floor(Math.random() * 50) + 10; // Random stock between 10-60
            
            await prisma.inventory.create({
              data: {
                variantId: variant.id,
                locationId: location.id,
                stock: stockAmount,
                reserved: 0,
                incoming: 0
              }
            });
            
            console.log(`   ✅ Added ${stockAmount} units for variant ${variant.sku || variant.id}`);
          } else {
            console.log(`   ℹ️ Inventory already exists for variant ${variant.sku || variant.id} (Stock: ${existingInventory.stock})`);
          }
        } catch (error) {
          console.log(`   ❌ Failed to add inventory for variant ${variant.id}:`, error.message);
        }
      }
    }

    console.log('\n🎉 Inventory setup completed!');

  } catch (error) {
    console.error('❌ Error adding inventory:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
addInventoryToProducts();
