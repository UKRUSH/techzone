import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET - Retrieve orders
export async function GET(request) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');
    const userId = searchParams.get('userId');

    if (orderId) {
      // Get specific order
      const order = await prisma.order.findUnique({
        where: { id: parseInt(orderId) },
        include: {
          orderItems: {
            include: {
              variant: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      });

      if (!order) {
        return NextResponse.json({ error: 'Order not found' }, { status: 404 });
      }

      return NextResponse.json({ success: true, data: order });
    }

    // Get all orders for user or admin
    const whereClause = userId ? { userId: parseInt(userId) } : {};
    
    const orders = await prisma.order.findMany({
      where: whereClause,
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ success: true, data: orders });

  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}

// POST - Create new order
export async function POST(request) {
  try {
    const session = await getServerSession();
    const data = await request.json();

    console.log('Creating order with data:', JSON.stringify(data, null, 2));
    console.log('Session:', session);

    // Validate required fields
    if (!data.customerInfo || !data.shippingAddress || !data.items || !data.total) {
      console.log('Missing required fields:', {
        customerInfo: !!data.customerInfo,
        shippingAddress: !!data.shippingAddress,
        items: !!data.items,
        total: !!data.total
      });
      return NextResponse.json(
        { success: false, error: 'Missing required order data' },
        { status: 400 }
      );
    }

    console.log('About to create order with Prisma...');

    // Create order in database
    let order;
    try {
      order = await prisma.order.create({
        data: {
          userId: data.userId || null,
          
          // Customer information
          customerName: data.customerInfo.name,
          customerEmail: data.customerInfo.email,
          customerPhone: data.customerInfo.phone,
          
          // Shipping address
          shippingAddress: data.shippingAddress.address,
          shippingAddress2: data.shippingAddress.address2 || null,
          shippingCity: data.shippingAddress.city,
          shippingState: data.shippingAddress.district || data.shippingAddress.state, // Support both district and state
          shippingZipCode: data.shippingAddress.postalCode || data.shippingAddress.zipCode, // Support both postalCode and zipCode
          shippingCountry: data.shippingAddress.country,
          
          // Payment information
          paymentMethod: data.paymentMethod,
          paymentDetails: JSON.stringify(data.paymentDetails || {}),
          
          // Order totals
          subtotal: data.subtotal,
          tax: data.tax,
          shipping: data.shipping,
          total: data.total,
          
          // Order status
          status: data.status || 'pending',
          
          // Create order items
          orderItems: {
            create: data.items.map(item => ({
              quantity: item.quantity,
              price: item.variant?.price || 0,
              variantId: item.variant?.id || null,
              productName: item.variant?.product?.name || 'Unknown Product',
              productDetails: JSON.stringify({
                brand: item.variant?.product?.brand?.name,
                category: item.variant?.product?.category?.name,
                images: item.variant?.product?.images
              })
            }))
          }
        },        include: {
          orderItems: {
            include: {
              variant: {
                include: {
                  product: true
                }
              }
            }
          }
        }
      });
    } catch (prismaError) {
      console.error('Prisma error creating order:', prismaError);
      return NextResponse.json(
        { success: false, error: 'Database error: ' + prismaError.message },
        { status: 500 }
      );
    }

    console.log('Order created successfully:', order);

    // Generate order confirmation number
    const confirmationNumber = `TZ${order.id.toString().padStart(6, '0')}`;
    
    // Update order with confirmation number
    const updatedOrder = await prisma.order.update({
      where: { id: order.id },
      data: { confirmationNumber },
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedOrder,
      message: 'Order created successfully'
    });

  } catch (error) {
    console.error('Error creating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create order', details: error.message },
      { status: 500 }
    );
  }
}

// PUT - Update order
export async function PUT(request) {
  try {
    const session = await getServerSession();
    const data = await request.json();
    const { id, ...updateData } = data;

    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(id) }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Update order
    const updatedOrder = await prisma.order.update({
      where: { id: parseInt(id) },
      data: updateData,
      include: {
        orderItems: {
          include: {
            variant: {
              include: {
                product: true
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ 
      success: true, 
      data: updatedOrder,
      message: 'Order updated successfully'
    });

  } catch (error) {
    console.error('Error updating order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update order' },
      { status: 500 }
    );
  }
}

// DELETE - Delete order
export async function DELETE(request) {
  try {
    const session = await getServerSession();
    const { searchParams } = new URL(request.url);
    const orderId = searchParams.get('id');

    if (!orderId) {
      return NextResponse.json(
        { success: false, error: 'Order ID is required' },
        { status: 400 }
      );
    }

    // Check if order exists
    const existingOrder = await prisma.order.findUnique({
      where: { id: parseInt(orderId) }
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, error: 'Order not found' },
        { status: 404 }
      );
    }

    // Delete order items first (due to foreign key constraints)
    await prisma.orderItem.deleteMany({
      where: { orderId: parseInt(orderId) }
    });

    // Delete order
    await prisma.order.delete({
      where: { id: parseInt(orderId) }
    });

    return NextResponse.json({ 
      success: true, 
      message: 'Order deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting order:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete order' },
      { status: 500 }
    );
  }
}
