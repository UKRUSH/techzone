// Test script to verify main site is working
async function testMainSite() {
  console.log('🧪 Testing Main Site...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test homepage
    console.log('🏠 Testing Homepage...');
    const startTime = Date.now();
    const response = await fetch(`${baseUrl}/`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    if (response.ok) {
      const content = await response.text();
      const hasContent = content.includes('TechZone') || content.includes('html');
      
      console.log(`✅ Homepage: ${response.status} - ${loadTime}ms`);
      console.log(`   Content Check: ${hasContent ? '✅ Valid' : '❌ Invalid'}`);
    } else {
      console.log(`❌ Homepage: ${response.status} - Failed`);
    }
    
    // Test products API
    console.log('\n📦 Testing Products API...');
    const apiStartTime = Date.now();
    const apiResponse = await fetch(`${baseUrl}/api/products/fallback`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    const apiEndTime = Date.now();
    const apiLoadTime = apiEndTime - apiStartTime;
    
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log(`✅ Products API: ${apiResponse.status} - ${apiLoadTime}ms`);
      console.log(`   Has Products: ${data.success && data.data?.length > 0 ? '✅ Yes' : '❌ No'}`);
    } else {
      console.log(`❌ Products API: ${apiResponse.status} - Failed`);
    }
    
    // Test product creation API
    console.log('\n🔨 Testing Product Creation API...');
    const createStartTime = Date.now();
    const createResponse = await fetch(`${baseUrl}/api/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name: "Test Product " + Date.now(),
        description: "A test product",
        categoryId: "gpu",
        brandId: "nvidia",
        variants: [{
          sku: "TEST-001",
          price: 100,
          stock: 10
        }]
      })
    });
    const createEndTime = Date.now();
    const createLoadTime = createEndTime - createStartTime;
    
    if (createResponse.ok) {
      const createData = await createResponse.json();
      console.log(`✅ Product Creation: ${createResponse.status} - ${createLoadTime}ms`);
      console.log(`   Success: ${createData.success ? '✅ Yes' : '❌ No'}`);
      console.log(`   Product ID: ${createData.data?.id || 'N/A'}`);
    } else {
      console.log(`❌ Product Creation: ${createResponse.status} - Failed`);
      const errorData = await createResponse.text();
      console.log(`   Error: ${errorData.substring(0, 100)}...`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testMainSite();
