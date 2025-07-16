const { PrismaClient } = require('@prisma/client');

async function testProfileData() {
  const prisma = new PrismaClient();
  
  try {
    await prisma.$connect();
    console.log('✅ Connected to database');
    
    // Get user by email
    const user = await prisma.user.findFirst({
      where: {
        email: {
          contains: 'shan'
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        phone: true,
        address: true,
        createdAt: true,
        updatedAt: true
      }
    });
    
    if (user) {
      console.log('\n📋 User Data:');
      console.log('- ID:', user.id);
      console.log('- Name:', user.name);
      console.log('- Email:', user.email);
      console.log('- Phone:', user.phone);
      console.log('- Address:', user.address);
      console.log('- Created At:', user.createdAt);
      console.log('- Updated At:', user.updatedAt);
      console.log('- Member Since (formatted):', user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A');
      
      console.log('\n✅ createdAt field is available for "Member Since" display');
    } else {
      console.log('❌ No user found');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testProfileData();
