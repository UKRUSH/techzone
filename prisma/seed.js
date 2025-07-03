const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  try {
    console.log('Starting database seed...');

    // First, let's check if the database is accessible
    await prisma.$connect();
    console.log('Connected to database successfully');

    // Create default inventory location
    const defaultLocation = await prisma.location.upsert({
      where: { name: 'Main Warehouse' },
      update: {},
      create: {
        name: 'Main Warehouse',
        address: '123 Tech Street, Silicon Valley, CA'
      }
    });

    console.log('Default inventory location created:', defaultLocation);

    // Create some sample categories
    const categories = [
      { name: 'CPU' },
      { name: 'GPU' },
      { name: 'RAM' },
      { name: 'Storage' },
      { name: 'Motherboard' },
      { name: 'PSU' },
      { name: 'Cooling' },
      { name: 'Cases' }
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { name: category.name },
        update: {},
        create: category
      });
    }

    console.log('Sample categories created');

    // Create some sample brands
    const brands = [
      { name: 'AMD' },
      { name: 'Intel' },
      { name: 'NVIDIA' },
      { name: 'ASUS' },
      { name: 'MSI' },
      { name: 'Corsair' },
      { name: 'Samsung' },
      { name: 'Western Digital' },
      { name: 'Seagate' },
      { name: 'Gigabyte' }
    ];

    for (const brand of brands) {
      await prisma.brand.upsert({
        where: { name: brand.name },
        update: {},
        create: brand
      });
    }

    console.log('Sample brands created');

    console.log('Database seed completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
