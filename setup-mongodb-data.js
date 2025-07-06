#!/usr/bin/env node

/**
 * Complete MongoDB Atlas Setup and Data Population Script
 * This script will help you get data visible in MongoDB Atlas once connection is restored
 */

const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

const prisma = new PrismaClient();

async function checkMongoDBStatus() {
  console.log('🔍 MongoDB Atlas Connection Diagnostics');
  console.log('=======================================');
  
  try {
    console.log('Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Basic connection successful');
    
    // Test a simple query
    console.log('Testing query execution...');
    await prisma.$queryRaw`SELECT 1`;
    console.log('✅ Query execution successful');
    
    return true;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  }
}

async function createSampleData() {
  console.log('\n📦 Creating Sample Data for MongoDB');
  console.log('===================================');
  
  try {
    // Clear existing data first
    console.log('🧹 Clearing existing data...');
    await prisma.productVariant.deleteMany({});
    await prisma.product.deleteMany({});
    await prisma.category.deleteMany({});
    await prisma.brand.deleteMany({});
    console.log('✅ Existing data cleared');
    
    // Create Categories
    console.log('\n📂 Creating Categories...');
    const categories = [
      { name: 'CPU', slug: 'cpu', description: 'Processors and CPUs' },
      { name: 'GPU', slug: 'gpu', description: 'Graphics Cards' },
      { name: 'Memory', slug: 'memory', description: 'RAM Modules' },
      { name: 'Storage', slug: 'storage', description: 'SSDs and HDDs' },
      { name: 'Motherboard', slug: 'motherboard', description: 'Motherboards' },
      { name: 'Power Supply', slug: 'power-supply', description: 'PSUs' },
      { name: 'Cooling', slug: 'cooling', description: 'Cooling Solutions' },
      { name: 'Case', slug: 'case', description: 'PC Cases' }
    ];
    
    const createdCategories = [];
    for (const categoryData of categories) {
      const category = await prisma.category.create({ data: categoryData });
      createdCategories.push(category);
      console.log(`  ✅ Created: ${category.name}`);
    }
    
    // Create Brands
    console.log('\n🏢 Creating Brands...');
    const brands = [
      { name: 'Intel', slug: 'intel', description: 'Processor manufacturer' },
      { name: 'AMD', slug: 'amd', description: 'CPU and GPU manufacturer' },
      { name: 'NVIDIA', slug: 'nvidia', description: 'Graphics card manufacturer' },
      { name: 'Corsair', slug: 'corsair', description: 'Gaming hardware' },
      { name: 'ASUS', slug: 'asus', description: 'Computer hardware' },
      { name: 'MSI', slug: 'msi', description: 'Gaming components' },
      { name: 'Gigabyte', slug: 'gigabyte', description: 'Motherboards and GPUs' },
      { name: 'Samsung', slug: 'samsung', description: 'Storage and memory' }
    ];
    
    const createdBrands = [];
    for (const brandData of brands) {
      const brand = await prisma.brand.create({ data: brandData });
      createdBrands.push(brand);
      console.log(`  ✅ Created: ${brand.name}`);
    }
    
    // Create Products with Variants
    console.log('\n📦 Creating Products with Variants...');
    const productsData = [
      {
        name: 'Intel Core i9-13900K',
        description: 'High-performance 24-core processor for gaming and content creation',
        images: ['/images/products/intel-i9-13900k.jpg'],
        tags: ['gaming', 'workstation', 'latest'],
        categorySlug: 'cpu',
        brandSlug: 'intel',
        variants: [
          { sku: 'INTEL-I9-13900K-001', price: 589.99, attributes: { condition: 'New', warranty: '3 years' } }
        ]
      },
      {
        name: 'AMD Ryzen 9 7950X',
        description: 'Flagship 16-core processor with Zen 4 architecture',
        images: ['/images/products/amd-ryzen-9-7950x.jpg'],
        tags: ['gaming', 'zen4', 'flagship'],
        categorySlug: 'cpu',
        brandSlug: 'amd',
        variants: [
          { sku: 'AMD-R9-7950X-001', price: 549.99, attributes: { condition: 'New', warranty: '3 years' } }
        ]
      },
      {
        name: 'NVIDIA GeForce RTX 4090',
        description: 'Ultimate gaming and AI workstation graphics card',
        images: ['/images/products/rtx-4090.jpg'],
        tags: ['gaming', '4k', 'ray-tracing', 'dlss'],
        categorySlug: 'gpu',
        brandSlug: 'nvidia',
        variants: [
          { sku: 'NVIDIA-RTX4090-001', price: 1599.99, attributes: { vram: '24GB', condition: 'New' } }
        ]
      },
      {
        name: 'Corsair DDR5-5600 32GB Kit',
        description: 'High-speed DDR5 memory kit with RGB lighting',
        images: ['/images/products/corsair-ddr5.jpg'],
        tags: ['ddr5', 'gaming', 'rgb'],
        categorySlug: 'memory',
        brandSlug: 'corsair',
        variants: [
          { sku: 'CORSAIR-DDR5-32GB-001', price: 159.99, attributes: { speed: '5600MHz', rgb: 'Yes' } }
        ]
      },
      {
        name: 'Samsung 980 PRO 2TB NVMe SSD',
        description: 'Ultra-fast PCIe 4.0 NVMe SSD for gaming and professional work',
        images: ['/images/products/samsung-980-pro.jpg'],
        tags: ['nvme', 'pcie4', 'fast'],
        categorySlug: 'storage',
        brandSlug: 'samsung',
        variants: [
          { sku: 'SAMSUNG-980PRO-2TB-001', price: 199.99, attributes: { capacity: '2TB', interface: 'PCIe 4.0' } }
        ]
      },
      {
        name: 'ASUS ROG Strix Z790-E Gaming',
        description: 'Premium motherboard for Intel 13th gen processors',
        images: ['/images/products/asus-z790-e.jpg'],
        tags: ['motherboard', 'gaming', 'rog'],
        categorySlug: 'motherboard',
        brandSlug: 'asus',
        variants: [
          { sku: 'ASUS-Z790E-001', price: 449.99, attributes: { socket: 'LGA1700', wifi: 'WiFi 6E' } }
        ]
      }
    ];
    
    for (const productData of productsData) {
      const category = createdCategories.find(c => c.slug === productData.categorySlug);
      const brand = createdBrands.find(b => b.slug === productData.brandSlug);
      
      if (!category || !brand) {
        console.log(`⚠️ Skipping ${productData.name} - category or brand not found`);
        continue;
      }
      
      const product = await prisma.product.create({
        data: {
          name: productData.name,
          description: productData.description,
          images: productData.images,
          tags: productData.tags,
          categoryId: category.id,
          brandId: brand.id
        }
      });
      
      // Create variants for the product
      for (const variantData of productData.variants) {
        await prisma.productVariant.create({
          data: {
            sku: variantData.sku,
            price: variantData.price,
            attributes: variantData.attributes,
            productId: product.id
          }
        });
      }
      
      console.log(`  ✅ Created: ${product.name} with ${productData.variants.length} variant(s)`);
    }
    
    // Summary
    console.log('\n📊 Database Population Summary');
    console.log('=============================');
    const categoryCount = await prisma.category.count();
    const brandCount = await prisma.brand.count();
    const productCount = await prisma.product.count();
    const variantCount = await prisma.productVariant.count();
    
    console.log(`📂 Categories: ${categoryCount}`);
    console.log(`🏢 Brands: ${brandCount}`);
    console.log(`📦 Products: ${productCount}`);
    console.log(`🏷️ Variants: ${variantCount}`);
    
    console.log('\n🎉 SUCCESS! Data has been populated in MongoDB Atlas');
    console.log('🌐 You should now see this data in your MongoDB Atlas dashboard');
    console.log('📱 Admin panel will now work with real database data');
    
    return true;
    
  } catch (error) {
    console.error('❌ Error creating sample data:', error);
    return false;
  }
}

