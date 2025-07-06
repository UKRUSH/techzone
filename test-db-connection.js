const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('🔄 Testing MongoDB connection...');
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB!');
    
    // Test reading data
    console.log('\n📊 Testing data queries...');
    
    // Check categories
    const categories = await prisma.category.findMany();
    console.log(`📁 Categories found: ${categories.length}`);
    if (categories.length > 0) {
      console.log('   Sample categories:', categories.slice(0, 3).map(c => c.name));
    }
    
    // Check brands
    const brands = await prisma.brand.findMany();
    console.log(`🏷️ Brands found: ${brands.length}`);
    if (brands.length > 0) {
      console.log('   Sample brands:', brands.slice(0, 3).map(b => b.name));
    }
    
    // Check products
    const products = await prisma.product.findMany();
    console.log(`📦 Products found: ${products.length}`);
    if (products.length > 0) {
      console.log('   Sample products:', products.slice(0, 3).map(p => p.name));
    }
    
    // Check users
    const users = await prisma.user.findMany();
    console.log(`👥 Users found: ${users.length}`);
    
    if (categories.length === 0 && brands.length === 0 && products.length === 0) {
      console.log('\n⚠️ Database is empty! Need to seed data.');
      return false;
    }
    
    console.log('\n✅ Database connection and data check completed successfully!');
    return true;
    
  } catch (error) {
    console.error('\n❌ Database connection failed:', error.message);
    if (error.code) {
      console.error('   Error Code:', error.code);
    }
    return false;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the test
testConnection().then((success) => {
  if (!success) {
    console.log('\n💡 Troubleshooting suggestions:');
    console.log('   1. Check if MongoDB Atlas cluster is running');
    console.log('   2. Verify network access (IP whitelist)');
    console.log('   3. Check database credentials');
    console.log('   4. Run database seeding if empty');
  }
  process.exit(success ? 0 : 1);
});
