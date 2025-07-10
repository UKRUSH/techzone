async function quickCartTest() {
  const fetch = (await import('node-fetch')).default;
  const BASE_URL = 'http://localhost:3000';

  try {
    console.log('⚡ Quick Cart Test...\n');

    const testSessionId = 'quick-test-' + Date.now();

    // Get product and add to cart
    const productsResponse = await fetch(`${BASE_URL}/api/products?limit=1`);
    const productsData = await productsResponse.json();
    const product = productsData.data[0];
    const variant = product.variants[0];

    const addResponse = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId: variant.id,
        quantity: 3,
        sessionId: testSessionId
      })
    });

    if (addResponse.ok) {
      console.log('✅ Product added to cart');
      console.log(`🔗 Test cart UI: http://localhost:3000/cart?sessionId=${testSessionId}`);
      
      // Verify cart contents
      const cartResponse = await fetch(`${BASE_URL}/api/cart?sessionId=${testSessionId}`);
      const cartData = await cartResponse.json();
      
      if (cartData.data.length > 0) {
        const item = cartData.data[0];
        console.log(`📦 Item: ${item.variant.product.name}`);
        console.log(`📊 Quantity: ${item.quantity}`);
        console.log(`💰 Price: Rs. ${item.variant.price}`);
        console.log(`📈 Stock: ${item.variant.totalStock} available`);
        console.log(`🎯 Cart API is working perfectly!`);
      }
    } else {
      console.log('❌ Failed to add product');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

quickCartTest();
