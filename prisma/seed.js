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
      { name: 'CPU', slug: 'cpu', description: 'Central Processing Units' },
      { name: 'GPU', slug: 'gpu', description: 'Graphics Processing Units' },
      { name: 'RAM', slug: 'ram', description: 'Random Access Memory' },
      { name: 'Storage', slug: 'storage', description: 'Storage Devices' },
      { name: 'Motherboard', slug: 'motherboard', description: 'Motherboards' },
      { name: 'PSU', slug: 'psu', description: 'Power Supply Units' },
      { name: 'Cooling', slug: 'cooling', description: 'Cooling Solutions' },
      { name: 'Cases', slug: 'cases', description: 'PC Cases' }
    ];

    for (const category of categories) {
      await prisma.category.upsert({
        where: { slug: category.slug },
        update: {},
        create: category
      });
    }

    console.log('Sample categories created');

    // Create some sample brands
    const brands = [
      { name: 'AMD', slug: 'amd', description: 'Advanced Micro Devices' },
      { name: 'Intel', slug: 'intel', description: 'Intel Corporation' },
      { name: 'NVIDIA', slug: 'nvidia', description: 'NVIDIA Corporation' },
      { name: 'ASUS', slug: 'asus', description: 'ASUS Computer International' },
      { name: 'MSI', slug: 'msi', description: 'Micro-Star International' },
      { name: 'Corsair', slug: 'corsair', description: 'Corsair Gaming Inc.' },
      { name: 'Samsung', slug: 'samsung', description: 'Samsung Electronics' },
      { name: 'Western Digital', slug: 'western-digital', description: 'Western Digital Corporation' },
      { name: 'Seagate', slug: 'seagate', description: 'Seagate Technology' },
      { name: 'Gigabyte', slug: 'gigabyte', description: 'Gigabyte Technology' }
    ];

    for (const brand of brands) {
      await prisma.brand.upsert({
        where: { slug: brand.slug },
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
