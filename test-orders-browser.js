console.log('🔍 Testing Orders Page - Browser Console Debugging');

// Function to check if we're authenticated
function checkAuth() {
  const authCookie = document.cookie.split(';')
    .find(cookie => cookie.trim().startsWith('next-auth.session-token='));
  
  console.log('🔍 Auth cookie found:', !!authCookie);
  return !!authCookie;
}

// Function to test the orders API directly
async function testOrdersAPI() {
  try {
    console.log('🔍 Testing orders API...');
    
    const response = await fetch('/api/user/orders', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include' // Include cookies for authentication
    });
    
    console.log('🔍 Response status:', response.status);
    console.log('🔍 Response ok:', response.ok);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Orders API Response:', data);
      console.log('📊 Orders count:', data.orders?.length || 0);
      
      if (data.orders?.length > 0) {
        console.log('🔍 First order details:', data.orders[0]);
        console.log('🔍 Customer name:', data.orders[0]?.customerName);
        console.log('🔍 Shipping info:', data.orders[0]?.shipping);
        console.log('🔍 Items:', data.orders[0]?.orderItems);
      }
    } else {
      const errorText = await response.text();
      console.error('❌ Orders API Error:', errorText);
    }
  } catch (error) {
    console.error('💥 Error testing orders API:', error);
  }
}

// Function to check current page state
function checkPageState() {
  console.log('🔍 Current page URL:', window.location.href);
  console.log('🔍 Orders component loaded:', !!document.querySelector('[data-testid="orders-page"]'));
  
  // Check if we can see any orders on the page
  const orderElements = document.querySelectorAll('[data-testid="order-card"]');
  console.log('🔍 Order cards found:', orderElements.length);
  
  // Check for loading states
  const loadingElements = document.querySelectorAll('[class*="loading"], [class*="loader"]');
  console.log('🔍 Loading elements found:', loadingElements.length);
  
  // Check for error messages
  const errorElements = document.querySelectorAll('[class*="error"]');
  console.log('🔍 Error elements found:', errorElements.length);
}

// Run all tests
console.log('🔍 Starting orders page debugging...');
console.log('🔍 Auth status:', checkAuth());
checkPageState();

// Test API after a short delay to let the page load
setTimeout(() => {
  console.log('🔍 Testing API after page load...');
  testOrdersAPI();
}, 2000);
