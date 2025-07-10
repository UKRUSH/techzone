async function testCompleteWorkflow() {
  const fetch = (await import('node-fetch')).default;
  const BASE_URL = 'http://localhost:3000';

  try {
    console.log('🧪 Testing Complete Cart Workflow...\n');

    const testSessionId = 'complete-test-' + Date.now();
    console.log('🆔 SessionId:', testSessionId);

    // Step 1: Add item
    console.log('\n1️⃣ Adding item to cart...');
    const productsResponse = await fetch(`${BASE_URL}/api/products?limit=1`);
    const productsData = await productsResponse.json();
    const product = productsData.data[0];
    const variant = product.variants[0];

    const addResponse = await fetch(`${BASE_URL}/api/cart`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        variantId: variant.id,
        quantity: 1,
        sessionId: testSessionId
      })
    });

    const addResult = await addResponse.json();
    const itemId = addResult.data.id;
    console.log('✅ Item added - ID:', itemId);

    // Step 2: Fetch cart (what UI does on load)
    console.log('\n2️⃣ Fetching cart (UI load simulation)...');
    const fetchResponse = await fetch(`${BASE_URL}/api/cart?sessionId=${testSessionId}`);
    const fetchResult = await fetchResponse.json();
    console.log('✅ Cart fetched - Items count:', fetchResult.data.length);
    console.log('   Item details:', fetchResult.data.map(item => ({
      id: item.id,
      quantity: item.quantity,
      name: item.variant.product.name
    })));

    // Step 3: Update item (what + button does)
    console.log('\n3️⃣ Updating item quantity (+ button simulation)...');
    const updateResponse = await fetch(`${BASE_URL}/api/cart`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: itemId,
        quantity: 2,
        sessionId: testSessionId
      })
    });

    if (updateResponse.ok) {
      const updateResult = await updateResponse.json();
      console.log('✅ Item updated successfully');
      console.log('   New quantity:', updateResult.data.quantity);
    } else {
      const error = await updateResponse.text();
      console.log('❌ Update failed:', error);
    }

    // Step 4: Final verification
    console.log('\n4️⃣ Final verification...');
    const finalResponse = await fetch(`${BASE_URL}/api/cart?sessionId=${testSessionId}`);
    const finalResult = await finalResponse.json();
    console.log('✅ Final cart state:', finalResult.data.map(item => ({
      id: item.id,
      quantity: item.quantity,
      name: item.variant.product.name
    })));

    console.log('\n🌐 Test the UI at:');
    console.log(`   http://localhost:3000/cart?sessionId=${testSessionId}`);
    console.log('\n💡 The + and - buttons should now work correctly!');

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCompleteWorkflow();
