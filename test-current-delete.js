// Test the current DELETE API to make sure it's still working
const testCurrentDelete = async () => {
  // Let's try to delete the "bbbbb" product
  const testProductId = '686a75bfbea64c97f704c1c9'; // bbbbb product ID
  
  try {
    console.log('🧪 Testing current DELETE API for product:', testProductId);
    
    const response = await fetch(`http://localhost:3000/api/products?id=${testProductId}`, {
      method: 'DELETE',
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));
    
    const responseText = await response.text();
    console.log('Response text length:', responseText.length);
    console.log('Response text:', responseText);
    
    if (responseText) {
      try {
        const result = JSON.parse(responseText);
        console.log('Parsed result:', result);
        console.log('Success:', result.success);
        console.log('Data:', result.data);
        console.log('Message:', result.message);
      } catch (parseError) {
        console.log('Failed to parse JSON:', parseError.message);
      }
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  }
};

testCurrentDelete();
