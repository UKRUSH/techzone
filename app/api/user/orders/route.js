import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function GET(request) {
  try {
    const startTime = Date.now();

    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 5, 10);
    const page = parseInt(searchParams.get('page')) || 1;
    const offset = (page - 1) * limit;

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    const [orders, totalOrders] = await Promise.all([
      prisma.order.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          confirmationNumber: true,
          status: true,
          total: true,
          subtotal: true,
          tax: true,
          shipping: true,
          createdAt: true,
          customerName: true,
          customerEmail: true,
          customerPhone: true,
          shippingAddress: true,
          shippingAddress2: true,
          shippingCity: true,
          shippingDistrict: true,
          shippingPostalCode: true,
          shippingCountry: true,
          paymentMethod: true,
          orderItems: {
            select: {
              id: true,
              productName: true,
              quantity: true,
              price: true,
              productId: true,
              variantId: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: offset,
        take: limit
      }),
      prisma.order.count({ where: { userId: user.id } })
    ]);
    const totalPages = Math.ceil(totalOrders / limit);

    // Format orders for frontend with comprehensive details
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.orderNumber || order.confirmationNumber || order.id.slice(-8).toUpperCase(),
      status: order.status.toLowerCase(),
      total: order.total,
      date: order.createdAt,
      
      // Customer information
      customerName: order.customerName,
      customerEmail: order.customerEmail,
      customerPhone: order.customerPhone,
      
      // Enhanced shipping information
      shipping: {
        address: order.shippingAddress,
        address2: order.shippingAddress2,
        city: order.shippingCity,
        district: order.shippingDistrict,
        postalCode: order.shippingPostalCode,
        country: order.shippingCountry,
        method: 'Standard Delivery',
        trackingNumber: `LK${order.id}TZ`,
        estimatedDelivery: new Date(order.createdAt.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString()
      },
      
      // Enhanced payment information
      payment: {
        method: order.paymentMethod,
        amount: order.total,
        subtotal: order.subtotal,
        tax: order.tax,
        shippingCost: order.shipping || 0
      },
      
      // Order items with enhanced details
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
        productId: item.productId,
        variantId: item.variantId
      }))
    }));

    return Response.json({
      orders: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Orders API Error:", error);
    return Response.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}
