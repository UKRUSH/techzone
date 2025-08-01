// Test script to check categories and brands in database
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function testCategoriesAndBrands() {
  console.log('🧪 Testing Categories and Brands');
  console.log('=' .repeat(50));

  try {
    // Test categories
    console.log('\n📂 Categories in database:');
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (categories.length === 0) {
      console.log('❌ No categories found! This will cause product creation to fail.');
      console.log('💡 Please run the seed script to create categories.');
    } else {
      categories.forEach((category, idx) => {
        console.log(`  ${idx + 1}. ${category.name} (ID: ${category.id}) - ${category._count.products} products`);
      });
    }

    // Test brands
    console.log('\n🏭 Brands in database:');
    const brands = await prisma.brand.findMany({
      select: {
        id: true,
        name: true,
        _count: {
          select: {
            products: true
          }
        }
      }
    });

    if (brands.length === 0) {
      console.log('❌ No brands found! This will cause product creation to fail.');
      console.log('💡 Please run the seed script to create brands.');
    } else {
      brands.forEach((brand, idx) => {
        console.log(`  ${idx + 1}. ${brand.name} (ID: ${brand.id}) - ${brand._count.products} products`);
      });
    }

    // Test lookup by name (simulate what the API does)
    console.log('\n🔍 Testing category/brand lookup:');
    
    const testCategoryName = categories.length > 0 ? categories[0].name : 'Gaming Hardware';
    const foundCategory = await prisma.category.findFirst({
      where: { name: testCategoryName }
    });
    console.log(`Category lookup for '${testCategoryName}':`, foundCategory ? `Found ID ${foundCategory.id}` : 'Not found');

    const testBrandName = brands.length > 0 ? brands[0].name : 'ASUS';
    const foundBrand = await prisma.brand.findFirst({
      where: { name: testBrandName }
    });
    console.log(`Brand lookup for '${testBrandName}':`, foundBrand ? `Found ID ${foundBrand.id}` : 'Not found');

    // Summary
    console.log('\n📊 Summary:');
    console.log(`Categories: ${categories.length}`);
    console.log(`Brands: ${brands.length}`);
    
    if (categories.length > 0 && brands.length > 0) {
      console.log('✅ Both categories and brands exist - product creation should work');
    } else {
      console.log('❌ Missing categories or brands - product creation will fail');
      console.log('💡 Run: npm run seed or node prisma/seed.js');
    }

  } catch (error) {
    console.error('❌ Database error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testCategoriesAndBrands();
