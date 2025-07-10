async function testDebugCartFresh() {
  const fetch = (await import('node-fetch')).default;
  const BASE_URL = 'http://localhost:3000';

  try {
    console.log('🔍 Creating fresh cart for debugging...\n');

    const testSessionId = 'debug-fresh-' + Date.now();
    console.log('🆔 Test SessionId:', testSessionId);

    // Get product
    const productsResponse = await fetch(`${BASE_URL}/api/products?limit=1`);
    const productsData = await productsResponse.json();
    const product = productsData.data[0];
    const variant = product.variants[0];

    // Add item to cart
    console.log('➕ Adding item to cart...');
    const addResponse = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId: variant.id,
        quantity: 2,
        sessionId: testSessionId
      })
    });

    if (addResponse.ok) {
      const addResult = await addResponse.json();
      console.log('✅ Item added successfully');
      console.log('   Item ID:', addResult.data.id);
      console.log('   Quantity:', addResult.data.quantity);
      
      // Verify the item exists in cart
      console.log('\n🔍 Verifying item in cart...');
      const cartResponse = await fetch(`${BASE_URL}/api/cart?sessionId=${testSessionId}`);
      const cartData = await cartResponse.json();
      
      if (cartData.data.length > 0) {
        console.log('✅ Item found in cart');
        console.log('   Backend Item ID:', cartData.data[0].id);
        console.log('   Backend Quantity:', cartData.data[0].quantity);
        console.log('   Product Name:', cartData.data[0].variant.product.name);
        
        console.log('\n🌐 Test the cart page at:');
        console.log(`   http://localhost:3000/cart?sessionId=${testSessionId}`);
        console.log('\n💡 The + and - buttons should work with the debug logs showing the issue.');
      } else {
        console.log('❌ Item not found in cart');
      }
    } else {
      console.log('❌ Failed to add item');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testDebugCartFresh();
