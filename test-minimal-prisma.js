#!/usr/bin/env node

// Minimal Prisma test
import { PrismaClient } from '@prisma/client';

async function minimalTest() {
  console.log('🧪 Minimal Prisma Test...\n');
  
  const prisma = new PrismaClient({
    log: ['error']
  });
  
  try {
    console.log('🔄 Testing basic connection...');
    await prisma.$connect();
    console.log('✅ Connection successful!');
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected');
  }
}

minimalTest();
