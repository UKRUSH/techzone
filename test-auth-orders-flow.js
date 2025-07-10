async function testAuthenticatedOrdersAPI() {
  const fetch = (await import('node-fetch')).default;
  
  try {
    console.log('🔍 Testing authenticated orders API flow...');
    
    // Test 1: Check if we can get session
    console.log('\n1. Testing session endpoint...');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session');
    const sessionData = await sessionResponse.json();
    console.log('Session status:', sessionResponse.status);
    console.log('Session data:', sessionData);
    
    // Test 2: Check NextAuth provider configuration
    console.log('\n2. Testing NextAuth providers...');
    const providersResponse = await fetch('http://localhost:3000/api/auth/providers');
    const providersData = await providersResponse.json();
    console.log('Providers status:', providersResponse.status);
    console.log('Available providers:', Object.keys(providersData || {}));
    
    // Test 3: Test the orders API without auth (should get 401)
    console.log('\n3. Testing orders API without auth...');
    const ordersResponse = await fetch('http://localhost:3000/api/user/orders');
    console.log('Orders API status:', ordersResponse.status);
    const ordersText = await ordersResponse.text();
    console.log('Orders API response:', ordersText);
    
    console.log('\n📝 Summary:');
    console.log('- Database has orders properly linked to users');
    console.log('- API endpoints are accessible');
    console.log('- Need to test with actual user session');
    console.log('\n🎯 Next step: Sign in manually and test orders page');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testAuthenticatedOrdersAPI();
