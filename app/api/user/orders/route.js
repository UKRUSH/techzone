import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma, ensureConnection, withDatabaseConnection } from "@/lib/prisma";

export async function GET(request) {
  try {
    console.log("🚀 Starting orders API");
    const startTime = Date.now();
    
    // Enhanced connection retry logic
    let connectionAttempts = 0;
    const maxConnectionAttempts = 3;
    let connectionEstablished = false;
    
    while (connectionAttempts < maxConnectionAttempts && !connectionEstablished) {
      connectionAttempts++;
      console.log(`🔄 Connection attempt ${connectionAttempts}/${maxConnectionAttempts}`);
      
      try {
        connectionEstablished = await ensureConnection();
        if (connectionEstablished) {
          console.log("✅ Database connection verified");
          break;
        }
      } catch (connectionError) {
        console.error(`❌ Connection attempt ${connectionAttempts} failed:`, connectionError.message);
        if (connectionAttempts < maxConnectionAttempts) {
          await new Promise(resolve => setTimeout(resolve, 1000 * connectionAttempts));
        }
      }
    }
    
    if (!connectionEstablished) {
      return Response.json(
        { error: "Database connection failed after multiple attempts", retry: true },
        { status: 503 }
      );
    }
    
    // Authentication check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    console.log("📊 Authenticated user:", session.user.email);

    // Get query parameters
    const { searchParams } = new URL(request.url);
    const limit = Math.min(parseInt(searchParams.get('limit')) || 5, 10);
    const page = parseInt(searchParams.get('page')) || 1;
    const offset = (page - 1) * limit;

    console.log("📊 Query params:", { limit, page, offset });

    // User lookup with retry
    console.log("🔍 Looking up user:", session.user.email);
    let user;
    
    const findUser = async () => {
      return await prisma.user.findUnique({
        where: { email: session.user.email },
        select: { id: true }
      });
    };
    
    try {
      user = await findUser();
    } catch (userError) {
      console.error("❌ User lookup failed:", userError.message);
      // One retry for user lookup
      await ensureConnection();
      user = await findUser();
    }

    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    // Orders query with timeout protection
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database timeout')), 10000)
    );

    const fetchOrders = async () => {
      console.log("📦 Fetching orders for user:", user.id);
      
      const executeQuery = async () => {
        return await Promise.all([
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
          prisma.order.count({
            where: { userId: user.id }
          })
        ]);
      };
      
      try {
        const [orders, totalOrders] = await executeQuery();
        return { orders, totalOrders };
      } catch (queryError) {
        console.error("❌ Orders query failed:", queryError.message);
        // One retry for orders query
        await ensureConnection();
        const [orders, totalOrders] = await executeQuery();
        return { orders, totalOrders };
      }
    };

    const { orders, totalOrders } = await Promise.race([fetchOrders(), timeoutPromise]);
    const totalPages = Math.ceil(totalOrders / limit);

    console.log(`✅ Returning orders: count=${orders.length}, total=${totalOrders}, pages=${totalPages}`);

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

    const responseTime = Date.now() - startTime;
    console.log(`⚡ Orders API completed in ${responseTime}ms`);

    return Response.json({
      orders: formattedOrders,
      pagination: {
        currentPage: page,
        totalPages,
        totalOrders,
        hasNext: page < totalPages,
        hasPrev: page > 1
      },
      performance: {
        responseTime: `${responseTime}ms`
      }
    });

  } catch (error) {
    console.error("❌ Orders API Error:", error);
    
    // Always attempt to disconnect on error
    try {
      await prisma.$disconnect();
    } catch (disconnectError) {
      console.error("Prisma disconnect error:", disconnectError);
    }
    
    if (error.message === 'Database timeout') {
      return Response.json({
        error: "Orders taking longer than expected. The database is taking longer than usual. Your orders will load shortly.",
        timeout: true,
        retryAfter: 5
      }, { status: 503 });
    }
    
    return Response.json(
      { error: "Failed to fetch orders", details: error.message },
      { status: 500 }
    );
  }
}
