// Test the DELETE API with a properly formatted but non-existent product ID
const testDeleteValidButMissing = async () => {
  const fakeButValidId = '507f1f77bcf86cd799439011'; // Valid ObjectID format but doesn't exist
  
  try {
    console.log('🧪 Testing DELETE API with valid but non-existent product:', fakeButValidId);
    
    const response = await fetch(`http://localhost:3000/api/products?id=${fakeButValidId}`, {
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

testDeleteValidButMissing();
