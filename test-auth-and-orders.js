async function testAuthAndOrders() {
  console.log('🔐 Testing Authentication and Orders API...\n');

  try {
    const fetch = (await import('node-fetch')).default;
    
    // Test 1: Check session endpoint
    console.log('1. 🧪 Testing session endpoint:');
    const sessionResponse = await fetch('http://localhost:3000/api/auth/session');
    const sessionData = await sessionResponse.json();
    console.log(`   Status: ${sessionResponse.status}`);
    console.log(`   Session data:`, sessionData);

    // Test 2: Check user endpoint
    console.log('\n2. 🧪 Testing user endpoint (unauthenticated):');
    const userResponse = await fetch('http://localhost:3000/api/user');
    console.log(`   Status: ${userResponse.status}`);
    if (!userResponse.ok) {
      const errorText = await userResponse.text();
      console.log(`   Error: ${errorText}`);
    }

    // Test 3: Check orders endpoint
    console.log('\n3. 🧪 Testing orders endpoint (unauthenticated):');
    const ordersResponse = await fetch('http://localhost:3000/api/user/orders');
    console.log(`   Status: ${ordersResponse.status}`);
    if (!ordersResponse.ok) {
      const errorText = await ordersResponse.text();
      console.log(`   Error: ${errorText}`);
    }

    console.log('\n4. 📝 Analysis:');
    console.log('   - If session is null, user needs to sign in');
    console.log('   - If user/orders APIs return 401, authentication is required');
    console.log('   - Profile page should redirect to signin if not authenticated');
    
    console.log('\n5. 🔧 Next steps:');
    console.log('   1. Open signin page: http://localhost:3000/auth/signin');
    console.log('   2. Sign in with: user@techzone.com / password123');
    console.log('   3. Go to profile page: http://localhost:3000/profile');
    console.log('   4. Check if orders appear');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testAuthAndOrders();
