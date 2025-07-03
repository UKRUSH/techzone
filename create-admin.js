const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function createAdminUser() {
  try {
    console.log('Creating admin user...');
    
    await prisma.$connect();
    console.log('Connected to database successfully');

    // Check if admin user already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { email: 'admin@techzone.com' }
    });

    if (existingAdmin) {
      console.log('Admin user already exists');
      return;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash('admin123', 12);

    // Create admin user
    const adminUser = await prisma.user.create({
      data: {
        name: 'TechZone Admin',
        email: 'admin@techzone.com',
        password: hashedPassword,
        role: 'ADMIN',
        emailVerified: new Date()
      }
    });

    console.log('Admin user created successfully:', {
      id: adminUser.id,
      email: adminUser.email,
      role: adminUser.role
    });

    // Create a regular user for testing
    const testUserPassword = await bcrypt.hash('test123', 12);
    const testUser = await prisma.user.create({
      data: {
        name: 'Test User',
        email: 'user@techzone.com',
        password: testUserPassword,
        role: 'BUYER',
        emailVerified: new Date()
      }
    });

    console.log('Test user created successfully:', {
      id: testUser.id,
      email: testUser.email,
      role: testUser.role
    });

    console.log('\nLogin credentials:');
    console.log('Admin: admin@techzone.com / admin123');
    console.log('User:  user@techzone.com / test123');

  } catch (error) {
    console.error('Error creating admin user:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createAdminUser();
