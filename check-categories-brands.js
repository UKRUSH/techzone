const { PrismaClient } = require('@prisma/client');

async function checkCategoriesAndBrands() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking categories and brands in database...');
    
    // Get all categories
    const categories = await prisma.category.findMany();
    console.log('\n📁 Categories:');
    categories.forEach(cat => {
      console.log(`- ID: ${cat.id}, Name: "${cat.name}"`);
    });
    
    // Get all brands
    const brands = await prisma.brand.findMany();
    console.log('\n🏷️ Brands:');
    brands.forEach(brand => {
      console.log(`- ID: ${brand.id}, Name: "${brand.name}"`);
    });
    
    // Get a sample product to see its structure
    const sampleProduct = await prisma.product.findFirst({
      include: {
        category: true,
        brand: true,
        variants: true
      }
    });
    
    if (sampleProduct) {
      console.log('\n📦 Sample Product:');
      console.log(`- ID: ${sampleProduct.id}`);
      console.log(`- Name: ${sampleProduct.name}`);
      console.log(`- Category: ${sampleProduct.category.name} (ID: ${sampleProduct.categoryId})`);
      console.log(`- Brand: ${sampleProduct.brand.name} (ID: ${sampleProduct.brandId})`);
      console.log(`- Variants: ${sampleProduct.variants.length}`);
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCategoriesAndBrands();
