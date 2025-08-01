// Simple cart test for debugging
console.log('🛒 Testing Cart Functionality');

// Test adding item and checking cart
async function testCartFlow() {
  try {
    const baseUrl = 'http://localhost:3001';
    
    // Step 1: Get current session ID from localStorage (simulate frontend)
    console.log('📍 Step 1: Simulating session ID...');
    const sessionId = 'test-session-' + Date.now();
    console.log('   Session ID:', sessionId);
    
    // Step 2: Add item to cart
    console.log('\n📍 Step 2: Adding item to cart...');
    const addResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: '686a88d3bea64c97f704c1d4', // Known variant ID
        quantity: 1,
        sessionId: sessionId
      }),
    });

    const addResult = await addResponse.json();
    console.log('   Add response:', addResult);
    
    if (!addResult.success) {
      console.log('❌ Failed to add item');
      return;
    }
    
    // Step 3: Fetch cart with same session ID
    console.log('\n📍 Step 3: Fetching cart...');
    const fetchResponse = await fetch(`${baseUrl}/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
    const fetchResult = await fetchResponse.json();
    
    console.log('   Fetch response:', fetchResult);
    console.log('   Cart items count:', Array.isArray(fetchResult) ? fetchResult.length : (fetchResult.data ? fetchResult.data.length : 0));
    
    // Step 4: Test mismatch scenario
    console.log('\n📍 Step 4: Testing with different session ID...');
    const wrongSessionId = 'wrong-session-' + Date.now();
    const fetchResponse2 = await fetch(`${baseUrl}/api/cart?sessionId=${encodeURIComponent(wrongSessionId)}`);
    const fetchResult2 = await fetchResponse2.json();
    
    console.log('   Fetch with wrong session:', fetchResult2);
    console.log('   Items with wrong session:', Array.isArray(fetchResult2) ? fetchResult2.length : (fetchResult2.data ? fetchResult2.data.length : 0));
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCartFlow();
