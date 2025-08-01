// Test cart operations and stock management
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function testCartAndStock() {
  const baseUrl = 'http://localhost:3001';
  
  try {
    console.log('🧪 Testing Cart Operations with Stock Management\n');

    // First, get products to see stock levels
    console.log('📦 Fetching products...');
    const productsResponse = await fetch(`${baseUrl}/api/products?limit=1`);
    const productsData = await productsResponse.json();
    
    if (!productsData.success || productsData.data.length === 0) {
      console.log('❌ No products found');
      return;
    }

    const product = productsData.data[0];
    const variant = product.variants[0];
    
    console.log(`✅ Testing with: ${product.name}`);
    console.log(`   Variant ID: ${variant.id}`);
    console.log(`   Initial Stock: ${product.totalStock}`);

    // Generate a test session ID
    const sessionId = 'test-session-' + Date.now();
    
    // Step 1: Add item to cart
    console.log('\n🛒 Step 1: Adding item to cart...');
    const addResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: variant.id,
        quantity: 2,
        sessionId: sessionId
      }),
    });

    const addResult = await addResponse.json();
    console.log(`   Result: ${addResult.success ? '✅ Success' : '❌ Failed'}`);
    if (addResult.error) console.log(`   Error: ${addResult.error}`);
    if (addResult.availableStock !== undefined) console.log(`   Available Stock: ${addResult.availableStock}`);

    // Step 2: Check stock after adding to cart
    console.log('\n📊 Step 2: Checking stock after cart addition...');
    const productsResponse2 = await fetch(`${baseUrl}/api/products?limit=1`);
    const productsData2 = await productsResponse2.json();
    const updatedProduct = productsData2.data[0];
    
    console.log(`   Stock after addition: ${updatedProduct.totalStock}`);
    console.log(`   Stock change: ${product.totalStock - updatedProduct.totalStock}`);

    if (!addResult.success) {
      console.log('❌ Cannot continue test as item addition failed');
      return;
    }

    // Step 3: Update cart item quantity
    console.log('\n🔄 Step 3: Updating cart item quantity (2 → 5)...');
    const updateResponse = await fetch(`${baseUrl}/api/cart`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        itemId: addResult.data.id,
        quantity: 5,
        sessionId: sessionId
      }),
    });

    const updateResult = await updateResponse.json();
    console.log(`   Result: ${updateResult.success ? '✅ Success' : '❌ Failed'}`);
    if (updateResult.error) console.log(`   Error: ${updateResult.error}`);

    // Step 4: Check stock after update
    console.log('\n📊 Step 4: Checking stock after quantity update...');
    const productsResponse3 = await fetch(`${baseUrl}/api/products?limit=1`);
    const productsData3 = await productsResponse3.json();
    const updatedProduct2 = productsData3.data[0];
    
    console.log(`   Stock after update: ${updatedProduct2.totalStock}`);
    console.log(`   Stock change from original: ${product.totalStock - updatedProduct2.totalStock}`);

    // Step 5: Remove item from cart
    console.log('\n🗑️ Step 5: Removing item from cart...');
    const removeResponse = await fetch(`${baseUrl}/api/cart?itemId=${addResult.data.id}&sessionId=${sessionId}`, {
      method: 'DELETE',
    });

    const removeResult = await removeResponse.json();
    console.log(`   Result: ${removeResult.success ? '✅ Success' : '❌ Failed'}`);
    if (removeResult.error) console.log(`   Error: ${removeResult.error}`);

    // Step 6: Check final stock
    console.log('\n📊 Step 6: Checking final stock after removal...');
    const productsResponse4 = await fetch(`${baseUrl}/api/products?limit=1`);
    const productsData4 = await productsResponse4.json();
    const finalProduct = productsData4.data[0];
    
    console.log(`   Final stock: ${finalProduct.totalStock}`);
    console.log(`   Stock restored: ${finalProduct.totalStock === product.totalStock ? '✅ Yes' : '❌ No'}`);

    console.log('\n✅ Cart and stock management test completed!');

  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testCartAndStock();
