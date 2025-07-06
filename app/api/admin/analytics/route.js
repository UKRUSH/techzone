import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '30d';

    // Calculate date range
    const now = new Date();
    let startDate;
    
    switch (range) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Calculate previous period for comparison
    const periodDuration = now.getTime() - startDate.getTime();
    const previousPeriodStart = new Date(startDate.getTime() - periodDuration);

    // Fetch current period data
    const [
      totalRevenueCurrent,
      totalOrdersCurrent,
      totalCustomersCurrent,
      topProducts,
      completedOrders
    ] = await Promise.all([
      // Total revenue for current period
      prisma.order.aggregate({
        where: {
          status: 'DELIVERED', // Use correct enum value
          createdAt: { gte: startDate }
        },
        _sum: { total: true }
      }),

      // Total orders for current period
      prisma.order.count({
        where: {
          status: 'DELIVERED', // Use correct enum value
          createdAt: { gte: startDate }
        }
      }),

      // New customers for current period
      prisma.user.count({
        where: {
          createdAt: { gte: startDate }
        }
      }),

      // Top products by revenue
      prisma.orderItem.groupBy({
        by: ['productId'],
        where: {
          order: {
            status: 'DELIVERED', // Use correct enum value
            createdAt: { gte: startDate }
          }
        },
        _sum: {
          quantity: true,
          price: true
        },
        orderBy: {
          _sum: {
            price: 'desc'
          }
        },
        take: 5
      }),

      // Get completed orders with product categories for manual grouping
      prisma.order.findMany({
        where: {
          status: 'DELIVERED',
          createdAt: { gte: startDate }
        },
        include: {
          orderItems: {
            include: {
              product: {
                include: {
                  category: true
                }
              }
            }
          }
        }
      })
    ]);

    // Manually calculate sales by category from the completed orders
    const salesByCategory = {};
    completedOrders.forEach(order => {
      order.orderItems.forEach(item => {
        if (item.product && item.product.category) {
          const categoryName = item.product.category.name;
          if (!salesByCategory[categoryName]) {
            salesByCategory[categoryName] = 0;
          }
          salesByCategory[categoryName] += item.price * item.quantity;
        }
      });
    });

    // Convert to array and sort by revenue
    const salesByCategoryArray = Object.entries(salesByCategory)
      .map(([categoryName, totalRevenue]) => ({
        categoryName,
        totalRevenue
      }))
      .sort((a, b) => b.totalRevenue - a.totalRevenue)
      .slice(0, 10);

    // Fetch previous period data for comparison
    const [
      totalRevenuePrevious,
      totalOrdersPrevious,
      totalCustomersPrevious
    ] = await Promise.all([
      prisma.order.aggregate({
        where: {
          status: 'DELIVERED', // Use correct enum value
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate 
          }
        },
        _sum: { total: true }
      }),

      prisma.order.count({
        where: {
          status: 'DELIVERED', // Use correct enum value
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate 
          }
        }
      }),

      prisma.user.count({
        where: {
          createdAt: { 
            gte: previousPeriodStart,
            lt: startDate 
          }
        }
      })
    ]);

    // Get product details for top products
    const topProductsWithDetails = await Promise.all(
      topProducts.map(async (item) => {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
          select: { name: true }
        });
        return {
          name: product?.name || 'Unknown Product',
          revenue: item._sum.price || 0,
          units: item._sum.quantity || 0
        };
      })
    );

    // Get category details for sales by category
    const salesByCategoryWithDetails = salesByCategoryArray.map(item => ({
      category: item.categoryName,
      value: item.totalRevenue || 0
    }));

    // Calculate totals and percentages
    const currentRevenue = totalRevenueCurrent._sum.total || 0;
    const previousRevenue = totalRevenuePrevious._sum.total || 0;
    const revenueChange = previousRevenue > 0 ? 
      ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

    const ordersChange = totalOrdersPrevious > 0 ? 
      ((totalOrdersCurrent - totalOrdersPrevious) / totalOrdersPrevious) * 100 : 0;

    const customersChange = totalCustomersPrevious > 0 ? 
      ((totalCustomersCurrent - totalCustomersPrevious) / totalCustomersPrevious) * 100 : 0;

    // Calculate average order value
    const avgOrderValueCurrent = totalOrdersCurrent > 0 ? currentRevenue / totalOrdersCurrent : 0;
    const avgOrderValuePrevious = totalOrdersPrevious > 0 ? previousRevenue / totalOrdersPrevious : 0;
    const avgOrderValueChange = avgOrderValuePrevious > 0 ? 
      ((avgOrderValueCurrent - avgOrderValuePrevious) / avgOrderValuePrevious) * 100 : 0;

    // Get recent activity
    const recentOrders = await prisma.order.findMany({
      where: {
        createdAt: { gte: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
      },
      orderBy: { createdAt: 'desc' },
      take: 10,
      select: {
        id: true,
        total: true,
        status: true,
        createdAt: true
      }
    });

    const recentActivity = recentOrders.map(order => ({
      type: 'sale',
      description: `Order #${order.id} ${order.status}`,
      amount: order.total,
      time: formatTimeAgo(order.createdAt)
    }));

    // Calculate category percentages
    const totalCategoryRevenue = salesByCategoryWithDetails.reduce((sum, cat) => sum + cat.value, 0);
    const salesByCategoryPercentages = salesByCategoryWithDetails.map(cat => ({
      category: cat.category,
      value: totalCategoryRevenue > 0 ? (cat.value / totalCategoryRevenue) * 100 : 0
    }));

    const analytics = {
      revenue: {
        current: currentRevenue,
        previous: previousRevenue,
        change: revenueChange
      },
      orders: {
        current: totalOrdersCurrent,
        previous: totalOrdersPrevious,
        change: ordersChange
      },
      customers: {
        current: totalCustomersCurrent,
        previous: totalCustomersPrevious,
        change: customersChange
      },
      avgOrderValue: {
        current: avgOrderValueCurrent,
        previous: avgOrderValuePrevious,
        change: avgOrderValueChange
      },
      topProducts: topProductsWithDetails,
      salesByCategory: salesByCategoryPercentages,
      recentActivity
    };

    return NextResponse.json({
      success: true,
      data: analytics,
      period: range,
      startDate: startDate.toISOString(),
      endDate: now.toISOString()
    });

  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch analytics data' },
      { status: 500 }
    );
  }
}

function formatTimeAgo(date) {
  const now = new Date();
  const diffInMinutes = Math.floor((now - new Date(date)) / (1000 * 60));
  
  if (diffInMinutes < 1) return 'Just now';
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} hours ago`;
  
  const diffInDays = Math.floor(diffInHours / 24);
  return `${diffInDays} days ago`;
}
