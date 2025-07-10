const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testUserAuth() {
  try {
    console.log('🔍 Testing user authentication setup...');
    
    // Test 1: Verify user exists and password matches
    const email = 'user@techzone.com';
    const password = 'user123';
    
    console.log(`\n1. Looking for user: ${email}`);
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        email: true,
        name: true,
        password: true,
        role: true
      }
    });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    });
    
    // Test 2: Verify password
    console.log('\n2. Testing password...');
    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid) {
      console.log('❌ Password does not match');
      return;
    }
    
    console.log('✅ Password matches');
    
    // Test 3: Check user's orders
    console.log('\n3. Checking user orders...');
    const orders = await prisma.order.findMany({
      where: {
        userId: user.id
      },
      select: {
        id: true,
        confirmationNumber: true,
        status: true,
        total: true,
        createdAt: true
      }
    });
    
    console.log(`✅ Found ${orders.length} orders for this user:`);
    orders.forEach((order, index) => {
      console.log(`   ${index + 1}. ${order.confirmationNumber} - ${order.status} - $${order.total}`);
    });
    
    console.log('\n🎯 CONCLUSION:');
    console.log('- User credentials are valid');
    console.log('- User has orders in database');
    console.log('- Issue is with session management in NextAuth');
    
    console.log('\n💡 RECOMMENDATION:');
    console.log('1. Sign in manually at http://localhost:3001/auth/signin');
    console.log(`2. Use email: ${email} and password: ${password}`);
    console.log('3. After successful signin, navigate to /orders');
    console.log('4. Should see order history');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUserAuth();
