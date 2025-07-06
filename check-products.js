const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkProducts() {
  try {
    console.log('🔍 Checking products in MongoDB...');
    
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: true
      }
    });
    
    console.log(`📦 Found ${products.length} products:`);
    products.forEach((product, index) => {
      console.log(`\n${index + 1}. ${product.name}`);
      console.log(`   ID: ${product.id}`);
      console.log(`   Category: ${product.category?.name || 'N/A'}`);
      console.log(`   Brand: ${product.brand?.name || 'N/A'}`);
      console.log(`   Variants: ${product.variants?.length || 0}`);
      if (product.variants?.length > 0) {
        console.log(`   Price: Rs. ${product.variants[0].price || 0}`);
        console.log(`   Stock: ${product.variants[0].attributes?.stock || 0}`);
        console.log(`   Image: ${product.variants[0].attributes?.imageUrl || 'No image'}`);
      }
    });
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkProducts();
