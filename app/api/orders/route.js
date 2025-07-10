import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { prisma } from '@/lib/prisma';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const data = await request.json();

    console.log('🔐 Session info:', session);
    console.log('📝 Creating order with data:', JSON.stringify(data, null, 2));

    // Get user ID from session if authenticated
    let userId = null;
    if (session?.user?.id) {
      userId = session.user.id;
      console.log('✅ Authenticated user ID:', userId);
    } else if (session?.user?.email) {
      // If we have email but no ID, find user in database
      const user = await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
      if (user) {
        userId = user.id;
        console.log('✅ Found user ID from email:', userId);
      }
    } else {
      console.log('❌ No authenticated user - creating guest order');
    }

    // Validate required fields
    if (!data.customerInfo || !data.shippingAddress || !data.items || !data.total) {
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    // Create order in MongoDB
    const order = await prisma.order.create({
      data: {
        // Customer information from user input
        customerName: data.customerInfo.name,
        customerEmail: data.customerInfo.email,
        customerPhone: data.customerInfo.phone,
        
        // Shipping address from user input (Sri Lankan format)
        shippingAddress: data.shippingAddress.address,
        shippingAddress2: data.shippingAddress.address2 || '',
        shippingCity: data.shippingAddress.city,
        shippingDistrict: data.shippingAddress.district, // Sri Lankan district
        shippingPostalCode: data.shippingAddress.postalCode, // Sri Lankan postal code
        shippingCountry: data.shippingAddress.country,
        
        // Payment information from user
        paymentMethod: data.paymentMethod,
        paymentDetails: data.paymentDetails || {},
        
        // Order totals from cart
        subtotal: parseFloat(data.subtotal),
        tax: parseFloat(data.tax),
        shipping: parseFloat(data.shipping || 0),
        total: parseFloat(data.total),
        
        // Order status
        status: 'PENDING',
        
        // Connect to user if authenticated
        userId: userId,
        
        // Order items from user's cart
        orderItems: {
          create: data.items.map((item) => ({
            quantity: item.quantity,
            price: item.variant?.price || 0,
            productName: item.variant?.product?.name || 'Unknown Product',
            // Handle invalid ObjectIds by setting to null
            productId: (item.variant?.product?.id && item.variant?.product?.id.length === 24) 
              ? item.variant.product.id 
              : null,
            variantId: (item.variant?.id && item.variant?.id.length === 24) 
              ? item.variant.id 
              : null
          }))
        }
      },
      include: {
        orderItems: true
      }
    });

    console.log('✅ Order created successfully in MongoDB:');
    console.log(`   ID: ${order.id}`);
    console.log(`   User ID: ${order.userId || 'NULL (Guest Order)'}`);
    console.log(`   Customer: ${order.customerName}`);
    console.log(`   Email: ${order.customerEmail}`);
    console.log(`   Phone: ${order.customerPhone}`);
    console.log(`   Address: ${order.shippingAddress}, ${order.shippingCity}`);
    console.log(`   District: ${order.shippingDistrict}`);
    console.log(`   Postal Code: ${order.shippingPostalCode}`);
    console.log(`   Total: Rs. ${order.total}`);
    console.log(`   Items: ${order.orderItems.length} products`);

    return NextResponse.json({ 
      success: true, 
      data: {
        id: order.id,
        confirmationNumber: order.confirmationNumber,
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        customerPhone: order.customerPhone,
        shippingAddress: order.shippingAddress,
        shippingAddress2: order.shippingAddress2,
        shippingCity: order.shippingCity,
        shippingDistrict: order.shippingDistrict,
        shippingPostalCode: order.shippingPostalCode,
        shippingCountry: order.shippingCountry,
        paymentMethod: order.paymentMethod,
        subtotal: order.subtotal,
        tax: order.tax,
        shipping: order.shipping,
        total: order.total,
        status: order.status,
        createdAt: order.createdAt,
        estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        orderItems: order.orderItems,
        tracking: {
          number: `LK${order.id}TZ`,
          status: "confirmed",
          updates: [
            {
              date: order.createdAt,
              status: "Order Confirmed",
              description: "Your order has been confirmed and is being prepared for shipping.",
              location: "TechZone Warehouse, Colombo"
            }
          ]
        }
      },
      message: '🇱🇰 Order created successfully in MongoDB database!',
      id: order.id
    });

  } catch (error) {
    console.error('Error creating order in MongoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order: ' + error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (orderId) {
      // Fetch order from MongoDB by ID
      const order = await prisma.order.findUnique({
        where: { id: orderId },
        include: {
          orderItems: true,
          user: {
            select: {
              name: true,
              email: true
            }
          }
        }
      });
      
      if (order) {
        console.log('✅ Returning order data from MongoDB for ID:', orderId);
        
        // Format the order data for the frontend
        const formattedOrder = {
          id: order.id,
          confirmationNumber: order.confirmationNumber,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
          shippingAddress: order.shippingAddress,
          shippingAddress2: order.shippingAddress2,
          shippingCity: order.shippingCity,
          shippingDistrict: order.shippingDistrict,
          shippingPostalCode: order.shippingPostalCode,
          shippingCountry: order.shippingCountry,
          paymentMethod: order.paymentMethod,
          subtotal: order.subtotal,
          tax: order.tax,
          shipping: order.shipping,
          total: order.total,
          status: order.status,
          createdAt: order.createdAt,
          estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
          orderItems: order.orderItems,
          tracking: {
            number: `LK${order.id}TZ`,
            status: order.status.toLowerCase(),
            updates: [
              {
                date: order.createdAt,
                status: "Order Confirmed",
                description: "Your order has been confirmed and is being prepared for shipping.",
                location: "TechZone Warehouse, Colombo"
              }
            ]
          }
        };
        
        return NextResponse.json({ 
          success: true, 
          data: formattedOrder 
        });
      } else {
        console.log('❌ No order found in MongoDB for ID:', orderId);
        return NextResponse.json(
          { success: false, error: 'Order not found' },
          { status: 404 }
        );
      }
    }

    // Return all orders for admin or user
    const orders = await prisma.order.findMany({
      include: {
        orderItems: true,
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to 50 recent orders
    });

    return NextResponse.json({ 
      success: true,
      data: orders,
      message: `Found ${orders.length} orders in MongoDB database`
    });
  } catch (error) {
    console.error('Error fetching orders from MongoDB:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch order: ' + error.message },
      { status: 500 }
    );
  }
}
