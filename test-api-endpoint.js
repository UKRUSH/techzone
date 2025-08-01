// Test the API endpoint with curl-like approach
const testAPI = async () => {
  try {
    console.log('🧪 Testing product API endpoint...');
    
    // Wait for server to start
    await new Promise(resolve => setTimeout(resolve, 5000));
    
    // Test with a real HTTP request
    const testUrl = 'http://localhost:3001/api/products';
    
    // Create test data
    const testData = {
      id: '686a82efbea64c97f704c1d1', // LS300 product ID
      name: 'LS300 Updated via API',
      description: 'Updated description',
      price: 299.99,
      category: 'Cases',
      brand: 'Corsair'
    };
    
    console.log('📤 Sending PUT request with data:', testData);
    
    const response = await fetch(testUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📨 Response status:', response.status, response.statusText);
    console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('📄 Response text:', responseText);
    
    if (responseText) {
      try {
        const result = JSON.parse(responseText);
        console.log('✅ Parsed response:', result);
        
        if (result.success) {
          console.log('🎉 API update successful!');
        } else {
          console.log('❌ API returned error:', result.error);
        }
      } catch (parseError) {
        console.error('❌ Failed to parse response as JSON:', parseError);
      }
    }
    
  } catch (error) {
    console.error('💥 Test error:', error);
  }
};

testAPI();
