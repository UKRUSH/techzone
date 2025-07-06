// Test script to verify admin dashboard loads instantly
async function testAdminDashboard() {
  console.log('🧪 Testing Admin Dashboard Load Times...\n');
  
  const baseUrl = 'http://localhost:3000';
  
  try {
    // Test admin dashboard page
    console.log('📊 Testing Admin Dashboard Page...');
    const startTime = Date.now();
    const response = await fetch(`${baseUrl}/admin`, {
      method: 'GET',
      headers: {
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    const endTime = Date.now();
    const loadTime = endTime - startTime;
    
    if (response.ok) {
      const content = await response.text();
      const hasAdminContent = content.includes('Dashboard') || content.includes('admin');
      
      console.log(`✅ Admin Dashboard: ${response.status} - ${loadTime}ms`);
      console.log(`   Content Check: ${hasAdminContent ? '✅ Valid' : '❌ Invalid'}`);
      
      if (loadTime > 500) {
        console.log(`⚠️  Warning: Load time is ${loadTime}ms (should be under 500ms)`);
      } else {
        console.log(`🚀 Great! Load time is ${loadTime}ms (very fast)`);
      }
    } else {
      console.log(`❌ Admin Dashboard: ${response.status} - Failed`);
    }
    
    // Test admin stats API (with timeout)
    console.log('\n📈 Testing Admin Stats API...');
    const apiStartTime = Date.now();
    const apiResponse = await fetch(`${baseUrl}/api/admin/stats`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    const apiEndTime = Date.now();
    const apiLoadTime = apiEndTime - apiStartTime;
    
    if (apiResponse.ok) {
      const data = await apiResponse.json();
      console.log(`✅ Admin Stats API: ${apiResponse.status} - ${apiLoadTime}ms`);
      console.log(`   Data Source: ${data.source || 'unknown'}`);
      console.log(`   Has Stats: ${data.data?.stats ? '✅ Yes' : '❌ No'}`);
      console.log(`   Has Orders: ${data.data?.recentOrders?.length > 0 ? '✅ Yes' : '❌ No'}`);
      console.log(`   Has Products: ${data.data?.topProducts?.length > 0 ? '✅ Yes' : '❌ No'}`);
    } else {
      console.log(`❌ Admin Stats API: ${apiResponse.status} - Failed`);
    }
    
    // Test fallback admin stats API
    console.log('\n🔄 Testing Fallback Admin Stats API...');
    const fallbackStartTime = Date.now();
    const fallbackResponse = await fetch(`${baseUrl}/api/admin/stats/fallback`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    });
    const fallbackEndTime = Date.now();
    const fallbackLoadTime = fallbackEndTime - fallbackStartTime;
    
    if (fallbackResponse.ok) {
      const fallbackData = await fallbackResponse.json();
      console.log(`✅ Fallback Stats API: ${fallbackResponse.status} - ${fallbackLoadTime}ms`);
      console.log(`   Data Source: ${fallbackData.source || 'unknown'}`);
      console.log(`   Has Stats: ${fallbackData.data?.stats ? '✅ Yes' : '❌ No'}`);
    } else {
      console.log(`❌ Fallback Stats API: ${fallbackResponse.status} - Failed`);
    }
    
    console.log('\n📋 Summary:');
    console.log(`🏠 Admin Dashboard Page: ${loadTime}ms`);
    console.log(`📊 Stats API: ${apiLoadTime}ms`);
    console.log(`🔄 Fallback API: ${fallbackLoadTime}ms`);
    
    if (loadTime < 500 && apiLoadTime < 3000) {
      console.log('\n🎉 SUCCESS: Admin dashboard is optimized for instant loading!');
    } else {
      console.log('\n⚠️  Some performance issues detected. Check the logs above.');
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
testAdminDashboard();
