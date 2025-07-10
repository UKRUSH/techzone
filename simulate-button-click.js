async function simulateButtonClick() {
  const fetch = (await import('node-fetch')).default;
  const BASE_URL = 'http://localhost:3000';

  const testSessionId = 'debug-fresh-1752153093368';
  const itemId = '1752153104314'; // From the previous test

  try {
    console.log('🖱️ Simulating + button click...');
    console.log('SessionId:', testSessionId);
    console.log('ItemId:', itemId);

    // This is exactly what the + button would do: increase quantity from 2 to 3
    const updateResponse = await fetch(`${BASE_URL}/api/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: itemId,
        quantity: 3,
        sessionId: testSessionId
      })
    });

    console.log('Response status:', updateResponse.status);
    
    if (updateResponse.ok) {
      const result = await updateResponse.json();
      console.log('✅ Update successful:', result);
    } else {
      const errorText = await updateResponse.text();
      console.log('❌ Update failed:', errorText);
      
      // Let's also check what's currently in the cart
      console.log('\n🔍 Checking current cart state...');
      const cartResponse = await fetch(`${BASE_URL}/api/cart?sessionId=${testSessionId}`);
      const cartData = await cartResponse.json();
      console.log('Current cart items:', cartData.data.map(item => ({
        id: item.id,
        quantity: item.quantity,
        product: item.variant.product.name
      })));
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

simulateButtonClick();
