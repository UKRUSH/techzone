#!/usr/bin/env node

/**
 * MongoDB Data Population Script
 * This script will populate your MongoDB with initial data once the connection is working
 */

const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

// Sample data to populate the database
const sampleCategories = [
  {
    name: 'CPU',
    slug: 'cpu',
    description: 'Processors and CPUs for gaming and professional workloads',
    image: '/images/categories/cpu.jpg'
  },
  {
    name: 'GPU',
    slug: 'gpu', 
    description: 'Graphics cards for gaming, content creation, and AI workloads',
    image: '/images/categories/gpu.jpg'
  },
  {
    name: 'Memory',
    slug: 'memory',
    description: 'RAM modules for desktop and laptop computers',
    image: '/images/categories/memory.jpg'
  },
  {
    name: 'Storage',
    slug: 'storage',
    description: 'SSDs, HDDs, and NVMe drives for data storage',
    image: '/images/categories/storage.jpg'
  },
  {
    name: 'Motherboard',
    slug: 'motherboard',
    description: 'Motherboards for Intel and AMD processors',
    image: '/images/categories/motherboard.jpg'
  },
  {
    name: 'Power Supply',
    slug: 'power-supply',
    description: 'PSUs with various wattages and efficiency ratings',
    image: '/images/categories/psu.jpg'
  },
  {
    name: 'Cooling',
    slug: 'cooling',
    description: 'CPU coolers, case fans, and liquid cooling solutions',
    image: '/images/categories/cooling.jpg'
  },
  {
    name: 'Case',
    slug: 'case',
    description: 'PC cases in various form factors and styles',
    image: '/images/categories/case.jpg'
  }
];

const sampleBrands = [
  {
    name: 'Intel',
    slug: 'intel',
    description: 'Leading processor and technology manufacturer',
    logo: '/images/brands/intel.jpg'
  },
  {
    name: 'AMD',
    slug: 'amd',
    description: 'High-performance processors and graphics cards',
    logo: '/images/brands/amd.jpg'
  },
  {
    name: 'NVIDIA',
    slug: 'nvidia',
    description: 'World leader in visual computing and AI',
    logo: '/images/brands/nvidia.jpg'
  },
  {
    name: 'Corsair',
    slug: 'corsair',
    description: 'Premium gaming peripherals and components',
    logo: '/images/brands/corsair.jpg'
  },
  {
    name: 'ASUS',
    slug: 'asus',
    description: 'Innovative technology and motherboard solutions',
    logo: '/images/brands/asus.jpg'
  },
  {
    name: 'MSI',
    slug: 'msi',
    description: 'Gaming hardware and high-performance components',
    logo: '/images/brands/msi.jpg'
  },
  {
    name: 'Gigabyte',
    slug: 'gigabyte',
    description: 'Motherboards, graphics cards, and gaming gear',
    logo: '/images/brands/gigabyte.jpg'
  },
  {
    name: 'EVGA',
    slug: 'evga',
    description: 'High-end graphics cards and power supplies',
    logo: '/images/brands/evga.jpg'
  }
];

async function populateDatabase() {
  console.log('🚀 Starting database population...');
  
  try {
    // Test connection first
    console.log('🔄 Testing database connection...');
    await prisma.$connect();
    console.log('✅ Connected to database successfully!');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.brand.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create categories
    console.log('📂 Creating categories...');
    const createdCategories = [];
    for (const category of sampleCategories) {
      const created = await prisma.category.create({
        data: category
      });
      createdCategories.push(created);
      console.log(`  ✅ Created category: ${created.name}`);
    }
    
    // Create brands
    console.log('🏢 Creating brands...');
    const createdBrands = [];
    for (const brand of sampleBrands) {
      const created = await prisma.brand.create({
        data: brand
      });
      createdBrands.push(created);
      console.log(`  ✅ Created brand: ${created.name}`);
    }
    
    // Create sample products
    console.log('📦 Creating sample products...');
    
    const sampleProducts = [
      {
        name: 'Intel Core i9-13900K',
        description: 'High-performance desktop processor with 24 cores',
        images: ['/images/products/intel-i9-13900k.jpg'],
        tags: ['gaming', 'workstation', 'overclocking'],
        categoryId: createdCategories.find(c => c.slug === 'cpu').id,
        brandId: createdBrands.find(b => b.slug === 'intel').id
      },
      {
        name: 'AMD Ryzen 9 7950X',
        description: 'Flagship AMD processor with 16 cores and 32 threads',
        images: ['/images/products/amd-ryzen-9-7950x.jpg'],
        tags: ['gaming', 'content-creation', 'zen4'],
        categoryId: createdCategories.find(c => c.slug === 'cpu').id,
        brandId: createdBrands.find(b => b.slug === 'amd').id
      },
      {
        name: 'NVIDIA GeForce RTX 4090',
        description: 'Ultimate gaming and content creation graphics card',
        images: ['/images/products/rtx-4090.jpg'],
        tags: ['gaming', '4k', 'ray-tracing', 'dlss'],
        categoryId: createdCategories.find(c => c.slug === 'gpu').id,
        brandId: createdBrands.find(b => b.slug === 'nvidia').id
      },
      {
        name: 'Corsair DDR5-5600 32GB Kit',
        description: 'High-speed DDR5 memory for latest processors',
        images: ['/images/products/corsair-ddr5.jpg'],
        tags: ['ddr5', 'gaming', 'rgb'],
        categoryId: createdCategories.find(c => c.slug === 'memory').id,
        brandId: createdBrands.find(b => b.slug === 'corsair').id
      }
    ];
    
    for (const product of sampleProducts) {
      const created = await prisma.product.create({
        data: product
      });
      console.log(`  ✅ Created product: ${created.name}`);
      
      // Create a basic variant for each product
      await prisma.productVariant.create({
        data: {
          sku: `${product.name.replace(/\s+/g, '-').toLowerCase()}-001`,
          price: Math.floor(Math.random() * 1000) + 100, // Random price between 100-1100
          attributes: { color: 'Standard', condition: 'New' },
          productId: created.id
        }
      });
      console.log(`    ✅ Created variant for: ${created.name}`);
    }
    
    // Verify data
    console.log('\n📊 Database Population Summary:');
    const categoryCount = await prisma.category.count();
    const brandCount = await prisma.brand.count();
    const productCount = await prisma.product.count();
    const variantCount = await prisma.productVariant.count();
    
    console.log(`📂 Categories: ${categoryCount}`);
    console.log(`🏢 Brands: ${brandCount}`);
    console.log(`📦 Products: ${productCount}`);
    console.log(`🏷️  Variants: ${variantCount}`);
    
    console.log('\n🎉 Database population completed successfully!');
    console.log('🌐 You can now view your data in MongoDB Atlas');
    console.log('🔧 Admin panel should now work with real database data');
    
  } catch (error) {
    console.error('❌ Database population failed:', error);
    console.error('\n💡 Possible solutions:');
    console.error('1. Ensure MongoDB Atlas cluster is running');
    console.error('2. Check network connectivity and IP whitelist');
    console.error('3. Verify database credentials in .env.local');
    console.error('4. Try running the fix-mongodb-connection.js script first');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the population
populateDatabase().catch(console.error);
