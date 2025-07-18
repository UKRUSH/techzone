// Test registration API
async function testRegistration() {
  try {
    const response = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'test@example.com',
        password: 'testpass123'
      })
    });

    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Registration successful:', data);
    } else {
      console.log('❌ Registration failed:', data);
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Run the test
testRegistration();
