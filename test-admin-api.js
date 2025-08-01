// Test the admin products API endpoint
async function testAdminProductsAPI() {
  console.log('🧪 Testing Admin Products API');
  console.log('=' .repeat(50));

  try {
    // Test the GET endpoint
    console.log('\n📡 Testing GET /api/products...');
    const response = await fetch('http://localhost:3001/api/products?_t=' + Date.now());
    
    if (!response.ok) {
      console.log(`❌ API request failed: ${response.status} ${response.statusText}`);
      return;
    }

    const result = await response.json();
    console.log(`📊 API Response success: ${result.success}`);
    console.log(`📦 Products count: ${result.data?.length || 0}`);

    if (result.data && result.data.length > 0) {
      const firstProduct = result.data[0];
      console.log(`\n🔍 First product: ${firstProduct.name}`);
      console.log(`📊 Variants: ${firstProduct.variants?.length || 0}`);
      
      if (firstProduct.variants && firstProduct.variants.length > 0) {
        const firstVariant = firstProduct.variants[0];
        console.log(`📦 First variant ID: ${firstVariant.id}`);
        console.log(`💰 Price: $${firstVariant.price}`);
        console.log(`📊 Inventory levels: ${firstVariant.inventoryLevels?.length || 0}`);
        
        if (firstVariant.inventoryLevels && firstVariant.inventoryLevels.length > 0) {
          const inventory = firstVariant.inventoryLevels[0];
          console.log(`📦 Stock: ${inventory.stock}`);
          console.log(`🔒 Reserved: ${inventory.reserved}`);
          console.log(`✅ Available: ${inventory.stock - inventory.reserved}`);
          
          // Test admin data extraction
          const adminStock = firstProduct.variants?.[0]?.inventoryLevels?.[0]?.stock || 0;
          console.log(`\n🔧 Admin reads stock as: ${adminStock}`);
          
          if (adminStock === inventory.stock) {
            console.log('✅ Admin stock reading is CORRECT');
          } else {
            console.log('❌ Admin stock reading is INCORRECT');
          }
        } else {
          console.log('❌ No inventory levels found for first variant');
        }
      } else {
        console.log('❌ No variants found for first product');
      }
    } else {
      console.log('❌ No products found in API response');
    }

  } catch (error) {
    console.error('❌ Error testing API:', error);
  }
}

// Run the test
if (typeof window !== 'undefined') {
  // Browser environment
  testAdminProductsAPI();
} else {
  // Node.js environment
  const fetch = require('node-fetch');
  testAdminProductsAPI();
}
