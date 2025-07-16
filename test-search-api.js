// Test the actual API endpoint to see if search is working
async function testSearchAPI() {
  const fetch = (await import('node-fetch')).default;
  console.log('🌐 Testing Orders Search API Endpoint...\n');

  try {
    // Test 1: Search by order number
    console.log('1. 🔍 Testing search by order number via API:');
    
    const searchTerm = 'TZ175';
    console.log(`   Searching for: "${searchTerm}"`);
    
    const response1 = await fetch(`http://localhost:3000/api/user/orders?search=${encodeURIComponent(searchTerm)}`);
    console.log(`   Response status: ${response1.status}`);
    
    if (!response1.ok) {
      const errorText = await response1.text();
      console.log(`   Error: ${errorText}`);
      return;
    }
    
    const data1 = await response1.json();
    console.log(`   Results: ${data1.orders?.length || 0} orders found`);
    if (data1.orders) {
      data1.orders.forEach(order => {
        console.log(`   ✓ ${order.orderNumber}`);
      });
    }

    // Test 2: Search by product name
    console.log('\n2. 🔍 Testing search by product name via API:');
    
    const searchTerm2 = 'LS3';
    console.log(`   Searching for: "${searchTerm2}"`);
    
    const response2 = await fetch(`http://localhost:3000/api/user/orders?search=${encodeURIComponent(searchTerm2)}`);
    console.log(`   Response status: ${response2.status}`);
    
    if (response2.ok) {
      const data2 = await response2.json();
      console.log(`   Results: ${data2.orders?.length || 0} orders found`);
      if (data2.orders) {
        data2.orders.forEach(order => {
          console.log(`   ✓ ${order.orderNumber} - Items: ${order.items?.map(i => i.name).join(', ')}`);
        });
      }
    }

    // Test 3: Empty search
    console.log('\n3. 🔍 Testing empty search via API:');
    
    const response3 = await fetch('http://localhost:3000/api/user/orders');
    console.log(`   Response status: ${response3.status}`);
    
    if (response3.ok) {
      const data3 = await response3.json();
      console.log(`   Results: ${data3.orders?.length || 0} orders found`);
    }

    // Test 4: Non-existent search
    console.log('\n4. 🔍 Testing non-existent search via API:');
    
    const searchTerm4 = 'NOTFOUND123';
    console.log(`   Searching for: "${searchTerm4}"`);
    
    const response4 = await fetch(`http://localhost:3000/api/user/orders?search=${encodeURIComponent(searchTerm4)}`);
    console.log(`   Response status: ${response4.status}`);
    
    if (response4.ok) {
      const data4 = await response4.json();
      console.log(`   Results: ${data4.orders?.length || 0} orders found`);
    }

  } catch (error) {
    console.error('❌ API Test error:', error.message);
    console.log('\n💡 Note: Make sure the development server is running on localhost:3000');
    console.log('   and that you have proper authentication set up');
  }
}

testSearchAPI();
