// Simple MongoDB connection test without Prisma
const { MongoClient } = require('mongodb');

const uri = "mongodb+srv://ukrush12:Uk12345678@cluster0.m6oq7cm.mongodb.net/techzone";

async function testDirectConnection() {
  console.log('🔄 Testing direct MongoDB connection...');
  
  const client = new MongoClient(uri, {
    serverSelectionTimeoutMS: 10000, // 10 second timeout
  });

  try {
    // Connect to MongoDB
    await client.connect();
    console.log('✅ Successfully connected to MongoDB Atlas!');
    
    // Test database access
    const db = client.db('techzone');
    const collections = await db.listCollections().toArray();
    console.log(`📊 Found ${collections.length} collections in database`);
    
    if (collections.length > 0) {
      console.log('   Collections:', collections.map(c => c.name).join(', '));
    }
    
    // Test basic write/read
    const testCollection = db.collection('test');
    await testCollection.insertOne({ test: 'connection', timestamp: new Date() });
    const doc = await testCollection.findOne({ test: 'connection' });
    console.log('✅ Database read/write test successful');
    
    // Clean up test
    await testCollection.deleteOne({ test: 'connection' });
    
    return true;
    
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    
    if (error.message.includes('Server selection timeout')) {
      console.log('\n🔧 Troubleshooting Steps:');
      console.log('1. Go to MongoDB Atlas → Network Access');
      console.log('2. Add your current IP address to whitelist');
      console.log('3. Or allow access from anywhere (0.0.0.0/0)');
      console.log('4. Wait 1-2 minutes for changes to apply');
    }
    
    if (error.message.includes('Authentication failed')) {
      console.log('\n🔧 Check Database User:');
      console.log('1. Go to MongoDB Atlas → Database Access');
      console.log('2. Verify user "ukrush12" exists');
      console.log('3. Check password is correct');
      console.log('4. Ensure user has read/write permissions');
    }
    
    return false;
  } finally {
    await client.close();
  }
}

testDirectConnection().then((success) => {
  process.exit(success ? 0 : 1);
});
