const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function testProfilePhoneAddress() {
  try {
    console.log('Creating test user with phone and address...');
    
    // Create a test user
    const hashedPassword = await bcrypt.hash('testpass123', 12);
    
    const testUser = await prisma.user.create({
      data: {
        name: 'Test Profile User',
        email: 'testprofile@example.com',
        password: hashedPassword,
        phone: '0771234567',
        address: '123 Test Street, Colombo',
        role: 'BUYER',
        loyaltyPoints: 0,
        loyaltyLevel: 'Bronze'
      }
    });
    
    console.log('Created user:', {
      id: testUser.id,
      name: testUser.name,
      email: testUser.email,
      phone: testUser.phone,
      address: testUser.address
    });
    
    // Update the user's phone and address
    console.log('\nUpdating phone and address...');
    
    const updatedUser = await prisma.user.update({
      where: { email: 'testprofile@example.com' },
      data: {
        phone: '0712345678',
        address: '456 Updated Street, Kandy',
      }
    });
    
    console.log('Updated user:', {
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      phone: updatedUser.phone,
      address: updatedUser.address
    });
    
    // Test clearing phone and address
    console.log('\nClearing phone and address...');
    
    const clearedUser = await prisma.user.update({
      where: { email: 'testprofile@example.com' },
      data: {
        phone: null,
        address: null,
      }
    });
    
    console.log('Cleared user:', {
      id: clearedUser.id,
      name: clearedUser.name,
      email: clearedUser.email,
      phone: clearedUser.phone,
      address: clearedUser.address
    });
    
    // Clean up
    await prisma.user.delete({
      where: { email: 'testprofile@example.com' }
    });
    
    console.log('\nTest completed successfully!');
    
  } catch (error) {
    console.error('Test failed:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProfilePhoneAddress();
