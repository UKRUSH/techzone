#!/usr/bin/env node

/**
 * Simple Website Health Check
 * Tests if the website and APIs are working
 */

const testUrl = 'http://localhost:3000';

async function testWebsite() {
  console.log('🌐 Testing TechZone Website');
  console.log('==========================');
  
  try {
    // Test 1: Home page
    console.log('\n1️⃣ Testing Home Page');
    const homeResponse = await fetch(`${testUrl}/`);
    console.log(`   Status: ${homeResponse.status} ${homeResponse.statusText}`);
    
    // Test 2: Fast products API
    console.log('\n2️⃣ Testing Fast Products API');
    const fastResponse = await fetch(`${testUrl}/api/products/fast`);
    console.log(`   Status: ${fastResponse.status} ${fastResponse.statusText}`);
    if (fastResponse.ok) {
      const data = await fastResponse.json();
      console.log(`   Products: ${data.length || 0} items`);
    }
    
    // Test 3: Categories API
    console.log('\n3️⃣ Testing Categories API');
    const categoriesResponse = await fetch(`${testUrl}/api/categories/fallback`);
    console.log(`   Status: ${categoriesResponse.status} ${categoriesResponse.statusText}`);
    if (categoriesResponse.ok) {
      const data = await categoriesResponse.json();
      console.log(`   Categories: ${data.length || 0} items`);
    }
    
    // Test 4: Cart API
    console.log('\n4️⃣ Testing Cart API');
    const cartResponse = await fetch(`${testUrl}/api/cart`);
    console.log(`   Status: ${cartResponse.status} ${cartResponse.statusText}`);
    
    console.log('\n🎉 Website Health Check Complete!');
    console.log(`🔗 Access your site at: ${testUrl}`);
    
  } catch (error) {
    if (error.code === 'ECONNREFUSED') {
      console.error('❌ Connection refused - Server not running');
      console.log('💡 Make sure to run: npm run dev');
    } else {
      console.error('❌ Test failed:', error.message);
    }
  }
}

// Run the test
testWebsite();
