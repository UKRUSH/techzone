async function testOrdersAPI() {
  try {
    console.log('Testing orders API directly...');
    
    const response = await fetch('http://localhost:3001/api/user/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response statusText:', response.statusText);
    
    const data = await response.text();
    console.log('Response body:', data);
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testOrdersAPI();
