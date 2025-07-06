// Test MongoDB connection and migrate fallback data to database
const { PrismaClient } = require('@prisma/client');
const fs = require('fs');
const path = require('path');

async function testDatabaseConnection() {
  console.log('🔍 Testing MongoDB Atlas Connection and Data Migration...\n');

  const prisma = new PrismaClient();

  try {
    // Test basic connection
    console.log('📡 Testing MongoDB Atlas connection...');
    await prisma.$connect();
    console.log('✅ MongoDB Atlas connection successful!');

    // Test database queries
    console.log('📊 Testing database operations...');
    
    // Check existing data
    const [existingProducts, existingCategories, existingBrands] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.brand.count()
    ]);

    console.log(`📦 Current database status:`);
    console.log(`   Products: ${existingProducts}`);
    console.log(`   Categories: ${existingCategories}`);
    console.log(`   Brands: ${existingBrands}`);

    // Check if we have fallback data to migrate
    const tempDataPath = path.join(process.cwd(), 'temp-data');
    const productsFile = path.join(tempDataPath, 'products.json');
    const categoriesFile = path.join(tempDataPath, 'categories.json');
    const brandsFile = path.join(tempDataPath, 'brands.json');

    let fallbackProducts = [];
    let fallbackCategories = [];
    let fallbackBrands = [];

    if (fs.existsSync(productsFile)) {
      fallbackProducts = JSON.parse(fs.readFileSync(productsFile, 'utf8'));
    }
    if (fs.existsSync(categoriesFile)) {
      fallbackCategories = JSON.parse(fs.readFileSync(categoriesFile, 'utf8'));
    }
    if (fs.existsSync(brandsFile)) {
      fallbackBrands = JSON.parse(fs.readFileSync(brandsFile, 'utf8'));
    }

    console.log(`\\n🔄 Fallback data available:`);
    console.log(`   Products: ${fallbackProducts.length}`);
    console.log(`   Categories: ${fallbackCategories.length}`);
    console.log(`   Brands: ${fallbackBrands.length}`);

    if (fallbackProducts.length > 0) {
      console.log('\\n🚀 Migrating fallback data to MongoDB Atlas...');
      
      // Migrate categories first
      if (fallbackCategories.length > 0) {
        console.log('📁 Migrating categories...');
        for (const category of fallbackCategories) {
          await prisma.category.upsert({
            where: { name: category.name },
            update: {},
            create: {
              name: category.name,
              description: category.description || ''
            }
          });
        }
        console.log(`✅ Migrated ${fallbackCategories.length} categories`);
      }

      // Migrate brands
      if (fallbackBrands.length > 0) {
        console.log('🏢 Migrating brands...');
        for (const brand of fallbackBrands) {
          await prisma.brand.upsert({
            where: { name: brand.name },
            update: {},
            create: {
              name: brand.name,
              description: brand.description || ''
            }
          });
        }
        console.log(`✅ Migrated ${fallbackBrands.length} brands`);
      }

      // Migrate products
      console.log('📦 Migrating products...');
      let migratedCount = 0;

      for (const product of fallbackProducts) {
        try {
          // Find or create category
          const category = await prisma.category.upsert({
            where: { name: product.category },
            update: {},
            create: { name: product.category }
          });

          // Find or create brand
          const brand = await prisma.brand.upsert({
            where: { name: product.brand },
            update: {},
            create: { name: product.brand }
          });

          // Create product with variants
          await prisma.product.upsert({
            where: { name: product.name },
            update: {
              description: product.description,
              updatedAt: new Date()
            },
            create: {
              name: product.name,
              description: product.description || '',
              categoryId: category.id,
              brandId: brand.id,
              variants: {
                create: {
                  sku: `${product.name.replace(/\\s+/g, '-').toUpperCase()}-001`,
                  price: product.price || 0,
                  attributes: {
                    stock: product.stock || 0,
                    imageUrl: product.imageUrl || ''
                  }
                }
              }
            }
          });

          migratedCount++;
          console.log(`   ✅ Migrated: ${product.name}`);
        } catch (error) {
          console.log(`   ❌ Failed to migrate: ${product.name} - ${error.message}`);
        }
      }

      console.log(`\\n🎉 Migration completed! Migrated ${migratedCount}/${fallbackProducts.length} products`);

      // Final count check
      const finalCounts = await Promise.all([
        prisma.product.count(),
        prisma.category.count(),
        prisma.brand.count()
      ]);

      console.log(`\\n📊 Final database status:`);
      console.log(`   Products: ${finalCounts[0]}`);
      console.log(`   Categories: ${finalCounts[1]}`);
      console.log(`   Brands: ${finalCounts[2]}`);

      console.log(`\\n✅ SUCCESS: Your data is now in MongoDB Atlas!`);
      console.log(`💡 You can now use the main API endpoints that save directly to MongoDB.`);
      
    } else {
      console.log('\\n💡 No fallback data to migrate. Database is ready for new products.');
    }

  } catch (error) {
    console.error('❌ MongoDB Atlas connection failed:', error.message);
    console.log('\\n🔧 Troubleshooting steps:');
    console.log('1. Check your .env.local file has the correct DATABASE_URL');
    console.log('2. Verify your MongoDB Atlas cluster is running (not paused)');
    console.log('3. Check Network Access whitelist includes your IP address');
    console.log('4. Verify database user has readWrite permissions');
    console.log('\\n💡 Your app will continue using fallback storage until MongoDB is fixed.');
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testDatabaseConnection();
