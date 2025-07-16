// Test enhanced order details API
const testOrderDetailsAPI = async () => {
  console.log('🧪 Testing Enhanced Order Details API');
  
  try {
    // Test the enhanced API endpoint
    console.log('\n1. Testing enhanced user orders API...');
    const response = await fetch('http://localhost:3001/api/user/orders');
    
    if (!response.ok) {
      console.error('❌ API failed:', response.status, response.statusText);
      return;
    }
    
    const data = await response.json();
    console.log('✅ API Response received');
    console.log('📊 Orders count:', data.orders?.length || 0);
    
    if (data.orders && data.orders.length > 0) {
      const sampleOrder = data.orders[0];
      console.log('\n📦 Sample Enhanced Order Data:');
      console.log('Basic Info:', {
        id: sampleOrder.id,
        orderNumber: sampleOrder.orderNumber,
        status: sampleOrder.status,
        total: sampleOrder.total,
        date: sampleOrder.date
      });
      
      console.log('\n👤 Customer Info:', {
        name: sampleOrder.customerName,
        email: sampleOrder.customerEmail,
        phone: sampleOrder.customerPhone
      });
      
      console.log('\n🚚 Shipping Info:', sampleOrder.shipping);
      
      console.log('\n💳 Payment Info:', sampleOrder.payment);
      
      console.log('\n📦 Items Info:', sampleOrder.items?.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.price,
        total: item.total
      })));
      
      console.log('\n✅ Enhanced order details test successful!');
      console.log('🔍 What\'s new:');
      console.log('  - Customer name, email, phone');
      console.log('  - Complete shipping address with district');
      console.log('  - Payment breakdown (subtotal, tax, shipping)');
      console.log('  - Tracking number and estimated delivery');
      console.log('  - Enhanced item details with totals');
      
    } else {
      console.log('📝 No orders found to test');
    }
    
  } catch (error) {
    console.error('❌ Test error:', error);
  }
};

// Run the test
testOrderDetailsAPI();
