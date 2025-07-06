// Test the clear all products API
const testClearAll = async () => {
  try {
    console.log('🧪 Testing CLEAR ALL products API...');
    
    const response = await fetch('http://localhost:3000/api/products/clear', {
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
        console.log('Deleted products:', result.data?.deletedProducts);
        console.log('Deleted variants:', result.data?.deletedVariants);
        console.log('Message:', result.message);
      } catch (parseError) {
        console.log('Failed to parse JSON:', parseError.message);
      }
    }
    
  } catch (error) {
    console.error('Error in test:', error);
  }
};

// First check how many products we have
const checkFirst = async () => {
  const response = await fetch('http://localhost:3000/api/products');
  const result = await response.json();
  console.log(`Currently have ${result.data?.length || 0} products`);
  
  if (result.data?.length > 0) {
    console.log('Proceeding with clear test...');
    await testClearAll();
  } else {
    console.log('No products to clear');
  }
};

checkFirst();
