// Test the DELETE API directly
const testDelete = async () => {
  const testProductId = '686a76e4bea64c97f704c1cd'; // bbbb product ID
  
  try {
    console.log('🧪 Testing DELETE API for product:', testProductId);
    
    const response = await fetch(`http://localhost:3000/api/products?id=${testProductId}`, {
      method: 'DELETE',
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    console.log('Response headers:', [...response.headers.entries()]);
    
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

testDelete();
