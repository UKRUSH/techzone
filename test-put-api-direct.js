// Test the PUT API directly with correct data
const testProductUpdate = async () => {
  try {
    console.log('🧪 Testing PUT API for product update...');
    
    const testData = {
      id: '686a82efbea64c97f704c1d1', // Sample product ID from database
      name: 'LS300 Updated via API Test',
      description: 'This product has been updated via direct API test',
      category: 'CPU', // Using category name (should work)
      brand: 'AMD',    // Using brand name (should work)
      price: 299.99,
      stock: 15
    };
    
    console.log('📤 Sending update data:', testData);
    
    const response = await fetch('http://localhost:3001/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    console.log('📨 Response status:', response.status);
    console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
    
    if (response.ok) {
      const result = await response.json();
      console.log('✅ Success response:', result);
    } else {
      const responseText = await response.text();
      console.log('❌ Error response text:', responseText);
      
      try {
        const errorData = JSON.parse(responseText);
        console.log('❌ Error response JSON:', errorData);
      } catch (parseError) {
        console.log('❌ Could not parse error as JSON');
      }
    }
    
  } catch (error) {
    console.error('💥 Network error:', error);
  }
};

testProductUpdate();
