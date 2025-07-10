// Test to reproduce the "Cart item not found" error and verify the fix
const baseUrl = 'http://localhost:3000';

async function testCartItemRecovery() {
  console.log('🔧 Testing Cart Item Recovery System');
  console.log('====================================');

  try {
    const sessionId = 'test-recovery-session';
    
    // Step 1: Add item to cart
    console.log('\n1️⃣ Adding item to cart...');
    const addResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        variantId: '1', 
        quantity: 2,
        sessionId: sessionId 
      })
    });

    const addResult = await addResponse.json();
    if (addResponse.ok) {
      console.log('✅ Item added successfully');
      console.log('   Item ID:', addResult.data?.id);
      
      const itemId = addResult.data?.id;
      
      // Step 2: Simulate cart loss by using wrong session
      console.log('\n2️⃣ Simulating cart item loss (wrong session)...');
      const updateResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: itemId,
          quantity: 3,
          sessionId: 'wrong-session-id'
        })
      });

      const updateResult = await updateResponse.json();
      
      if (updateResponse.ok) {
        console.log('⚠️ Update succeeded (unexpected with wrong session)');
      } else {
        console.log('❌ Update failed as expected:', updateResult.error);
        console.log('   This simulates the "Cart item not found" error');
        
        // Step 3: Test the recovery mechanism
        console.log('\n3️⃣ Testing recovery with correct session...');
        const recoveryResponse = await fetch(`${baseUrl}/api/cart`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            itemId: itemId,
            quantity: 3,
            sessionId: sessionId  // Correct session
          })
        });

        const recoveryResult = await recoveryResponse.json();
        
        if (recoveryResponse.ok) {
          console.log('✅ Recovery successful! Item migrated and updated');
          console.log('   New quantity:', recoveryResult.data?.quantity);
        } else {
          console.log('❌ Recovery failed:', recoveryResult.error);
        }
      }
      
      // Step 4: Verify final cart state
      console.log('\n4️⃣ Verifying final cart state...');
      const finalCartResponse = await fetch(`${baseUrl}/api/cart?sessionId=${sessionId}`);
      const finalCartResult = await finalCartResponse.json();
      
      if (finalCartResponse.ok) {
        console.log('✅ Final cart check:');
        console.log('   Items in cart:', finalCartResult.data?.length || 0);
        if (finalCartResult.data?.length > 0) {
          finalCartResult.data.forEach((item, index) => {
            console.log(`   Item ${index + 1}: ${item.variant?.product?.name} (Qty: ${item.quantity})`);
          });
        }
      }
      
    } else {
      console.log('❌ Failed to add item:', addResult.error);
    }

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testCartItemRecovery();
