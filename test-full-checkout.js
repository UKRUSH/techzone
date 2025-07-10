// Test full checkout flow
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

async function testFullCheckoutFlow() {
  console.log('🛒 Testing Full Checkout Flow');
  console.log('=============================');

  const sessionId = 'checkout-test-session';

  // Step 1: Add item to cart
  console.log('1️⃣ Adding item to cart...');
  const addResult = await makeRequest(`${base_url}/api/cart`, {
    method: 'POST',
    body: JSON.stringify({
      variantId: '1', // This will use fallback data
      quantity: 2,
      sessionId: sessionId
    })
  });

  if (!addResult.success) {
    console.log('❌ Failed to add item:', addResult.error || addResult.data?.error);
    return;
  }

  console.log('✅ Item added to cart');
  console.log('   Product:', addResult.data.data.variant.product.name);
  console.log('   Price: $' + addResult.data.data.variant.price);
  console.log('   Quantity:', addResult.data.data.quantity);

  // Step 2: Get cart contents
  console.log('\\n2️⃣ Getting cart contents...');
  const cartResult = await makeRequest(`${base_url}/api/cart?sessionId=${sessionId}`);
  
  if (!cartResult.success) {
    console.log('❌ Failed to get cart');
    return;
  }

  console.log('✅ Cart retrieved successfully');
  console.log('   Items in cart:', cartResult.data.data.length);
  
  const cartItems = cartResult.data.data;
  const subtotal = cartItems.reduce((sum, item) => sum + (item.variant.price * item.quantity), 0);
  const tax = subtotal * 0.18; // 18% tax
  const shipping = 0;
  const total = subtotal + tax + shipping;

  console.log('   Subtotal: $' + subtotal.toFixed(2));
  console.log('   Tax: $' + tax.toFixed(2));
  console.log('   Total: $' + total.toFixed(2));

  // Step 3: Create order
  console.log('\\n3️⃣ Creating order...');
  const orderData = {
    userId: null,
    customerInfo: {
      name: "John Doe",
      email: "john@example.com",
      phone: "071 123 4567"
    },
    shippingAddress: {
      address: "123 Main Street",
      address2: "Apt 1",
      city: "Colombo",
      district: "Colombo",
      postalCode: "10100",
      country: "Sri Lanka"
    },
    paymentMethod: "credit_card",
    paymentDetails: {
      nameOnCard: "John Doe",
      cardLast4: "1234"
    },
    items: cartItems,
    subtotal: subtotal,
    tax: tax,
    shipping: shipping,
    total: total,
    status: "pending",
    orderDate: new Date().toISOString()
  };

  const orderResult = await makeRequest(`${base_url}/api/orders`, {
    method: 'POST',
    body: JSON.stringify(orderData)
  });

  if (!orderResult.success) {
    console.log('❌ Order creation failed:');
    console.log('   Error:', orderResult.error || orderResult.data?.error);
    return;
  }

  console.log('✅ Order created successfully!');
  console.log('   Order ID:', orderResult.data.data.id);
  console.log('   Confirmation:', orderResult.data.data.confirmationNumber);
  console.log('   Customer:', orderResult.data.data.customerName);
  console.log('   Email:', orderResult.data.data.customerEmail);
  console.log('   Total: Rs.', orderResult.data.data.total);
  console.log('   Status:', orderResult.data.data.status);

  // Step 4: Clear cart after successful order
  console.log('\\n4️⃣ Clearing cart...');
  const clearResult = await makeRequest(`${base_url}/api/cart?clearAll=true&sessionId=${sessionId}`, {
    method: 'DELETE'
  });

  if (clearResult.success) {
    console.log('✅ Cart cleared successfully');
  } else {
    console.log('❌ Failed to clear cart');
  }

  console.log('\\n🎉 Full checkout flow completed successfully!');
  console.log('   The payment page error should now be resolved.');
}

testFullCheckoutFlow().catch(console.error);
