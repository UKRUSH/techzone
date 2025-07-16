const testCart = async () => {
  try {
    console.log('🧪 Testing cart API...');
    
    // Test adding an item to cart
    const testVariantId = "test-variant-123";
    const response = await fetch('http://localhost:3001/api/cart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: testVariantId,
        quantity: 1,
        sessionId: 'test-session-' + Date.now()
      }),
    });

    console.log('Response status:', response.status);
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success:', result);
    } else {
      const error = await response.json();
      console.log('❌ Error:', error);
    }
    
  } catch (error) {
    console.error('🚨 Network error:', error);
  }
};

// For manual testing
if (typeof window !== 'undefined') {
  window.testCart = testCart;
  console.log('Cart test function available as window.testCart()');
}
