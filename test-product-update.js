// Test the products API PUT endpoint
const testProductUpdate = async () => {
  try {
    console.log('🧪 Testing product update API...');
    
    // First, get a product to update
    const getResponse = await fetch('/api/products', {
      method: 'GET'
    });
    
    if (!getResponse.ok) {
      console.error('❌ Failed to fetch products');
      return;
    }
    
    const productsData = await getResponse.json();
    const products = productsData.data || [];
    
    if (products.length === 0) {
      console.log('ℹ️ No products found to test update');
      return;
    }
    
    const testProduct = products[0];
    console.log('🔍 Testing with product:', testProduct.name);
    
    // Test update with valid data
    const updateResponse = await fetch('/api/products', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: testProduct.id,
        name: testProduct.name + ' (Updated)',
        description: 'Test description update',
        price: 99.99,
        category: testProduct.category?.name || 'Electronics',
        brand: testProduct.brand?.name || 'Test Brand'
      })
    });
    
    console.log('📊 Update response status:', updateResponse.status);
    console.log('📊 Update response ok:', updateResponse.ok);
    
    const responseText = await updateResponse.text();
    console.log('📄 Response text:', responseText);
    
    if (responseText) {
      try {
        const result = JSON.parse(responseText);
        console.log('✅ Update result:', result);
      } catch (error) {
        console.error('❌ Failed to parse response:', error);
      }
    }
    
  } catch (error) {
    console.error('💥 Test error:', error);
  }
};

// Run the test
testProductUpdate();
