async function testOrdersAPIEndpoint() {
  const fetch = (await import('node-fetch')).default;
  try {
    console.log('🔄 Testing /api/user/orders endpoint directly...');
    
    // Test 1: Call API without authentication (should get 401)
    console.log('\n1. Testing without authentication...');
    const response1 = await fetch('http://localhost:3001/api/user/orders');
    const data1 = await response1.json();
    console.log('Status:', response1.status);
    console.log('Response:', data1);
    
    // Test 2: Let's simulate what the frontend might be sending
    console.log('\n2. Testing the actual API call structure...');
    
    // We need to check what the actual auth session looks like
    // Let's first check if we can access the endpoint and see the specific error
    
    const response2 = await fetch('http://localhost:3001/api/user/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        // Note: In a real scenario, we'd need the session cookie
      }
    });
    
    const data2 = await response2.text(); // Get as text first in case it's not JSON
    console.log('Status:', response2.status);
    console.log('Response headers:', Object.fromEntries(response2.headers.entries()));
    console.log('Response body:', data2);
    
  } catch (error) {
    console.error('❌ Error testing API endpoint:', error);
  }
}

testOrdersAPIEndpoint();
