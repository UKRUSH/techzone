#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function populateDatabase() {
  try {
    console.log('🚀 Populating database with real products...');
    
    // Test connection first
    await prisma.$connect();
    console.log('✅ Connected to database successfully!');
    
    // Clear existing data
    console.log('🧹 Clearing existing data...');
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.brand.deleteMany({});
    
    // Create categories
    console.log('📁 Creating categories...');
    const categories = await Promise.all([
      prisma.category.create({ data: { id: 'gpu', name: 'Graphics Cards' } }),
      prisma.category.create({ data: { id: 'cpu', name: 'Processors' } }),
      prisma.category.create({ data: { id: 'memory', name: 'Memory & RAM' } }),
      prisma.category.create({ data: { id: 'storage', name: 'Storage' } }),
      prisma.category.create({ data: { id: 'motherboard', name: 'Motherboards' } }),
      prisma.category.create({ data: { id: 'psu', name: 'Power Supplies' } }),
    ]);
    
    // Create brands
    console.log('🏷️ Creating brands...');
    const brands = await Promise.all([
      prisma.brand.create({ data: { id: 'nvidia', name: 'NVIDIA' } }),
      prisma.brand.create({ data: { id: 'amd', name: 'AMD' } }),
      prisma.brand.create({ data: { id: 'intel', name: 'Intel' } }),
      prisma.brand.create({ data: { id: 'msi', name: 'MSI' } }),
      prisma.brand.create({ data: { id: 'asus', name: 'ASUS' } }),
      prisma.brand.create({ data: { id: 'corsair', name: 'Corsair' } }),
      prisma.brand.create({ data: { id: 'samsung', name: 'Samsung' } }),
    ]);
    
    // Create products with variants
    console.log('🛒 Creating products...');
    
    // Graphics Cards
    const rtx4090 = await prisma.product.create({
      data: {
        name: 'NVIDIA GeForce RTX 4090 24GB Gaming X Trio',
        description: 'The ultimate gaming graphics card with 24GB GDDR6X memory, featuring advanced Ada Lovelace architecture and ray tracing capabilities.',
        categoryId: 'gpu',
        brandId: 'msi',
        variants: {
          create: [{
            sku: 'MSI-RTX4090-GAMING-X-24G',
            price: 1599.99,
            attributes: {
              memory: '24GB GDDR6X',
              coreClock: '2230 MHz',
              memoryClock: '21000 MHz'
            }
          }]
        }
      }
    });
    
    const rtx4080 = await prisma.product.create({
      data: {
        name: 'NVIDIA GeForce RTX 4080 SUPER 16GB',
        description: 'High-performance graphics card with 16GB GDDR6X memory. Excellent for 4K gaming and creative work.',
        categoryId: 'gpu',
        brandId: 'asus',
        variants: {
          create: [{
            sku: 'ASUS-RTX4080-SUPER-16G',
            price: 999.99,
            attributes: {
              memory: '16GB GDDR6X',
              coreClock: '2295 MHz',
              memoryClock: '22400 MHz'
            }
          }]
        }
      }
    });
    
    // Processors
    const i9_13900k = await prisma.product.create({
      data: {
        name: 'Intel Core i9-13900K Desktop Processor',
        description: '24-core (8P+16E) processor with up to 5.8 GHz max turbo frequency. Perfect for gaming and content creation.',
        categoryId: 'cpu',
        brandId: 'intel',
        variants: {
          create: [{
            sku: 'INTEL-I9-13900K',
            price: 589.99,
            attributes: {
              cores: '24 (8P+16E)',
              threads: '32',
              baseClock: '3.0 GHz',
              maxTurbo: '5.8 GHz'
            }
          }]
        }
      }
    });
    
    const ryzen_7950x = await prisma.product.create({
      data: {
        name: 'AMD Ryzen 9 7950X Desktop Processor',
        description: '16-core, 32-thread processor with up to 5.7 GHz max boost. Built on advanced 5nm process technology.',
        categoryId: 'cpu',
        brandId: 'amd',
        variants: {
          create: [{
            sku: 'AMD-RYZEN-9-7950X',
            price: 699.99,
            attributes: {
              cores: '16',
              threads: '32',
              baseClock: '4.5 GHz',
              maxBoost: '5.7 GHz'
            }
          }]
        }
      }
    });
    
    // Memory
    const ddr5_corsair = await prisma.product.create({
      data: {
        name: 'Corsair Vengeance DDR5-6000 32GB (2x16GB)',
        description: 'High-speed DDR5 memory kit optimized for AMD and Intel platforms. RGB lighting included.',
        categoryId: 'memory',
        brandId: 'corsair',
        variants: {
          create: [{
            sku: 'CORSAIR-DDR5-6000-32GB',
            price: 179.99,
            attributes: {
              capacity: '32GB (2x16GB)',
              speed: 'DDR5-6000',
              timings: 'CL36-36-36-76',
              voltage: '1.35V'
            }
          }]
        }
      }
    });
    
    // Storage
    const samsung_ssd = await prisma.product.create({
      data: {
        name: 'Samsung 980 PRO 2TB NVMe SSD',
        description: 'PCIe 4.0 NVMe SSD with read speeds up to 7,000 MB/s. Perfect for gaming and professional applications.',
        categoryId: 'storage',
        brandId: 'samsung',
        variants: {
          create: [{
            sku: 'SAMSUNG-980-PRO-2TB',
            price: 149.99,
            attributes: {
              capacity: '2TB',
              interface: 'PCIe 4.0 x4',
              readSpeed: '7,000 MB/s',
              writeSpeed: '6,900 MB/s'
            }
          }]
        }
      }
    });
    
    console.log('✅ Database populated successfully!');
    console.log(`📊 Created ${categories.length} categories`);
    console.log(`🏷️ Created ${brands.length} brands`);
    console.log(`🛒 Created 6 products with variants`);
    console.log('');
    console.log('🎉 Your products page should now show real database products!');
    console.log('🌐 Visit: http://localhost:3000/products');
    
  } catch (error) {
    console.error('❌ Database population failed:', error.message);
    console.log('');
    console.log('💡 Please ensure:');
    console.log('1. MongoDB Atlas connection is working');
    console.log('2. IP address is whitelisted');
    console.log('3. Database user has proper permissions');
    console.log('4. Run: node fix-database-connection.js for help');
  } finally {
    await prisma.$disconnect();
  }
}

populateDatabase();
