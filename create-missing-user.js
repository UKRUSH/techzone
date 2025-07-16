// Create missing user in database
const { PrismaClient } = require('@prisma/client');

async function createMissingUser() {
  console.log('🔧 Creating missing user in database...');
  
  // Load environment variables
  try {
    require('dotenv').config({ path: '.env.local' });
    console.log('📄 Loaded environment variables');
  } catch (envError) {
    console.log('⚠️ Could not load .env.local:', envError.message);
  }

  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL not found');
    process.exit(1);
  }

  const prisma = new PrismaClient({
    log: ['error', 'warn'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });

  try {
    await prisma.$connect();
    console.log('✅ Connected to database');

    // User details from the session logs
    const userEmail = 'shan@gmail.com';
    const userId = '6876c042e07fdafe47ef9329';
    const userName = 'shan';

    // Check if user already exists by email or ID
    const existingUserByEmail = await prisma.user.findUnique({
      where: { email: userEmail }
    });
    
    const existingUserById = await prisma.user.findUnique({
      where: { id: userId }
    });

    console.log('🔍 Existing users check:', {
      byEmail: !!existingUserByEmail,
      byId: !!existingUserById,
      existingUserById: existingUserById ? {
        id: existingUserById.id,
        email: existingUserById.email,
        name: existingUserById.name
      } : null
    });

    if (existingUserByEmail) {
      console.log('👤 User already exists by email:', existingUserByEmail.email);
      return;
    }
    
    if (existingUserById) {
      console.log('🔄 User exists with ID but different email. Updating email...');
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          email: userEmail,
          name: userName,
          updatedAt: new Date()
        }
      });
      
      console.log('✅ User email updated:', {
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name
      });
      return;
    }

    // Create the user
    console.log('➕ Creating user:', userEmail);
    const newUser = await prisma.user.create({
      data: {
        id: userId,
        email: userEmail,
        name: userName,
        password: 'oauth-user', // Placeholder for OAuth users
        role: 'BUYER',
        loyaltyPoints: 0,
        loyaltyLevel: 'BRONZE',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ User created successfully:', {
      id: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role
    });

    // Verify the user was created
    const verifyUser = await prisma.user.findUnique({
      where: { email: userEmail }
    });

    if (verifyUser) {
      console.log('🎉 User verification successful!');
    } else {
      console.log('❌ User verification failed');
    }

  } catch (error) {
    console.error('❌ Error creating user:', error);
    
    if (error.code === 'P2002') {
      console.log('💡 User might already exist with different email case or ID');
    }
  } finally {
    await prisma.$disconnect();
    console.log('🔌 Disconnected from database');
  }
}

createMissingUser().catch(console.error);
