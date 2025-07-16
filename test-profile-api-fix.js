#!/usr/bin/env node

async function testProfilePageAPI() {
  try {
    console.log('🧪 Testing Profile Page API Connection');
    console.log('=====================================');
    
    // Test 1: Check if server is running on 3001
    console.log('1. Testing server connection on port 3001...');
    
    const serverResponse = await fetch('http://localhost:3001');
    console.log('   Server response status:', serverResponse.status);
    
    if (serverResponse.status === 200 || serverResponse.status === 404) {
      console.log('   ✅ Server is running on port 3001');
    } else {
      console.log('   ❌ Server issue on port 3001');
    }
    
    // Test 2: Test the user API endpoint
    console.log('\n2. Testing /api/user endpoint...');
    
    const userResponse = await fetch('http://localhost:3001/api/user');
    console.log('   API response status:', userResponse.status);
    
    if (userResponse.status === 401) {
      console.log('   ✅ API is working (401 Unauthorized expected without session)');
    } else if (userResponse.status === 503) {
      console.log('   ❌ Database connection issue (503 Service Unavailable)');
      const errorText = await userResponse.text();
      console.log('   Error details:', errorText);
    } else {
      console.log('   ⚠️  Unexpected status:', userResponse.status);
    }
    
    // Test 3: Test basic profile page
    console.log('\n3. Testing profile page access...');
    
    const profileResponse = await fetch('http://localhost:3001/profile');
    console.log('   Profile page status:', profileResponse.status);
    
    if (profileResponse.status === 200) {
      console.log('   ✅ Profile page accessible');
    } else {
      console.log('   ❌ Profile page issue');
    }
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.log('❌ Server not running on port 3001');
      console.log('💡 Run: npm run dev');
    } else {
      console.error('❌ Test failed:', error.message);
    }
  }
}

// Run the test
testProfilePageAPI();
