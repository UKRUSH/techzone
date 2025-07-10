const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    const users = await prisma.user.findMany({
      where: {
        email: {
          in: ['user@techzone.com', 'admin@techzone.com', 'jane@techzone.com']
        }
      },
      select: {
        email: true,
        name: true,
        password: true
      }
    });
    
    console.log('👥 Users in database with orders:');
    for (const user of users) {
      console.log(`\n📧 ${user.email} (${user.name})`);
      console.log(`   Password hash: ${user.password.substring(0, 30)}...`);
      
      // Test common passwords
      const commonPasswords = ['password123', 'admin123', 'user123', '123456', 'password'];
      for (const testPassword of commonPasswords) {
        const isValid = await bcrypt.compare(testPassword, user.password);
        if (isValid) {
          console.log(`   ✅ Password: ${testPassword}`);
          break;
        }
      }
    }

    console.log('\n🔐 Signin Instructions:');
    console.log('1. Go to: http://localhost:3000/auth/signin');
    console.log('2. Use one of these credentials:');
    console.log('   - user@techzone.com / password123');
    console.log('   - admin@techzone.com / admin123');
    console.log('   - jane@techzone.com / password123');
    console.log('3. After signin, go to: http://localhost:3000/profile');
    console.log('4. Orders should appear in Recent Activity section');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
