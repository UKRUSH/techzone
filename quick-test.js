#!/usr/bin/env node

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function quickTest() {
  try {
    console.log('🔍 Quick MongoDB Atlas Connection Test');
    console.log('=' .repeat(40));
    
    // Test basic connection
    await prisma.$connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log('✅ Database query test passed!');
    
    // Check if we have any data
    const productCount = await prisma.product.count();
    const categoryCount = await prisma.category.count();
    const brandCount = await prisma.brand.count();
    
    console.log('');
    console.log('📊 Current Database Status:');
    console.log(`   Products: ${productCount}`);
    console.log(`   Categories: ${categoryCount}`);
    console.log(`   Brands: ${brandCount}`);
    
    if (productCount === 0) {
      console.log('');
      console.log('💡 Database is empty. Run: node populate-database.js');
    } else {
      console.log('');
      console.log('🎉 Database has products! Your website should work now.');
      console.log('🌐 Visit: http://localhost:3000/products');
    }
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    console.log('');
    console.log('🔧 Run this for help: node fix-database-connection.js');
  } finally {
    await prisma.$disconnect();
  }
}

quickTest();
