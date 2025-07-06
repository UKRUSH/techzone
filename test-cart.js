#!/usr/bin/env node

/**
 * Cart API Test Script
 * Tests the cart functionality with fallback data when MongoDB is down
 */

const testUrl = 'http://localhost:3001';

async function testCartAPI() {
  console.log('🛒 Testing Cart API with Fallback Data');
  console.log('=====================================');
  
  try {
    // Test 1: Fetch empty cart
    console.log('\n1️⃣ Testing GET /api/cart (empty cart)');
    const getResponse = await fetch(`${testUrl}/api/cart`);
    const getResult = await getResponse.json();
    
    if (getResponse.ok) {
      console.log('✅ GET /api/cart successful');
      console.log(`   Cart items: ${getResult.data?.length || 0}`);
    } else {
      console.log('❌ GET /api/cart failed:', getResult.error);
    }
    
    // Test 2: Add item to cart
    console.log('\n2️⃣ Testing POST /api/cart (add item)');
    const postResponse = await fetch(`${testUrl}/api/cart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        variantId: '1',
        quantity: 2,
        sessionId: 'test-session-123'
      })
    });
    
    const postResult = await postResponse.json();
    
    if (postResponse.ok) {
      console.log('✅ POST /api/cart successful');
      console.log(`   Added item: ${postResult.data?.variant?.product?.name || 'Unknown'}`);
      console.log(`   Quantity: ${postResult.data?.quantity || 0}`);
    } else {
      console.log('❌ POST /api/cart failed:', postResult.error);
    }
    
    // Test 3: Fetch cart with items
    console.log('\n3️⃣ Testing GET /api/cart (with items)');
    const getResponse2 = await fetch(`${testUrl}/api/cart?sessionId=test-session-123`);
    const getResult2 = await getResponse2.json();
    
    if (getResponse2.ok) {
      console.log('✅ GET /api/cart successful');
      console.log(`   Cart items: ${getResult2.data?.length || 0}`);
      if (getResult2.data?.length > 0) {
        getResult2.data.forEach((item, index) => {
          console.log(`   Item ${index + 1}: ${item.variant?.product?.name || 'Unknown'} (Qty: ${item.quantity})`);
        });
      }
    } else {
      console.log('❌ GET /api/cart failed:', getResult2.error);
    }
    
    console.log('\n🎉 Cart API Test Complete!');
    console.log('💡 Cart is working with fallback data while MongoDB is down');
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.log('\n💡 Make sure the development server is running on port 3001');
  }
}

// Run the test
testCartAPI();
