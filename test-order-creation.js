// Test order creation
const base_url = 'http://localhost:3000';

async function testOrderCreation() {
  console.log('🛒 Testing Order Creation');
  console.log('========================');

  const testOrderData = {
    userId: null,
    customerInfo: {
      name: "Test User",
      email: "test@example.com",
      phone: "071 123 4567"
    },
    shippingAddress: {
      address: "123 Test Street",
      address2: "Apt 1",
      city: "Colombo",
      district: "Colombo",
      postalCode: "10100",
      country: "Sri Lanka"
    },
    paymentMethod: "credit_card",
    paymentDetails: {
      nameOnCard: "Test User",
      cardLast4: "1234"
    },
    items: [
      {
        id: "test-item-1",
        quantity: 1,
        variant: {
          id: null, // Use null for fallback testing
          price: 409.99,
          product: {
            id: null, // Use null for fallback testing
            name: "Intel Core i7-13700K"
          }
        }
      }
    ],
    subtotal: 409.99,
    tax: 73.80,
    shipping: 0,
    total: 483.79,
    status: "pending",
    orderDate: new Date().toISOString()
  };

  try {
    const response = await fetch(`${base_url}/api/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testOrderData)
    });

    const result = await response.json();
    
    if (response.ok) {
      console.log('✅ Order created successfully!');
      console.log('   Order ID:', result.data.id);
      console.log('   Customer:', result.data.customerName);
      console.log('   Email:', result.data.customerEmail);
      console.log('   Total: Rs.', result.data.total);
      console.log('   Status:', result.data.status);
    } else {
      console.log('❌ Order creation failed:');
      console.log('   Error:', result.error);
      console.log('   Status:', response.status);
    }
  } catch (error) {
    console.log('❌ Request failed:', error.message);
  }
}

testOrderCreation().catch(console.error);
