// Test cart display after adding item
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCartDisplay() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('🧪 Testing Cart Display After Adding Item\n');

    // Step 1: Get a product
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

    // Generate a test session ID
    const sessionId = 'ui-test-' + Date.now();
    console.log(`🔧 Using session ID: ${sessionId}`);

    // Step 2: Add multiple items to cart
    console.log('\n🛒 Adding 3 items to cart...');
    
    for (let i = 1; i <= 3; i++) {
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
      console.log(`   Item ${i}: ${addResult.success ? '✅ Added' : '❌ Failed'}`);
      if (addResult.error) console.log(`     Error: ${addResult.error}`);
    }

    // Step 3: Verify cart contents match what frontend should see
    console.log('\n📋 Verifying final cart state...');
    const cartResponse = await fetch(`${baseUrl}/api/cart?sessionId=${encodeURIComponent(sessionId)}`);
    const cartResult = await cartResponse.json();
    
    console.log(`Cart API response structure:`);
    console.log(`  - success: ${cartResult.success}`);
    console.log(`  - data type: ${Array.isArray(cartResult.data) ? 'Array' : typeof cartResult.data}`);
    console.log(`  - items count: ${cartResult.data ? cartResult.data.length : 0}`);
    
    if (cartResult.data && cartResult.data.length > 0) {
      console.log(`\n📝 Cart items that frontend should display:`);
      cartResult.data.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.variant?.product?.name || 'Unknown'}`);
        console.log(`     Quantity: ${item.quantity}`);
        console.log(`     Price: $${item.variant?.price || 'N/A'}`);
        console.log(`     Has variant data: ${!!item.variant}`);
        console.log(`     Has product data: ${!!item.variant?.product}`);
      });
      
      // Calculate totals like the frontend would
      const totalItems = cartResult.data.reduce((sum, item) => sum + item.quantity, 0);
      const totalPrice = cartResult.data.reduce((sum, item) => {
        return sum + (item.variant?.price || 0) * item.quantity;
      }, 0);
      
      console.log(`\n💰 Cart totals:`);
      console.log(`  - Total items: ${totalItems}`);
      console.log(`  - Total price: $${totalPrice.toFixed(2)}`);
    } else {
      console.log(`❌ No items in cart - this is why the cart page appears empty!`);
    }

    console.log(`\n🌐 To test in browser, visit:`);
    console.log(`   ${baseUrl}/cart?sessionId=${encodeURIComponent(sessionId)}`);

    console.log('\n✅ Cart display test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCartDisplay();
