// Test cart functionality directly
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCartFlow() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('🧪 Testing Complete Cart Flow\n');

    // Step 1: Get available products
    console.log('📦 Step 1: Getting products...');
    const productsResponse = await fetch(`${baseUrl}/api/products?limit=1`);
    const productsData = await productsResponse.json();
    
    if (!productsData.success || productsData.data.length === 0) {
      console.log('❌ No products found');
      return;
    }

    const product = productsData.data[0];
    const variant = product.variants[0];
    
    console.log(`✅ Using product: ${product.name}`);
    console.log(`   Variant ID: ${variant.id}`);
    console.log(`   Stock: ${product.totalStock}`);

    // Generate a test session ID
    const sessionId = 'test-' + Date.now();
    console.log(`🔧 Using session ID: ${sessionId}`);

    // Step 2: Add item to cart
    console.log('\n🛒 Step 2: Adding item to cart...');
    const addResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: variant.id,
        quantity: 1,
        sessionId: sessionId
      }),
    });

    const addResult = await addResponse.json();
    console.log(`   Add Result: ${addResult.success ? '✅ Success' : '❌ Failed'}`);
    if (addResult.error) console.log(`   Error: ${addResult.error}`);
    console.log(`   Response:`, JSON.stringify(addResult, null, 2));

    // Step 3: Get cart contents
    console.log('\n📋 Step 3: Getting cart contents...');
    const cartResponse = await fetch(`${baseUrl}/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
    const cartResult = await cartResponse.json();
    
    console.log(`   Cart fetch: ${cartResult.success ? '✅ Success' : '❌ Failed'}`);
    console.log(`   Items in cart: ${cartResult.data ? cartResult.data.length : 0}`);
    console.log(`   Cart data:`, JSON.stringify(cartResult, null, 2));

    if (cartResult.data && cartResult.data.length > 0) {
      console.log('\n📝 Cart Items Details:');
      cartResult.data.forEach((item, index) => {
        console.log(`   ${index + 1}. ${item.variant?.product?.name || 'Unknown Product'}`);
        console.log(`      Quantity: ${item.quantity}`);
        console.log(`      Price: $${item.variant?.price || 'N/A'}`);
        console.log(`      Item ID: ${item.id}`);
      });
    }

    // Step 4: Test cart page access
    console.log('\n🌐 Step 4: Testing cart page access...');
    const cartPageResponse = await fetch(`${baseUrl}/cart?sessionId=${encodeURIComponent(sessionId)}`);
    console.log(`   Cart page status: ${cartPageResponse.status}`);
    console.log(`   Cart page accessible: ${cartPageResponse.ok ? '✅ Yes' : '❌ No'}`);

    console.log('\n✅ Cart flow test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCartFlow();
