const { MongoClient } = require('mongodb');

async function testMongoDB() {
  const uri = process.env.DATABASE_URL || "mongodb+srv://ukrush12:Uk12345678@cluster0.m6oq7cm.mongodb.net/techzone";
  console.log('🧪 Testing direct MongoDB connection...');
  console.log('URI pattern:', uri.replace(/\/\/[^:]+:[^@]+@/, '//***:***@'));
  
  const client = new MongoClient(uri);
  
  try {
    console.log('Attempting to connect...');
    await client.connect();
    console.log('✅ MongoDB connection successful');
    
    const db = client.db('techzone');
    const collections = await db.listCollections().toArray();
    console.log('✅ Database accessed. Collections:', collections.map(c => c.name));
    
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
  } finally {
    await client.close();
    console.log('🔌 Disconnected');
  }
}

testMongoDB();
