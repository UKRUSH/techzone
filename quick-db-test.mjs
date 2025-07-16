// Quick Database Test
import { prisma, ensureConnection } from './lib/prisma.js';

console.log('🧪 Quick Database Connection Test');

async function quickTest() {
  try {
    console.log('🔄 Testing ensureConnection...');
    const connected = await ensureConnection();
    console.log(`Connection result: ${connected}`);
    
    if (connected) {
      console.log('🔄 Testing user count...');
      const count = await prisma.user.count();
      console.log(`✅ Users found: ${count}`);
    }
    
  } catch (error) {
    console.log('❌ Error:', error.message);
    console.log('Full error:', error);
  }
}

quickTest();
