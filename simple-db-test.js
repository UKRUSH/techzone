console.log('🔧 Simple database connection test');
console.log('📄 Environment check...');

// Try to load environment variables
try {
  if (require('fs').existsSync('.env.local')) {
    const envContent = require('fs').readFileSync('.env.local', 'utf8');
    console.log('📋 Found .env.local file');
    
    // Parse environment variables manually
    envContent.split('\n').forEach(line => {
      if (line.includes('=') && !line.startsWith('#')) {
        const [key, ...valueParts] = line.split('=');
        process.env[key] = valueParts.join('=').replace(/"/g, '');
      }
    });
    
    console.log('✅ Environment variables loaded');
  }
} catch (envError) {
  console.log('⚠️ Could not load .env.local:', envError.message);
}

console.log('🔍 Checking DATABASE_URL...');
if (process.env.DATABASE_URL) {
  const maskedUrl = process.env.DATABASE_URL.replace(
    /mongodb\+srv:\/\/([^:]+):([^@]+)@/,
    'mongodb+srv://*****:*****@'
  );
  console.log('✅ DATABASE_URL found:', maskedUrl);
} else {
  console.log('❌ DATABASE_URL not found');
  process.exit(1);
}

console.log('📦 Attempting to import Prisma...');
try {
  const { PrismaClient } = require('@prisma/client');
  console.log('✅ Prisma imported successfully');
  
  console.log('🔧 Creating Prisma client...');
  const prisma = new PrismaClient({
    log: ['error'],
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    }
  });
  
  console.log('🔌 Testing connection...');
  prisma.$connect()
    .then(() => {
      console.log('✅ Connected to database!');
      
      // Test a simple operation
      return prisma.user.count();
    })
    .then(userCount => {
      console.log(`👥 Found ${userCount} users in database`);
      return prisma.$disconnect();
    })
    .then(() => {
      console.log('✅ Test completed successfully!');
      console.log('🎉 Your database connection is working!');
      process.exit(0);
    })
    .catch(error => {
      console.error('❌ Database test failed:', error.message);
      console.error('Error details:', error);
      process.exit(1);
    });
    
} catch (importError) {
  console.error('❌ Failed to import Prisma:', importError.message);
  console.log('💡 Try running: npm install @prisma/client');
  process.exit(1);
}
