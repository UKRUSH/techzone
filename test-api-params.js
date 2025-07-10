async function testOrdersAPIWithParams() {
  const fetch = (await import('node-fetch')).default;
  
  const testCases = [
    '/api/user/orders',
    '/api/user/orders?page=1',
    '/api/user/orders?page=1&limit=10',
    '/api/user/orders?page=1&limit=10&status=all',
    '/api/user/orders?page=1&limit=10&status=delivered',
    '/api/user/orders?search=test',
    '/api/user/orders?page=1&limit=10&status=&search='
  ];
  
  console.log('🔍 Testing /api/user/orders with various parameters...\n');
  
  for (const url of testCases) {
    try {
      console.log(`Testing: ${url}`);
      const response = await fetch(`http://localhost:3001${url}`);
      console.log(`  Status: ${response.status} ${response.statusText}`);
      
      if (response.status === 404) {
        console.log('  ❌ Found 404 error!');
        const text = await response.text();
        console.log(`  Response: ${text}`);
      } else if (response.status === 401) {
        console.log('  ✅ Expected 401 (unauthorized)');
      } else {
        console.log(`  ⚠️  Unexpected status: ${response.status}`);
      }
      
    } catch (error) {
      console.log(`  ❌ Error: ${error.message}`);
    }
    console.log('');
  }
}

testOrdersAPIWithParams();
