// Test the DELETE API with a non-existent product ID
const testDeleteNotFound = async () => {
  const fakeProductId = 'nonexistent123456789012345678901234'; // Fake ID
  
  try {
    console.log('🧪 Testing DELETE API with non-existent product:', fakeProductId);
    
    const response = await fetch(`http://localhost:3000/api/products?id=${fakeProductId}`, {
      method: 'DELETE',
    });
    
    console.log('Response status:', response.status);
    console.log('Response ok:', response.ok);
    
    const responseText = await response.text();
    console.log('Response text:', responseText);
    
    if (responseText) {
      try {
        const result = JSON.parse(responseText);
        console.log('Parsed result:', result);
        console.log('Success:', result.success);
        console.log('Error:', result.error);
        console.log('Code:', result.code);
      } catch (parseError) {
        console.log('Failed to parse JSON:', parseError.message);
      }
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  }
};

testDeleteNotFound();
