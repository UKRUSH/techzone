import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

// TEMPORARY MOCK API FOR DEMONSTRATION
// This bypasses the MongoDB connection issue
export async function POST(request) {
  try {
    const session = await getServerSession();
    const data = await request.json();

    console.log('Creating order with Sri Lankan data:', JSON.stringify(data, null, 2));

    // Validate required fields
    if (!data.customerInfo || !data.shippingAddress || !data.items || !data.total) {
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    // Create mock order for demonstration
    const mockOrder = {
      id: Date.now().toString(),
      confirmationNumber: `TZ${String(Date.now()).slice(-6)}`,
      userId: data.userId || null,
      
      // Customer information (Sri Lankan format)
      customerName: data.customerInfo.name,
      customerEmail: data.customerInfo.email,
      customerPhone: data.customerInfo.phone, // Supports Sri Lankan phone formats
      
      // Shipping address (Sri Lankan format)
      shippingAddress: data.shippingAddress.address,
      shippingAddress2: data.shippingAddress.address2 || null,
      shippingCity: data.shippingAddress.city,
      shippingDistrict: data.shippingAddress.district, // Sri Lankan district
      shippingPostalCode: data.shippingAddress.postalCode, // Sri Lankan postal code
      shippingCountry: data.shippingAddress.country, // Should be "Sri Lanka"
      
      // Payment information
      paymentMethod: data.paymentMethod,
      paymentDetails: data.paymentDetails || {},
      
      // Order totals (in LKR)
      subtotal: data.subtotal,
      tax: data.tax, // 18% VAT for Sri Lanka
      shipping: data.shipping,
      total: data.total,
      
      // Order status
      status: data.status || 'pending',
      createdAt: new Date().toISOString(),
      
      // Order items
      orderItems: data.items.map((item, index) => ({
        id: `${Date.now()}_${index}`,
        quantity: item.quantity,
        price: item.variant?.price || 0,
        variantId: item.variant?.id || null,
        productName: item.variant?.product?.name || 'Unknown Product',
        productDetails: {
          brand: item.variant?.product?.brand?.name,
          category: item.variant?.product?.category?.name,
          images: item.variant?.product?.images
        }
      }))
    };

    console.log('✅ Mock order created successfully for Sri Lankan customer:');
    console.log(`   Customer: ${mockOrder.customerName}`);
    console.log(`   Phone: ${mockOrder.customerPhone}`);
    console.log(`   Address: ${mockOrder.shippingAddress}, ${mockOrder.shippingCity}`);
    console.log(`   District: ${mockOrder.shippingDistrict}`);
    console.log(`   Postal Code: ${mockOrder.shippingPostalCode}`);
    console.log(`   Country: ${mockOrder.shippingCountry}`);
    console.log(`   Total: Rs. ${mockOrder.total}`);

    return NextResponse.json({ 
      success: true, 
      data: mockOrder,
      message: '🇱🇰 Order created successfully with Sri Lankan localization! (Demo mode - MongoDB connection needed for production)',
      id: mockOrder.id
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order: ' + error.message },
      { status: 500 }
    );
  }
}

// Keep the original GET method
export async function GET(request) {
  return NextResponse.json({ 
    message: 'Orders API - GET method (MongoDB connection required for actual data)',
    demo: true 
  });
}
