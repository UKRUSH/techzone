// Test product creation functionality
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testProductCreation() {
  console.log('🧪 Testing Product Creation Functionality');
  console.log('=' .repeat(60));

  try {
    // 1. Check if categories and brands exist
    console.log('\n📊 Checking categories and brands...');
    
    const categories = await prisma.category.findMany();
    const brands = await prisma.brand.findMany();
    
    console.log(`📋 Categories available: ${categories.length}`);
    categories.forEach(cat => console.log(`  - ${cat.name} (ID: ${cat.id})`));
    
    console.log(`🏭 Brands available: ${brands.length}`);
    brands.forEach(brand => console.log(`  - ${brand.name} (ID: ${brand.id})`));

    if (categories.length === 0 || brands.length === 0) {
      console.log('❌ No categories or brands found. Creating test data...');
      
      // Create test category
      let testCategory = await prisma.category.findFirst({ where: { name: 'Test Category' } });
      if (!testCategory) {
        testCategory = await prisma.category.create({
          data: {
            name: 'Test Category',
            description: 'Test category for product creation'
          }
        });
        console.log('✅ Created test category');
      }

      // Create test brand
      let testBrand = await prisma.brand.findFirst({ where: { name: 'Test Brand' } });
      if (!testBrand) {
        testBrand = await prisma.brand.create({
          data: {
            name: 'Test Brand',
            description: 'Test brand for product creation'
          }
        });
        console.log('✅ Created test brand');
      }
    }

    // 2. Test product creation like the admin form does
    console.log('\n🛍️ Testing product creation...');
    
    const testProductData = {
      name: 'Test Product ' + Date.now(),
      description: 'This is a test product created by the test script',
      price: 99.99,
      category: categories[0]?.name || 'Test Category',
      brand: brands[0]?.name || 'Test Brand',
      stock: 50,
      variants: [{
        sku: 'TEST-PRODUCT-001',
        price: 99.99,
        attributes: {
          stock: 50,
          imageUrl: 'https://via.placeholder.com/300x300'
        }
      }]
    };

    console.log('📦 Test product data:', JSON.stringify(testProductData, null, 2));

    // Simulate the API call logic
    console.log('\n🔧 Simulating API product creation...');
    
    // Find category ID
    const category = await prisma.category.findFirst({
      where: { name: testProductData.category }
    });
    
    // Find brand ID
    const brand = await prisma.brand.findFirst({
      where: { name: testProductData.brand }
    });

    if (!category || !brand) {
      console.log('❌ Category or brand not found');
      return;
    }

    console.log(`📋 Using category: ${category.name} (ID: ${category.id})`);
    console.log(`🏭 Using brand: ${brand.name} (ID: ${brand.id})`);

    // Create product
    const product = await prisma.product.create({
      data: {
        name: testProductData.name.trim(),
        description: testProductData.description?.trim() || '',
        categoryId: category.id,
        brandId: brand.id,
        isActive: true
      },
      include: {
        category: { select: { id: true, name: true } },
        brand: { select: { id: true, name: true } }
      }
    });

    console.log('✅ Product created:', product.id, product.name);

    // Create variant
    const variant = await prisma.productVariant.create({
      data: {
        productId: product.id,
        sku: testProductData.variants[0].sku,
        price: parseFloat(testProductData.price),
        attributes: testProductData.variants[0].attributes
      }
    });

    console.log('✅ Variant created:', variant.id);

    // Create inventory
    let defaultLocation = await prisma.location.findFirst({
      where: { name: 'Main Warehouse' }
    });

    if (!defaultLocation) {
      defaultLocation = await prisma.location.create({
        data: {
          name: 'Main Warehouse',
          address: 'Default location'
        }
      });
      console.log('✅ Created default location');
    }

    const inventory = await prisma.inventory.create({
      data: {
        variantId: variant.id,
        locationId: defaultLocation.id,
        stock: parseInt(testProductData.stock),
        reserved: 0,
        incoming: 0
      }
    });

    console.log('✅ Inventory created with stock:', inventory.stock);

    // 3. Verify the complete product
    console.log('\n🔍 Verifying created product...');
    
    const completeProduct = await prisma.product.findUnique({
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
                reserved: true,
                locationId: true
              }
            }
          }
        }
      }
    });

    console.log('📊 Complete product structure:');
    console.log(`  - Name: ${completeProduct.name}`);
    console.log(`  - Category: ${completeProduct.category.name}`);
    console.log(`  - Brand: ${completeProduct.brand.name}`);
    console.log(`  - Variants: ${completeProduct.variants.length}`);
    console.log(`  - Stock: ${completeProduct.variants[0]?.inventoryLevels[0]?.stock || 0}`);

    console.log('\n🎉 Product creation test completed successfully!');

  } catch (error) {
    console.error('❌ Error during product creation test:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductCreation();
