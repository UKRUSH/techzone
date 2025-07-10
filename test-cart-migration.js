// Test cart migration and variant data preservation
const base_url = 'http://localhost:3001';

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

async function testCartMigration() {
  console.log('🔄 Testing Cart Migration and Variant Data Preservation');
  console.log('========================================================');

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
  console.log('   Item ID:', itemId);

  // Step 2: Verify item exists in session1
  console.log('\n2️⃣ Verifying item exists in session1...');
  const getResult1 = await makeRequest(`${base_url}/api/cart?sessionId=session1`);
  
  if (getResult1.success && getResult1.data.data.length > 0) {
    console.log('✅ Item found in session1');
    console.log('   Product:', getResult1.data.data[0].variant.product.name);
    console.log('   Price: $' + getResult1.data.data[0].variant.price);
  }

  // Step 3: Try to update item from session2 (should trigger migration)
  console.log('\n3️⃣ Attempting to update item from session2 (triggering migration)...');
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

  // Step 4: Verify item migrated to session2
  console.log('\n4️⃣ Verifying item migrated to session2...');
  const getResult2 = await makeRequest(`${base_url}/api/cart?sessionId=session2`);
  
  if (getResult2.success && getResult2.data.data.length > 0) {
    console.log('✅ Item found in session2');
    console.log('   Product:', getResult2.data.data[0].variant.product.name);
    console.log('   Price: $' + getResult2.data.data[0].variant.price);
    console.log('   Quantity:', getResult2.data.data[0].quantity);
  } else {
    console.log('❌ Item not found in session2');
  }

  // Step 5: Verify item removed from session1
  console.log('\n5️⃣ Verifying item removed from session1...');
  const getResult3 = await makeRequest(`${base_url}/api/cart?sessionId=session1`);
  
  if (getResult3.success && getResult3.data.data.length === 0) {
    console.log('✅ Item correctly removed from session1');
  } else {
    console.log('❌ Item still exists in session1');
  }

  // Step 6: Test another update to ensure product details remain correct
  console.log('\n6️⃣ Testing another update to ensure product details persist...');
  const updateResult2 = await makeRequest(`${base_url}/api/cart`, {
    method: 'PUT',
    body: JSON.stringify({
      itemId: itemId,
      quantity: 5,
      sessionId: 'session2'
    })
  });

  if (updateResult2.success) {
    console.log('✅ Second update successful!');
    console.log('   Product:', updateResult2.data.data.variant.product.name);
    console.log('   Price: $' + updateResult2.data.data.variant.price);
    console.log('   Quantity:', updateResult2.data.data.quantity);
    
    // Check if product details are correct (not "Unknown Product")
    if (updateResult2.data.data.variant.product.name !== 'Unknown Product' && 
        updateResult2.data.data.variant.price > 0) {
      console.log('🎉 SUCCESS: Product details preserved after migration!');
    } else {
      console.log('❌ FAILURE: Product details lost after migration');
      console.log('   Expected: Intel Core i7-13700K, $409.99');
      console.log('   Got:', updateResult2.data.data.variant.product.name + ', $' + updateResult2.data.data.variant.price);
    }
  } else {
    console.log('❌ Second update failed:', updateResult2.error || updateResult2.data?.error);
  }

  console.log('\n🔄 Migration Test Complete!');
}

testCartMigration().catch(console.error);
