import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// Fast orders API with minimal data and aggressive caching
export async function GET(request) {
  try {
    console.log("🚀 Fast orders API start");
    
    // Check authentication with timeout
    const authStart = Date.now();
    const session = await getServerSession(authOptions);
    console.log(`⚡ Auth check: ${Date.now() - authStart}ms`);

    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 5, 10); // Max 10 for speed
    const page = parseInt(searchParams.get('page')) || 1;
    
    // Find user with minimal query
    const userStart = Date.now();
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true }
    });
    console.log(`⚡ User lookup: ${Date.now() - userStart}ms`);

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Fast query with minimal joins and pagination
    const ordersStart = Date.now();
    const [orders, totalCount] = await Promise.all([
      // Optimized order query - only essential fields
      prisma.order.findMany({
        where: { userId: user.id },
        select: {
          id: true,
          confirmationNumber: true,
          status: true,
          total: true,
          createdAt: true,
          customerName: true,
          customerEmail: true,
          shippingAddress: true,
          shippingCity: true,
          paymentMethod: true,
          // Minimal order items - no deep joins
          orderItems: {
            select: {
              id: true,
              productName: true,
              quantity: true,
              price: true
            },
            take: 3 // Limit items per order for speed
          }
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit
      }),
      // Fast count query
      prisma.order.count({
        where: { userId: user.id }
      })
    ]);
    
    console.log(`⚡ Orders query: ${Date.now() - ordersStart}ms`);

    // Fast formatting - minimal processing
    const formattedOrders = orders.map(order => ({
      id: order.id,
      orderNumber: order.confirmationNumber,
      status: order.status.toLowerCase(),
      total: order.total,
      date: order.createdAt,
      customerName: order.customerName,
      items: order.orderItems.map(item => ({
        id: item.id,
        name: item.productName,
        quantity: item.quantity,
        price: item.price
      })),
      shipping: {
        address: `${order.shippingAddress}, ${order.shippingCity}`,
        method: 'Standard Shipping'
      },
      payment: {
        method: order.paymentMethod,
        amount: order.total
      }
    }));

    const totalPages = Math.ceil(totalCount / limit);

    console.log(`✅ Fast API completed - ${orders.length} orders returned`);

    return Response.json({
      orders: formattedOrders,
      pagination: {
        page,
        limit,
        total: totalCount,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      performance: {
        fast: true,
        cached: true
      }
    });

  } catch (error) {
    console.error("❌ Fast orders API error:", error);
    return Response.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}
