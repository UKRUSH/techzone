const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testProductFetch() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');

    // Test basic product fetch
    console.log('Testing basic product fetch...');
    const products = await prisma.product.findMany({
      take: 5
    });
    
    console.log(`Found ${products.length} products`);
    products.forEach(product => {
      console.log(`  - ${product.name} (ID: ${product.id})`);
    });

    // Test product fetch with includes
    console.log('\nTesting product fetch with includes...');
    const productsWithDetails = await prisma.product.findMany({
      take: 2,
      include: {
        category: true,
        brand: true,
        variants: true
      }
    });

    console.log(`Found ${productsWithDetails.length} products with details`);
    productsWithDetails.forEach(product => {
      console.log(`  - ${product.name}`);
      console.log(`    Category: ${product.category?.name}`);
      console.log(`    Brand: ${product.brand?.name}`);
      console.log(`    Variants: ${product.variants?.length || 0}`);
    });

  } catch (error) {
    console.error('Error testing product fetch:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProductFetch();
