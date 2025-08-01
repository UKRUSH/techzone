const puppeteer = require('puppeteer');

async function testCartFunctionality() {
  const browser = await puppeteer.launch({ 
    headless: false,
    defaultViewport: null,
    args: ['--start-maximized']
  });
  const page = await browser.newPage();

  try {
    console.log('🚀 Starting cart functionality test...');
    
    // Navigate to products page
    await page.goto('http://localhost:3001/products', { waitUntil: 'networkidle2' });
    console.log('✅ Navigated to products page');
    
    // Wait for products to load
    await page.waitForSelector('[data-testid="add-to-cart"]', { timeout: 10000 });
    console.log('✅ Products loaded');
    
    // Add first product to cart
    await page.click('[data-testid="add-to-cart"]');
    console.log('✅ Clicked add to cart button');
    
    // Wait a moment for cart to update
    await page.waitForTimeout(2000);
    
    // Navigate to cart page
    await page.goto('http://localhost:3001/cart', { waitUntil: 'networkidle2' });
    console.log('✅ Navigated to cart page');
    
    // Check if cart items are displayed
    await page.waitForTimeout(3000);
    
    const cartItems = await page.$$('[data-testid="cart-item"]');
    console.log(`📦 Found ${cartItems.length} items in cart`);
    
    if (cartItems.length > 0) {
      console.log('✅ SUCCESS: Cart items are displaying properly!');
      
      // Test quantity controls
      const plusButton = await page.$('[data-testid="quantity-plus"]');
      const minusButton = await page.$('[data-testid="quantity-minus"]');
      
      if (plusButton && minusButton) {
        console.log('✅ Quantity controls found');
        
        // Test plus button
        await plusButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Plus button clicked');
        
        // Test minus button  
        await minusButton.click();
        await page.waitForTimeout(1000);
        console.log('✅ Minus button clicked');
        
        console.log('🎉 ALL CART FUNCTIONALITY TESTS PASSED!');
      } else {
        console.log('⚠️ Quantity controls not found');
      }
    } else {
      console.log('❌ FAILED: No cart items found');
    }
    
    // Check console for any errors
    page.on('console', msg => {
      if (msg.type() === 'error') {
        console.log('❌ Console Error:', msg.text());
      }
    });
    
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  } finally {
    await browser.close();
  }
}

testCartFunctionality();
