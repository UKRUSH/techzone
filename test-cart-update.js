// Test cart update functionality specifically
const baseUrl = 'http://localhost:3001';

async function testCartUpdate() {
  console.log('🔧 Testing Cart Update Functionality');
  console.log('====================================');

  try {
    // Step 1: Clear any existing cart
    console.log('\n1️⃣ Clearing existing cart...');
    await fetch(`${baseUrl}/api/cart`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ clearAll: true, sessionId: 'test-session-123' })
    });

    // Step 2: Add an item to cart
    console.log('\n2️⃣ Adding item to cart...');
    const addResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        variantId: '1', 
        quantity: 2,
        sessionId: 'test-session-123' 
      })
    });

    const addResult = await addResponse.json();
    if (addResponse.ok) {
      console.log('✅ Item added successfully');
      console.log('   Item ID:', addResult.data?.id);
      console.log('   Item ID type:', typeof addResult.data?.id);
      console.log('   Quantity:', addResult.data?.quantity);
      
      const itemId = addResult.data?.id;
      
      // Step 3: Try to update the item
      console.log('\n3️⃣ Updating cart item quantity...');
      console.log('   Using itemId:', itemId, '(type:', typeof itemId, ')');
      
      const updateResponse = await fetch(`${baseUrl}/api/cart`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: itemId,
          quantity: 3,
          sessionId: 'test-session-123'
        })
      });

      const updateResult = await updateResponse.json();
      
      if (updateResponse.ok) {
        console.log('✅ Item updated successfully');
        console.log('   New quantity:', updateResult.data?.quantity);
      } else {
        console.log('❌ Update failed:', updateResult.error);
        console.log('   Status:', updateResponse.status);
        
        // Step 4: Check what's actually in the cart after failed update
        console.log('\n4️⃣ Checking current cart state...');
        const cartResponse = await fetch(`${baseUrl}/api/cart?sessionId=test-session-123`);
        const cartResult = await cartResponse.json();
        
        if (cartResponse.ok) {
          console.log('   Current cart items:', cartResult.data?.length || 0);
          if (cartResult.data?.length > 0) {
            cartResult.data.forEach((item, index) => {
              console.log(`   Item ${index + 1}:`);
              console.log(`     ID: ${item.id} (type: ${typeof item.id})`);
              console.log(`     Name: ${item.variant?.product?.name}`);
              console.log(`     Quantity: ${item.quantity}`);
            });
          }
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
testCartUpdate();
