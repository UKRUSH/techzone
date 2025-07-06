const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function updateExistingData() {
  try {
    console.log('Updating existing categories and brands with slugs...');

    await prisma.$connect();

    // Update categories
    const categories = await prisma.category.findMany();
    for (const category of categories) {
      const slug = category.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await prisma.category.update({
        where: { id: category.id },
        data: { 
          slug,
          description: `${category.name} category`,
          image: '/api/placeholder/400/400'
        }
      });
      console.log(`Updated category: ${category.name} -> ${slug}`);
    }

    // Update brands  
    const brands = await prisma.brand.findMany();
    for (const brand of brands) {
      const slug = brand.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
      await prisma.brand.update({
        where: { id: brand.id },
        data: { 
          slug,
          description: `${brand.name} brand`,
          logo: '/api/placeholder/100/100'
        }
      });
      console.log(`Updated brand: ${brand.name} -> ${slug}`);
    }

    console.log('✅ Successfully updated existing data!');
    
  } catch (error) {
    console.error('❌ Error updating data:', error);
  } finally {
    await prisma.$disconnect();
  }
}

updateExistingData();
