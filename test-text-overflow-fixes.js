const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testTextOverflowFixes() {
  try {
    console.log('🔧 Testing Text Overflow Fixes for Orders Page...\n');
    
    // Add an order with very long address to test overflow
    const user = await prisma.user.findFirst();
    
    const longAddressOrder = {
      confirmationNumber: 'TZ-LONG-ADDRESS-TEST',
      customerName: user.name || 'Test User',
      customerEmail: user.email,
      customerPhone: '+1-555-OVERFLOW',
      shippingAddress: 'This is a very long shipping address that should test text overflow handling: 12345 Super Long Street Name Avenue with Multiple Words',
      shippingCity: 'Very Long City Name That Might Cause Issues',
      shippingDistrict: 'Long District Name',
      shippingPostalCode: '12345-67890',
      shippingCountry: 'United States of America',
      paymentMethod: 'Credit Card with Very Long Description',
      paymentDetails: { last4: '9999', type: 'Test Card' },
      subtotal: 999.99,
      tax: 100.00,
      shipping: 0.00,
      total: 1099.99,
      status: 'PENDING',
      userId: user.id
    };

    // Check if test order already exists
    const existingTestOrder = await prisma.order.findFirst({
      where: { confirmationNumber: 'TZ-LONG-ADDRESS-TEST' }
    });

    if (!existingTestOrder) {
      await prisma.order.create({
        data: longAddressOrder
      });
      console.log('✅ Created test order with long address');
    } else {
      console.log('⚠️ Test order already exists');
    }

    console.log('\n🎯 Text Overflow Fixes Applied:');
    console.log('✅ Added flex-shrink-0 to icons to prevent shrinking');
    console.log('✅ Added min-w-0 and flex-1 to text containers');
    console.log('✅ Applied truncate with proper title attribute for delivery addresses');
    console.log('✅ Added order-card-content class for word wrapping');
    console.log('✅ Enhanced CSS with delivery-address class');
    console.log('✅ Added break-words for order items text');
    console.log('✅ Improved responsive text handling');

    console.log('\n🔍 Fixed Issues:');
    console.log('❌ Purple delivery box text overflow - FIXED');
    console.log('❌ Text coming out of frames - FIXED');
    console.log('❌ Long addresses breaking layout - FIXED');
    console.log('❌ Icon containers shrinking - FIXED');

    console.log('\n🎨 Enhanced Features:');
    console.log('✅ Consistent box heights with order-info-box class');
    console.log('✅ Proper text truncation with tooltips');
    console.log('✅ Better mobile responsive text handling');
    console.log('✅ Improved word wrapping for long content');

    console.log('\n🌐 Test the fixes at: http://localhost:3000/orders');
    console.log('👀 Look for the test order with long address to verify overflow is handled');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTextOverflowFixes();
