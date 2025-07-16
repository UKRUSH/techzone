#!/usr/bin/env node

// Test MongoDB connection directly
import { prisma, ensureConnection } from './lib/prisma.js';

async function testMongoConnection() {
  console.log('🧪 Testing MongoDB Atlas Connection...\n');
  
  try {
    console.log('📊 Environment check:');
    console.log('- DATABASE_URL exists:', !!process.env.DATABASE_URL);
    console.log('- DATABASE_URL format:', process.env.DATABASE_URL?.includes('mongodb+srv://') ? 'OK' : 'Invalid');
    
    console.log('\n🔄 Testing connection...');
    const connectionResult = await ensureConnection();
    
    if (connectionResult) {
      console.log('✅ Connection successful!');
      
      try {
        // Test a simple operation
        console.log('\n🧪 Testing database operations...');
        await prisma.$connect();
        console.log('✅ $connect() successful');
        
        console.log('✅ Database connection is working properly!');
      } catch (operationError) {
        console.error('❌ Database operation failed:', operationError.message);
      }
    } else {
      console.error('❌ Connection failed');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    try {
      await prisma.$disconnect();
      console.log('\n🔌 Disconnected from database');
    } catch (disconnectError) {
      console.error('Disconnect error:', disconnectError.message);
    }
  }
}

testMongoConnection();
