// Test registration API with phone number
async function testRegistrationWithPhone() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User With Phone',
        email: 'testwithphone@example.com',
        phone: '+1-555-123-4567',
        password: 'testpass123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration with phone successful:', data);
    } else {
      console.log('❌ Registration failed:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testRegistrationWithPhone();
