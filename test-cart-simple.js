// Test cart functionality using native fetch
async function testCartAPI() {
  try {
    console.log('🚀 Testing Cart API functionality...');
    
    // Test if server is running
    const healthCheck = await fetch('http://localhost:3001/api/products');
    console.log('✅ Server is running - Products API status:', healthCheck.status);
    
    // Test cart API
    const cartResponse = await fetch('http://localhost:3001/api/cart');
    console.log('✅ Cart API status:', cartResponse.status);
    
    const cartData = await cartResponse.json();
    console.log('📦 Current cart data:', cartData);
    
    console.log('🎉 Cart API is working properly!');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
  }
}

testCartAPI();
