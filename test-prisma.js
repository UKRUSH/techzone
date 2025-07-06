// Test Prisma connection
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function testConnection() {
  try {
    console.log('Testing Prisma connection...');
    
    // Test basic connection
    const userCount = await prisma.user.count();
    console.log('User count:', userCount);
    
    // Test if Order model is accessible
    const orderCount = await prisma.order.count();
    console.log('Order count:', orderCount);
    
    console.log('✅ Prisma connection working!');
  } catch (error) {
    console.error('❌ Prisma connection failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testConnection();
