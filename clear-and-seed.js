const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function clearAndSeed() {
  try {
    await prisma.$connect();
    console.log('Connected to database successfully');

    // Clear existing data
    console.log('Clearing existing data...');
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.brand.deleteMany({});
    await prisma.location.deleteMany({});

    console.log('Database cleared. Adding fresh data...');

    // Create default inventory location
    const defaultLocation = await prisma.location.create({
      data: {
        name: 'Main Warehouse',
        address: 'Colombo, Sri Lanka'
      }
    });

    console.log('Default inventory location created:', defaultLocation);

    // Create categories with proper slugs
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
      await prisma.category.create({
        data: category
      });
    }

    console.log('Categories created successfully');

    // Create brands with proper slugs
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
      await prisma.brand.create({
        data: brand
      });
    }

    console.log('Brands created successfully');

    console.log('✅ Database cleared and seeded successfully!');
  } catch (error) {
    console.error('Error clearing and seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearAndSeed();
