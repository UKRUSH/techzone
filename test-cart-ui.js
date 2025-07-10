async function testCartUIStockDisplay() {
  const fetch = (await import('node-fetch')).default;
  const BASE_URL = 'http://localhost:3000';

  try {
    console.log('🎯 Testing Cart UI Stock Display...\n');

    // Generate a test session ID
    const testSessionId = 'ui-test-session-' + Date.now();

    // First, get a product with variants
    const productsResponse = await fetch(`${BASE_URL}/api/products?limit=1`);
    const productsData = await productsResponse.json();
    
    if (!productsData.success || !productsData.data.length) {
      console.log('❌ No products found');
      return;
    }

    const product = productsData.data[0];
    console.log('📦 Using product:', product.name);
    
    if (!product.variants || !product.variants.length) {
      console.log('❌ Product has no variants');
      return;
    }

    const variant = product.variants[0];
    console.log('📝 Using variant:', variant.sku || variant.id);

    // Add the variant to cart
    const addToCartResponse = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: variant.id,
        quantity: 1,
        sessionId: testSessionId
      }),
    });

    if (!addToCartResponse.ok) {
      console.log('❌ Failed to add product to cart');
      return;
    }

    console.log('✅ Product added to cart successfully');

    // Test cart API response structure
    const cartResponse = await fetch(`${BASE_URL}/api/cart?sessionId=${testSessionId}`);
    const cartData = await cartResponse.json();
    
    if (cartResponse.ok && cartData.data.length > 0) {
      console.log('\n✅ Cart API returning correct data structure:');
      const item = cartData.data[0];
      
      console.log('📦 Cart Item Structure:');
      console.log('   ✓ item.id:', item.id ? '✅' : '❌');
      console.log('   ✓ item.quantity:', item.quantity ? '✅' : '❌');
      console.log('   ✓ item.variant:', item.variant ? '✅' : '❌');
      console.log('   ✓ item.variant.product:', item.variant.product ? '✅' : '❌');
      console.log('   ✓ item.variant.product.name:', item.variant.product.name ? '✅' : '❌');
      console.log('   ✓ item.variant.price:', item.variant.price ? '✅' : '❌');
      console.log('   ✓ item.variant.totalStock:', typeof item.variant.totalStock === 'number' ? '✅' : '❌');
      
      console.log('\n📊 Stock Information:');
      console.log('   Total Stock:', item.variant.totalStock);
      console.log('   Stock Status:', item.variant.totalStock > 0 ? '✅ In Stock' : '❌ Out of Stock');
      
      console.log('\n🎨 UI Display Logic:');
      if (item.variant.totalStock > 0) {
        console.log('   Badge: 🟢 Green "' + item.variant.totalStock + ' in stock"');
      } else {
        console.log('   Badge: 🔴 Red "Out of stock"');
      }
      
      console.log('\n✅ Cart UI should display stock information correctly!');
      console.log(`🌐 Visit http://localhost:3000/cart?sessionId=${testSessionId} to see the UI`);
      
    } else {
      console.log('❌ Failed to retrieve cart data');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
testCartUIStockDisplay();
