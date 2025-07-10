async function testAPI() {
  const fetch = (await import('node-fetch')).default;
  
  try {
    console.log('🔍 Testing API on fresh server (port 3000)...');
    
    const response = await fetch('http://localhost:3000/api/user/orders');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    
    const text = await response.text();
    console.log('Response:', text);
    
    if (response.status === 404) {
      console.log('\n❌ Still getting 404');
    } else if (response.status === 401) {
      console.log('\n✅ API working correctly (401 Unauthorized as expected)');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

testAPI();
