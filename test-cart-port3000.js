// Test cart migration on port 3000
const base_url = 'http://localhost:3000';

async function makeRequest(url, options = {}) {
  try {
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    const data = await response.json();
    return { success: response.ok, data, status: response.status };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

async function testCartMigrationPort3000() {
  console.log('🔄 Testing Cart Migration on Port 3000');
  console.log('======================================');

  // Step 1: Add item to session1
  console.log('1️⃣ Adding item to session1...');
  const addResult = await makeRequest(`${base_url}/api/cart`, {
    method: 'POST',
    body: JSON.stringify({
      variantId: '1',
      quantity: 2,
      sessionId: 'session1'
    })
  });

  if (!addResult.success) {
    console.log('❌ Failed to add item:', addResult.error || addResult.data?.error);
    return;
  }

  console.log('✅ Item added to session1');
  console.log('   Product:', addResult.data.data.variant.product.name);
  console.log('   Price: $' + addResult.data.data.variant.price);
  console.log('   Quantity:', addResult.data.data.quantity);

  const itemId = addResult.data.data.id;

  // Step 2: Try to update from different session (trigger migration)
  console.log('\n2️⃣ Updating from session2 (triggering migration)...');
  const updateResult = await makeRequest(`${base_url}/api/cart`, {
    method: 'PUT',
    body: JSON.stringify({
      itemId: itemId,
      quantity: 3,
      sessionId: 'session2'
    })
  });

  if (!updateResult.success) {
    console.log('❌ Update failed:', updateResult.error || updateResult.data?.error);
    return;
  }

  console.log('✅ Update successful via migration!');
  console.log('   Product:', updateResult.data.data.variant.product.name);
  console.log('   Price: $' + updateResult.data.data.variant.price);
  console.log('   Quantity:', updateResult.data.data.quantity);

  // Check if product details are correct
  if (updateResult.data.data.variant.product.name !== 'Unknown Product' && 
      updateResult.data.data.variant.price > 0) {
    console.log('🎉 SUCCESS: Product details preserved after migration!');
    console.log('   ✅ Name: ' + updateResult.data.data.variant.product.name);
    console.log('   ✅ Price: $' + updateResult.data.data.variant.price);
  } else {
    console.log('❌ FAILURE: Product details lost after migration');
  }

  console.log('\n🔄 Migration Test Complete!');
}

testCartMigrationPort3000().catch(console.error);
