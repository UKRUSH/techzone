const axios = require('axios');

async function testCartAPI() {
  try {
    console.log('🚀 Testing Cart API functionality...');
    
    // Test if server is running
    const healthCheck = await axios.get('http://localhost:3001/api/products');
    console.log('✅ Server is running - Products API responding');
    
    // Test cart API
    const cartResponse = await axios.get('http://localhost:3001/api/cart');
    console.log('✅ Cart API responding:', cartResponse.status);
    
    // Test adding item to cart
    const testProduct = {
      productId: '60b5d1c4f1b2c8d4e8f9a0b1', // test ID
      quantity: 1,
      price: 100
    };
    
    const addResponse = await axios.post('http://localhost:3001/api/cart', testProduct);
    console.log('✅ Add to cart API responding:', addResponse.status);
    
    console.log('🎉 All API tests passed! Cart functionality is working.');
    
  } catch (error) {
    console.error('❌ API Test failed:', error.message);
    if (error.response) {
      console.error('Response status:', error.response.status);
      console.error('Response data:', error.response.data);
    }
  }
}

testCartAPI();
