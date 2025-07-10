async function testOrdersAPI() {
  const fetch = (await import('node-fetch')).default;
  
  try {
    console.log('🔍 Testing /api/user/orders endpoint...');
    
    const response = await fetch('http://localhost:3001/api/user/orders');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers.entries()));
    
    const text = await response.text();
    console.log('Response body:', text);
    
    if (response.status === 404) {
      console.log('\n❌ API endpoint returning 404 - route not found');
      console.log('This could indicate:');
      console.log('1. Route file structure issue');
      console.log('2. Next.js compilation problem');
      console.log('3. Route not properly exported');
    } else if (response.status === 401) {
      console.log('\n✅ API endpoint exists but requires authentication (expected)');
    }
    
  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

testOrdersAPI();
