const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkDatabase() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');

    const categories = await prisma.category.findMany();
    console.log('Categories in database:', categories.length);
    categories.forEach(cat => console.log(`  - ${cat.name} (${cat.slug})`));

    const brands = await prisma.brand.findMany();
    console.log('Brands in database:', brands.length);
    brands.forEach(brand => console.log(`  - ${brand.name} (${brand.slug})`));

    const products = await prisma.product.findMany();
    console.log('Products in database:', products.length);

  } catch (error) {
    console.error('Error checking database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkDatabase();
