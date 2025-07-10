async function addProductToCart() {
  const fetch = (await import('node-fetch')).default;
  const BASE_URL = 'http://localhost:3000';

  try {
    console.log('🛒 Adding product to cart for testing...\n');

    // First, get a product with variants
    const productsResponse = await fetch(`${BASE_URL}/api/products?limit=1`);
    const productsData = await productsResponse.json();
    
    if (!productsData.success || !productsData.data.length) {
      console.log('❌ No products found');
      return;
    }

    const product = productsData.data[0];
    console.log('📦 Found product:', product.name);
    
    if (!product.variants || !product.variants.length) {
      console.log('❌ Product has no variants');
      return;
    }

    const variant = product.variants[0];
    console.log('📝 Using variant:', variant.sku || variant.id);

    // Generate a test session ID
    const testSessionId = 'test-session-' + Date.now();

    // Add the variant to cart
    const addToCartResponse = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: variant.id,
        quantity: 2,
        sessionId: testSessionId
      }),
    });

    const addToCartResult = await addToCartResponse.json();
    
    if (addToCartResponse.ok) {
      console.log('✅ Product added to cart successfully');
      console.log('   Variant ID:', variant.id);
      console.log('   Quantity:', 2);
    } else {
      console.log('❌ Failed to add to cart:', addToCartResult.error);
    }

    // Now fetch the cart to see the stock information
    console.log('\n🔍 Fetching cart to check stock display...');
    
    const cartResponse = await fetch(`${BASE_URL}/api/cart?sessionId=${testSessionId}`);
    const cartData = await cartResponse.json();
    
    if (cartResponse.ok && cartData.data.length > 0) {
      console.log('✅ Cart retrieved successfully');
      cartData.data.forEach((item, index) => {
        console.log(`\n📦 Cart Item ${index + 1}:`);
        console.log('   Product:', item.variant.product.name);
        console.log('   Price:', item.variant.price);
        console.log('   Quantity:', item.quantity);
        console.log('   Total Stock:', item.variant.totalStock || 'Not available');
        console.log('   Stock Status:', item.variant.totalStock > 0 ? '✅ In Stock' : '❌ Out of Stock');
      });
    } else {
      console.log('❌ Failed to retrieve cart or cart is empty');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Run the test
addProductToCart();
