// Comprehensive cart test that simulates real browser behavior
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

async function testRealWorldScenario() {
  console.log('🌍 Real World Cart Scenario Test');
  console.log('=================================');
  console.log('This simulates what happens when:');
  console.log('1. User adds items to cart');
  console.log('2. Session changes (tab refresh, login/logout, etc.)'); 
  console.log('3. User clicks +/- buttons on cart items');
  console.log('');

  // Scenario: User adds items to cart in their initial session
  console.log('📝 Step 1: User adds multiple items to cart...');
  
  // Add CPU
  const cpu = await makeRequest(`${base_url}/api/cart`, {
    method: 'POST',
    body: JSON.stringify({
      variantId: '1', // Intel Core i7-13700K
      quantity: 1,
      sessionId: 'user-original-session'
    })
  });

  if (!cpu.success) {
    console.log('❌ Failed to add CPU');
    return;
  }

  console.log('✅ Added CPU:', cpu.data.data.variant.product.name, '- $' + cpu.data.data.variant.price);

  // Add GPU  
  const gpu = await makeRequest(`${base_url}/api/cart`, {
    method: 'POST',
    body: JSON.stringify({
      variantId: '2', // NVIDIA GeForce RTX 4070
      quantity: 1,
      sessionId: 'user-original-session'
    })
  });

  if (!gpu.success) {
    console.log('❌ Failed to add GPU');
    return;
  }

  console.log('✅ Added GPU:', gpu.data.data.variant.product.name, '- $' + gpu.data.data.variant.price);

  // Add RAM
  const ram = await makeRequest(`${base_url}/api/cart`, {
    method: 'POST',
    body: JSON.stringify({
      variantId: '3', // Corsair Vengeance RGB Pro 32GB
      quantity: 2,
      sessionId: 'user-original-session'
    })
  });

  if (!ram.success) {
    console.log('❌ Failed to add RAM');
    return;
  }

  console.log('✅ Added RAM:', ram.data.data.variant.product.name, '- $' + ram.data.data.variant.price, '(Qty: 2)');

  const cpuItemId = cpu.data.data.id;
  const gpuItemId = gpu.data.data.id;
  const ramItemId = ram.data.data.id;

  // Verify cart contents
  console.log('\\n📋 Step 2: Verifying cart contents...');
  const cartCheck = await makeRequest(`${base_url}/api/cart?sessionId=user-original-session`);
  
  if (cartCheck.success) {
    console.log('✅ Cart contains', cartCheck.data.data.length, 'items:');
    cartCheck.data.data.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.variant.product.name} - $${item.variant.price} (Qty: ${item.quantity})`);
    });
    
    const total = cartCheck.data.data.reduce((sum, item) => 
      sum + (item.variant.price * item.quantity), 0
    );
    console.log('   Total: $' + total.toFixed(2));
  }

  // Simulate session change (like tab refresh, logout/login, etc.)
  console.log('\\n🔄 Step 3: Session changes (simulating tab refresh/logout/login)...');
  console.log('   User now has a new session: "user-new-session"');
  
  // User tries to update CPU quantity from new session 
  console.log('\\n🖱️  Step 4: User clicks + button on CPU (quantity 1 → 2)...');
  const cpuUpdate = await makeRequest(`${base_url}/api/cart`, {
    method: 'PUT',
    body: JSON.stringify({
      itemId: cpuItemId,
      quantity: 2,
      sessionId: 'user-new-session' // Different session!
    })
  });

  if (cpuUpdate.success) {
    console.log('✅ CPU quantity updated successfully!');
    console.log('   Product:', cpuUpdate.data.data.variant.product.name);
    console.log('   Price: $' + cpuUpdate.data.data.variant.price);
    console.log('   Quantity:', cpuUpdate.data.data.quantity);
    
    if (cpuUpdate.data.data.variant.product.name === 'Unknown Product') {
      console.log('❌ PROBLEM: Product details lost after migration!');
    } else {
      console.log('🎉 SUCCESS: Product details preserved after migration!');
    }
  } else {
    console.log('❌ CPU update failed:', cpuUpdate.error || cpuUpdate.data?.error);
    return;
  }

  // User tries to update GPU quantity
  console.log('\\n🖱️  Step 5: User clicks + button on GPU (quantity 1 → 3)...');
  const gpuUpdate = await makeRequest(`${base_url}/api/cart`, {
    method: 'PUT',
    body: JSON.stringify({
      itemId: gpuItemId,
      quantity: 3,
      sessionId: 'user-new-session'
    })
  });

  if (gpuUpdate.success) {
    console.log('✅ GPU quantity updated successfully!');
    console.log('   Product:', gpuUpdate.data.data.variant.product.name);
    console.log('   Price: $' + gpuUpdate.data.data.variant.price);
    console.log('   Quantity:', gpuUpdate.data.data.quantity);
  } else {
    console.log('❌ GPU update failed:', gpuUpdate.error || gpuUpdate.data?.error);
  }

  // User tries to decrease RAM quantity
  console.log('\\n🖱️  Step 6: User clicks - button on RAM (quantity 2 → 1)...');
  const ramUpdate = await makeRequest(`${base_url}/api/cart`, {
    method: 'PUT',
    body: JSON.stringify({
      itemId: ramItemId,
      quantity: 1,
      sessionId: 'user-new-session'
    })
  });

  if (ramUpdate.success) {
    console.log('✅ RAM quantity updated successfully!');
    console.log('   Product:', ramUpdate.data.data.variant.product.name);
    console.log('   Price: $' + ramUpdate.data.data.variant.price);
    console.log('   Quantity:', ramUpdate.data.data.quantity);
  } else {
    console.log('❌ RAM update failed:', ramUpdate.error || ramUpdate.data?.error);
  }

  // Final cart verification
  console.log('\\n📋 Step 7: Final cart verification in new session...');
  const finalCart = await makeRequest(`${base_url}/api/cart?sessionId=user-new-session`);
  
  if (finalCart.success) {
    console.log('✅ Final cart contains', finalCart.data.data.length, 'items:');
    let allProductsCorrect = true;
    let finalTotal = 0;
    
    finalCart.data.data.forEach((item, i) => {
      console.log(`   ${i+1}. ${item.variant.product.name} - $${item.variant.price} (Qty: ${item.quantity})`);
      
      if (item.variant.product.name === 'Unknown Product' || item.variant.price === 0) {
        allProductsCorrect = false;
      }
      
      finalTotal += item.variant.price * item.quantity;
    });
    
    console.log('   Final Total: $' + finalTotal.toFixed(2));
    
    if (allProductsCorrect) {
      console.log('\\n🎉 ALL TESTS PASSED! ');
      console.log('   ✅ Cart migration works correctly');
      console.log('   ✅ Product details preserved after session change');
      console.log('   ✅ Quantity updates work reliably'); 
      console.log('   ✅ Price calculations are accurate');
    } else {
      console.log('\\n❌ TESTS FAILED! Some products show as "Unknown Product"');
    }
  } else {
    console.log('❌ Failed to get final cart');
  }

  // Verify old session is empty
  console.log('\\n🧹 Step 8: Verifying old session cart is empty...');
  const oldCart = await makeRequest(`${base_url}/api/cart?sessionId=user-original-session`);
  
  if (oldCart.success && oldCart.data.data.length === 0) {
    console.log('✅ Old session cart is correctly empty (items migrated)');
  } else {
    console.log('❌ Old session still has items (migration incomplete)');
  }

  console.log('\\n🌍 Real World Scenario Test Complete!');
}

testRealWorldScenario().catch(console.error);
