#!/usr/bin/env node

/**
 * MongoDB Atlas Connection Troubleshooting Script
 * This script helps diagnose and fix MongoDB Atlas connection issues
 */

const { MongoClient } = require('mongodb');
const fs = require('fs');
const path = require('path');

// Read environment file manually
function loadEnv() {
  try {
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const lines = envContent.split('\n');
    for (const line of lines) {
      if (line.startsWith('DATABASE_URL=')) {
        return line.split('=')[1].replace(/"/g, '').trim();
      }
    }
  } catch (error) {
    console.log('Could not read .env.local file');
  }
  return null;
}

const originalConnectionString = loadEnv();

console.log('🔧 MongoDB Atlas Connection Troubleshooting');
console.log('=' .repeat(50));

// Parse the connection string
const connectionString = originalConnectionString;
console.log('\n📋 Connection Details:');
console.log('Original URL:', connectionString?.slice(0, 50) + '...');

// Alternative connection strings with different SSL configurations
const connectionVariants = [
  {
    name: 'Original (with default SSL)',
    url: connectionString
  },
  {
    name: 'Explicit SSL disabled',
    url: connectionString + '?ssl=false'
  },
  {
    name: 'Explicit SSL enabled with validation disabled',
    url: connectionString + '?ssl=true&tlsInsecure=true'
  },
  {
    name: 'With authSource and SSL options',
    url: connectionString + '?authSource=admin&ssl=true&tlsAllowInvalidCertificates=true'
  },
  {
    name: 'With retryWrites disabled',
    url: connectionString + '?retryWrites=false&w=majority'
  }
];

async function testConnection(variant) {
  console.log(`\n🔄 Testing: ${variant.name}`);
  console.log(`URL: ${variant.url.slice(0, 50)}...`);
  
  const client = new MongoClient(variant.url, {
    serverSelectionTimeoutMS: 5000, // 5 second timeout
    connectTimeoutMS: 5000,
    maxPoolSize: 1,
  });

  try {
    await client.connect();
    console.log('✅ Connection successful!');
    
    // Test database operations
    const db = client.db('techzone');
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Test a simple query
    try {
      const productCount = await db.collection('Product').countDocuments();
      console.log(`📦 Products in database: ${productCount}`);
      
      if (productCount > 0) {
        const sampleProduct = await db.collection('Product').findOne();
        console.log('📋 Sample product:', sampleProduct?.name || 'No name');
      }
    } catch (queryError) {
      console.log('⚠️  Collection query failed:', queryError.message);
    }
    
    await client.close();
    
    console.log('🎉 This connection string works! Update your .env.local file:');
    console.log(`DATABASE_URL="${variant.url}"`);
    
    return true;
  } catch (error) {
    console.log('❌ Connection failed:', error.message);
    return false;
  } finally {
    try {
      await client.close();
    } catch (e) {
      // Ignore close errors
    }
  }
}

async function checkAtlasCluster() {
  console.log('\n🏥 Atlas Cluster Health Check');
  console.log('-'.repeat(30));
  
  // Extract cluster info from connection string
  const match = connectionString?.match(/mongodb\+srv:\/\/([^:]+):([^@]+)@([^\/]+)/);
  if (match) {
    const [, username, password, cluster] = match;
    console.log(`👤 Username: ${username}`);
    console.log(`🔗 Cluster: ${cluster}`);
    
    console.log('\n📋 Troubleshooting Checklist:');
    console.log('1. ✅ Check cluster status at https://cloud.mongodb.com/');
    console.log('2. ✅ Verify cluster is not paused/suspended');
    console.log('3. ✅ Check network access (IP whitelist)');
    console.log('   - Add 0.0.0.0/0 for testing (not recommended for production)');
    console.log('   - Or add your current IP address');
    console.log('4. ✅ Verify database user credentials');
    console.log('5. ✅ Check if database user has proper permissions');
    console.log('6. ✅ Ensure cluster region is accessible from your location');
  }
}

async function createFallbackData() {
  console.log('\n💾 Creating Fallback Data');
  console.log('-'.repeat(25));
  
  const fallbackCategories = [
    { id: 'cpu', name: 'CPU', slug: 'cpu' },
    { id: 'gpu', name: 'GPU', slug: 'gpu' },
    { id: 'memory', name: 'Memory', slug: 'memory' },
    { id: 'storage', name: 'Storage', slug: 'storage' },
    { id: 'motherboard', name: 'Motherboard', slug: 'motherboard' },
    { id: 'power-supply', name: 'Power Supply', slug: 'power-supply' },
    { id: 'cooling', name: 'Cooling', slug: 'cooling' },
    { id: 'case', name: 'Case', slug: 'case' }
  ];
  
  const fallbackBrands = [
    { id: 'intel', name: 'Intel', slug: 'intel' },
    { id: 'amd', name: 'AMD', slug: 'amd' },
    { id: 'nvidia', name: 'NVIDIA', slug: 'nvidia' },
    { id: 'corsair', name: 'Corsair', slug: 'corsair' },
    { id: 'asus', name: 'ASUS', slug: 'asus' },
    { id: 'msi', name: 'MSI', slug: 'msi' },
    { id: 'gigabyte', name: 'Gigabyte', slug: 'gigabyte' },
    { id: 'evga', name: 'EVGA', slug: 'evga' }
  ];
  
  // Write fallback data to files
  const tempDir = path.join(process.cwd(), 'temp-data');
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir, { recursive: true });
  }
  
  fs.writeFileSync(
    path.join(tempDir, 'categories.json'),
    JSON.stringify(fallbackCategories, null, 2)
  );
  
  fs.writeFileSync(
    path.join(tempDir, 'brands.json'),
    JSON.stringify(fallbackBrands, null, 2)
  );
  
  console.log('✅ Fallback categories and brands created');
  console.log('📁 Location: temp-data/ directory');
  console.log('🎯 Admin panel can now work with fallback data');
}

async function main() {
  if (!connectionString) {
    console.log('❌ No DATABASE_URL found in .env.local');
    console.log('📝 Please create .env.local with your MongoDB connection string');
    return;
  }
  
  await checkAtlasCluster();
  
  console.log('\n🔍 Testing Connection Variants');
  console.log('=' .repeat(40));
  
  let successfulConnection = false;
  
  for (const variant of connectionVariants) {
    const success = await testConnection(variant);
    if (success) {
      successfulConnection = true;
      break;
    }
  }
  
  if (!successfulConnection) {
    console.log('\n💡 No connection variants worked. Recommendations:');
    console.log('1. 🌐 Check your internet connection');
    console.log('2. 🔐 Verify MongoDB Atlas credentials');
    console.log('3. 🛡️  Check firewall/network restrictions');
    console.log('4. 📞 Contact MongoDB Atlas support if issue persists');
    console.log('\n🔄 Creating fallback data for development...');
    await createFallbackData();
  }
  
  console.log('\n📝 Next Steps:');
  console.log('1. If a connection worked, update your .env.local file');
  console.log('2. Test the admin panel at http://localhost:3000/admin/products');
  console.log('3. If still failing, use fallback mode for development');
  console.log('4. Monitor MongoDB Atlas dashboard for cluster status');
}

main().catch(console.error);
