// Test to reproduce the "Cart item not found" error scenario
const baseUrl = 'http://localhost:3001';

async function testSessionIdMismatch() {
  console.log('🔧 Testing Session ID Mismatch Scenario');
  console.log('=========================================');

  try {
    // Scenario 1: Add item with one session ID
    console.log('\n1️⃣ Adding item with sessionId-A...');
    const addResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        variantId: '1', 
        quantity: 2,
        sessionId: 'session-A' 
      })
    });

    const addResult = await addResponse.json();
    if (addResponse.ok) {
      console.log('✅ Item added with sessionId-A');
      console.log('   Item ID:', addResult.data?.id);
      
      const itemId = addResult.data?.id;
      
      // Scenario 2: Try to update with different session ID
      console.log('\n2️⃣ Attempting to update with sessionId-B (different session)...');
      const updateResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: itemId,
          quantity: 3,
          sessionId: 'session-B'  // Different session ID!
        })
      });

      const updateResult = await updateResponse.json();
      
      if (updateResponse.ok) {
        console.log('✅ Update succeeded (unexpected)');
      } else {
        console.log('❌ Update failed (expected):', updateResult.error);
        console.log('   This demonstrates the session ID mismatch issue');
        
        // Scenario 3: Update with correct session ID
        console.log('\n3️⃣ Updating with correct sessionId-A...');
        const correctUpdateResponse = await fetch(`${baseUrl}/api/cart`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: itemId,
            quantity: 3,
            sessionId: 'session-A'  // Correct session ID
          })
        });

        const correctUpdateResult = await correctUpdateResponse.json();
        
        if (correctUpdateResponse.ok) {
          console.log('✅ Update succeeded with correct session ID');
          console.log('   New quantity:', correctUpdateResult.data?.quantity);
        } else {
          console.log('❌ Update still failed:', correctUpdateResult.error);
        }
      }
    } else {
      console.log('❌ Failed to add item:', addResult.error);
    }

    // Scenario 4: Check cart contents for both sessions
    console.log('\n4️⃣ Checking cart contents for both sessions...');
    
    // Check session-A
    const cartAResponse = await fetch(`${baseUrl}/api/cart?sessionId=session-A`);
    const cartAResult = await cartAResponse.json();
    console.log('Session-A cart items:', cartAResult.data?.length || 0);
    
    // Check session-B
    const cartBResponse = await fetch(`${baseUrl}/api/cart?sessionId=session-B`);
    const cartBResult = await cartBResponse.json();
    console.log('Session-B cart items:', cartBResult.data?.length || 0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testSessionIdMismatch();
