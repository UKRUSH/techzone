async function testOrdersPageFlow() {
  try {
    const fetch = (await import('node-fetch')).default;
    
    console.log('🔄 Testing complete orders page flow...');
    
    // Test 1: Check if we can access the signin page
    console.log('\n1. Testing signin page access...');
    const signinResponse = await fetch('http://localhost:3001/auth/signin');
    console.log('Signin page status:', signinResponse.status);
    
    // Test 2: Check current session status
    console.log('\n2. Testing current session...');
    const sessionResponse = await fetch('http://localhost:3001/api/auth/session');
    const sessionData = await sessionResponse.json();
    console.log('Current session:', sessionData);
    
    // Test 3: Test orders page without authentication
    console.log('\n3. Testing orders page (unauthenticated)...');
    const ordersResponse = await fetch('http://localhost:3001/orders');
    console.log('Orders page status:', ordersResponse.status);
    
    // Test 4: Test orders API directly
    console.log('\n4. Testing orders API (unauthenticated)...');
    const apiResponse = await fetch('http://localhost:3001/api/user/orders');
    const apiData = await apiResponse.json();
    console.log('Orders API status:', apiResponse.status);
    console.log('Orders API response:', apiData);
    
    console.log('\n✅ Flow test completed');
    
  } catch (error) {
    console.error('❌ Flow test failed:', error);
  }
}

testOrdersPageFlow();
