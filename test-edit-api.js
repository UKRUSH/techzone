// Test the PUT API directly
const testEdit = async () => {
  const testProductId = '686a769ebea64c97f704c1cb'; // Image Test CPU product ID
  
  const updateData = {
    id: testProductId,
    name: 'Updated Test CPU',
    description: 'This CPU has been updated via API test',
    price: 799,
    category: 'CPU',
    brand: 'Intel',
    stock: 20,
    imageUrl: 'https://picsum.photos/500/400'
  };
  
  try {
    console.log('🧪 Testing PUT API for product:', testProductId);
    console.log('🧪 Update data:', updateData);
    
    const response = await fetch(`http://localhost:3000/api/products`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData)
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (responseText) {
      try {
        const result = JSON.parse(responseText);
        console.log('Parsed result:', result);
      } catch (parseError) {
        console.log('Failed to parse JSON:', parseError.message);
      }
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  }
};

testEdit();
