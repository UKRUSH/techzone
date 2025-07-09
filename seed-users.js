const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function seedUsers() {
  try {
    console.log('🌱 Seeding users...');

    // Check if users already exist
    const existingUsers = await prisma.user.count();
    if (existingUsers > 0) {
      console.log('✅ Users already exist in database');
      return;
    }

    // Hash passwords
    const adminPassword = await bcrypt.hash('admin123', 12);
    const userPassword = await bcrypt.hash('user123', 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'Admin User',
        email: 'admin@techzone.com',
        password: adminPassword,
        role: 'ADMIN',
        loyaltyPoints: 1000,
        loyaltyLevel: 'Gold',
        twoFactorEnabled: false
      }
    });

    console.log('✅ Created admin user:', adminUser.email);

    // Create test user
    const testUser = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'user@techzone.com',
        password: userPassword,
        role: 'BUYER',
        loyaltyPoints: 250,
        loyaltyLevel: 'Silver',
        twoFactorEnabled: false,
        addresses: {
          create: [
            {
              street: '123 Main Street',
              city: 'New York',
              state: 'NY',
              zipCode: '10001',
              country: 'United States',
              isDefault: true
            }
          ]
        }
      }
    });

    console.log('✅ Created test user:', testUser.email);

    // Create another test user with more data
    const premiumUser = await prisma.user.create({
      data: {
        name: 'Jane Smith',
        email: 'jane@techzone.com',
        password: userPassword,
        role: 'BUYER',
        loyaltyPoints: 750,
        loyaltyLevel: 'Gold',
        twoFactorEnabled: true,
        addresses: {
          create: [
            {
              street: '456 Oak Avenue',
              city: 'Los Angeles',
              state: 'CA',
              zipCode: '90210',
              country: 'United States',
              isDefault: true
            },
            {
              street: '789 Pine Street',
              city: 'San Francisco',
              state: 'CA',
              zipCode: '94102',
              country: 'United States',
              isDefault: false
            }
          ]
        }
      }
    });

    console.log('✅ Created premium user:', premiumUser.email);

    console.log('\n🎉 User seeding completed!');
    console.log('\n📋 Test Credentials:');
    console.log('Admin: admin@techzone.com / admin123');
    console.log('User 1: user@techzone.com / user123');
    console.log('User 2: jane@techzone.com / user123');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed function
if (require.main === module) {
  seedUsers()
    .catch(console.error)
    .finally(() => process.exit(0));
}

module.exports = { seedUsers };
