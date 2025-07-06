// Test product creation API directly
async function testProductCreation() {
  console.log('🧪 Testing Product Creation API...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  const testProduct = {
    name: "Test Product",
    description: "A test product for validation",
    categoryId: "gpu",
    brandId: "nvidia",
    variants: [{
      sku: "TEST-001",
      price: 100,
      compareAtPrice: null,
      attributes: {}
    }]
  };
  
  try {
    console.log('📦 Creating test product...');
    const response = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testProduct),
    });
    
    const result = await response.json();
    
    if (response.ok && result.success) {
      console.log('✅ Product creation successful!');
      console.log(`   Product ID: ${result.data.id}`);
      console.log(`   Product Name: ${result.data.name}`);
      console.log(`   Category: ${result.data.category?.name || 'N/A'}`);
      console.log(`   Brand: ${result.data.brand?.name || 'N/A'}`);
      console.log(`   Variants: ${result.data.variants?.length || 0}`);
      
      if (result.data.variants && result.data.variants.length > 0) {
        console.log(`   SKU: ${result.data.variants[0].sku}`);
        console.log(`   Price: $${result.data.variants[0].price}`);
      }
      
      console.log('\n🎉 SUCCESS: Product creation is working without status field!');
    } else {
      console.log('❌ Product creation failed:');
      console.log(`   Status: ${response.status}`);
      console.log(`   Error: ${result.error || 'Unknown error'}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testProductCreation();