async function saveDataToFiles() {
  console.log('\n💾 Saving Current Data to Backup Files');
  console.log('======================================');
  
  try {
    const categories = await prisma.category.findMany();
    const brands = await prisma.brand.findMany();
    const products = await prisma.product.findMany({
      include: {
        category: true,
        brand: true,
        variants: true
      }
    });
    
    const tempDir = path.join(process.cwd(), 'temp-data');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    fs.writeFileSync(path.join(tempDir, 'categories.json'), JSON.stringify(categories, null, 2));
    fs.writeFileSync(path.join(tempDir, 'brands.json'), JSON.stringify(brands, null, 2));
    fs.writeFileSync(path.join(tempDir, 'products.json'), JSON.stringify(products, null, 2));
    
    console.log('✅ Data backed up to temp-data/ directory');
    return true;
  } catch (error) {
    console.error('❌ Error backing up data:', error);
    return false;
  }
}

async function main() {
  console.log('🚀 MongoDB Atlas Data Setup Script');
  console.log('==================================');
  console.log('This script will populate your MongoDB Atlas database with sample data\n');
  
  try {
    // Check connection
    const isConnected = await checkMongoDBStatus();
    
    if (!isConnected) {
      console.log('\n💡 MongoDB Atlas Connection Issues Detected');
      console.log('==========================================');
      console.log('Your MongoDB Atlas cluster is not accessible due to SSL/TLS errors.');
      console.log('Please follow these steps:');
      console.log('');
      console.log('1. Go to https://cloud.mongodb.com/');
      console.log('2. Check if your cluster is running (not paused)');
      console.log('3. Go to Network Access and add your IP address');
      console.log('4. Verify database user has readWrite permissions');
      console.log('5. Wait 2-3 minutes for changes to propagate');
      console.log('6. Run this script again: node setup-mongodb-data.js');
      console.log('');
      console.log('🔧 Current workaround: Your app is using fallback data');
      console.log('📱 Admin panel and cart work with temporary storage');
      return;
    }
    
    // Create sample data
    const success = await createSampleData();
    
    if (success) {
      // Save backup
      await saveDataToFiles();
      
      console.log('\n🎯 Next Steps:');
      console.log('1. Check your MongoDB Atlas dashboard - you should see the data');
      console.log('2. Visit http://localhost:3001/admin/products to manage products');
      console.log('3. Your app will now use real database data instead of fallbacks');
      console.log('4. Cart functionality will save to the database');
    }
    
  } catch (error) {
    console.error('❌ Script failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Run the script
main();
