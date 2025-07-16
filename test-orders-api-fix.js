#!/usr/bin/env node

// Test the orders API directly
async function testOrdersAPI() {
  const fetch = (await import('node-fetch')).default;
  
  console.log('🧪 Testing Orders API...\n');
  
  try {
    // Test the API endpoint
    const response = await fetch('http://localhost:3001/api/user/orders');
    
    console.log('📊 Response status:', response.status);
    console.log('📊 Response status text:', response.statusText);
    
    const responseText = await response.text();
    console.log('📊 Response body:', responseText);
    
    if (response.status === 503) {
      console.log('\n❌ Service unavailable - database connection issue confirmed');
      console.log('💡 This suggests the MongoDB connection is still failing');
    } else if (response.status === 401) {
      console.log('\n✅ API is working! (401 Unauthorized is expected without authentication)');
    } else {
      console.log('\n📊 Unexpected response - check server logs');
    }
    
  } catch (error) {
    console.error('❌ API test failed:', error.message);
    if (error.code === 'ECONNREFUSED') {
      console.log('💡 Development server is not running on port 3001');
      console.log('👉 Run: npm run dev');
    }
  }
}

testOrdersAPI();
