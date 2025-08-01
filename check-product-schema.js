const { PrismaClient } = require('@prisma/client');

async function checkProductSchema() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking product database schema...');
    
    // Check categories
    const categories = await prisma.category.findMany({
      select: { id: true, name: true }
    });
    console.log('📂 Categories:', categories);
    
    // Check brands
    const brands = await prisma.brand.findMany({
      select: { id: true, name: true }
    });
    console.log('🏷️ Brands:', brands);
    
    // Check a sample product
    const sampleProduct = await prisma.product.findFirst({
      include: {
        category: true,
        brand: true,
        variants: true
      }
    });
    
    if (sampleProduct) {
      console.log('📦 Sample product:', {
        id: sampleProduct.id,
        name: sampleProduct.name,
        category: sampleProduct.category,
        brand: sampleProduct.brand,
        price: sampleProduct.price,
        variants: sampleProduct.variants?.length || 0
      });
    } else {
      console.log('❌ No products found');
    }
    
  } catch (error) {
    console.error('💥 Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProductSchema();
