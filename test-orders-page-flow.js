const puppeteer = require('puppeteer');

async function testOrdersPageFlow() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  
  try {
    const page = await browser.newPage();
    
    console.log('🧪 Testing complete orders page flow...\n');
    
    // Enable console logging from the page
    page.on('console', msg => {
      console.log(`📟 Console (${msg.type()}):`, msg.text());
    });
    
    // Monitor network requests
    page.on('response', response => {
      if (response.url().includes('/api/user/orders')) {
        console.log(`🌐 Orders API: ${response.status()} ${response.url()}`);
      }
    });
    
    // Go to signin page
    console.log('1. 🔐 Navigating to signin page...');
    await page.goto('http://localhost:3000/auth/signin', { waitUntil: 'networkidle2' });
    
    // Fill in credentials for user with orders
    console.log('2. ✍️  Filling in credentials...');
    await page.waitForSelector('input[type="email"]');
    await page.type('input[type="email"]', 'user@techzone.com');
    await page.type('input[type="password"]', 'password123');
    
    // Submit login
    console.log('3. 🚀 Submitting login...');
    await page.click('button[type="submit"]');
    
    // Wait for redirect/login completion
    await page.waitForTimeout(3000);
    
    // Navigate to orders page
    console.log('4. 📦 Navigating to orders page...');
    await page.goto('http://localhost:3000/orders', { waitUntil: 'networkidle2' });
    
    // Wait a bit for data to load
    await page.waitForTimeout(5000);
    
    // Check if orders are displayed
    console.log('5. 🔍 Checking orders display...');
    
    // Check for loading state
    const isLoading = await page.evaluate(() => {
      return document.querySelector('.animate-spin') !== null;
    });
    
    console.log(`   Loading state: ${isLoading}`);
    
    // Check for error state
    const hasError = await page.evaluate(() => {
      return document.querySelector('[data-lucide="alert-circle"]') !== null ||
             document.textContent.includes('Error Loading Orders');
    });
    
    console.log(`   Error state: ${hasError}`);
    
    // Check for orders content
    const ordersInfo = await page.evaluate(() => {
      const orderCards = document.querySelectorAll('[class*="Card"]');
      const orderElements = document.querySelectorAll('[class*="order"], [class*="Order"]');
      const orderNumberElements = document.querySelectorAll('h3');
      const noOrdersMessage = document.textContent.includes('No orders found') || 
                            document.textContent.includes("You haven't placed any orders yet");
      
      return {
        cardCount: orderCards.length,
        orderElementCount: orderElements.length,
        orderNumberElements: orderNumberElements.length,
        hasNoOrdersMessage: noOrdersMessage,
        pageTitle: document.querySelector('h1')?.textContent || 'No title found',
        bodyText: document.body.textContent.substring(0, 500)
      };
    });
    
    console.log('   Orders display info:');
    console.log(`   - Page title: ${ordersInfo.pageTitle}`);
    console.log(`   - Card elements: ${ordersInfo.cardCount}`);
    console.log(`   - Order elements: ${ordersInfo.orderElementCount}`);
    console.log(`   - Order number elements: ${ordersInfo.orderNumberElements}`);
    console.log(`   - No orders message: ${ordersInfo.hasNoOrdersMessage}`);
    
    // Take a screenshot
    await page.screenshot({ path: 'orders-page-test.png', fullPage: true });
    console.log('📸 Screenshot saved as orders-page-test.png');
    
    // Check local storage and session
    const sessionInfo = await page.evaluate(() => {
      return {
        localStorage: JSON.stringify(localStorage),
        sessionStorage: JSON.stringify(sessionStorage),
        cookies: document.cookie
      };
    });
    
    console.log('\n🍪 Session info:');
    console.log('   Cookies:', sessionInfo.cookies ? 'Present' : 'None');
    
    console.log('\n📄 Page content preview:');
    console.log(ordersInfo.bodyText);
    
  } catch (error) {
    console.error('❌ Test error:', error);
  } finally {
    await browser.close();
  }
}

// Run the test
testOrdersPageFlow().catch(console.error);
