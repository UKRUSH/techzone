import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { PrismaClient } from "@prisma/client";

// Use singleton pattern for Prisma client
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function GET(request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    // Get user first
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Build where clause
    const where = {
      userId: user.id,
      ...(status && status !== 'all' && { status: status.toUpperCase() }),
      ...(search && {
        OR: [
          { confirmationNumber: { contains: search, mode: 'insensitive' } },
          { customerName: { contains: search, mode: 'insensitive' } },
          { orderItems: { some: { productName: { contains: search, mode: 'insensitive' } } } }
        ]
      })
    };

    // Get orders with pagination
    const [orders, totalCount] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          orderItems: {
            include: {
              product: {
                select: {
                  id: true,
                  name: true,
                  images: true
                }
              },
              variant: {
                select: {
                  id: true,
                  sku: true,
                  attributes: true
                }
              }
            }
          },
          delivery: true
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      prisma.order.count({ where })
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    // Format orders for frontend
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.confirmationNumber,
      status: order.status.toLowerCase(),
      total: order.total,
      subtotal: order.subtotal,
      tax: order.tax,
      shipping: order.shipping,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
      date: order.createdAt, // Add date field that UI expects
      customerInfo: {
        name: order.customerName,
        email: order.customerEmail,
        phone: order.customerPhone
      },
      shippingAddress: {
        address: order.shippingAddress,
        address2: order.shippingAddress2,
        city: order.shippingCity,
        district: order.shippingDistrict,
        postalCode: order.shippingPostalCode,
        country: order.shippingCountry
      },
      payment: {
        method: order.paymentMethod,
        amount: order.total, // Add amount field that UI expects
        details: order.paymentDetails
      },
      shipping: {
        address: order.shippingAddress ? `${order.shippingAddress}, ${order.shippingCity}, ${order.shippingCountry}` : 'No address',
        method: 'Standard Shipping',
        trackingNumber: order.delivery?.trackingNumber,
        estimatedDelivery: null
      },
      items: order.orderItems.map(item => ({
        id: item.id,
        productId: item.productId,
        name: item.productName, // UI expects 'name' field
        productName: item.productName,
        quantity: item.quantity,
        price: item.price,
        total: item.quantity * item.price,
        product: item.product,
        variant: item.variant,
        details: item.productDetails
      })),
      delivery: order.delivery ? {
        trackingNumber: order.delivery.trackingNumber,
        agentName: order.delivery.agentName,
        shippedAt: order.delivery.shippedAt,
        deliveredAt: order.delivery.deliveredAt,
        notes: order.delivery.deliveryNotes
      } : null
    }));

    return NextResponse.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      }
    });

  } catch (error) {
    console.error("Error fetching user orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
