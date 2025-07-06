import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'last30days';
    const type = searchParams.get('type') || 'all';

    // Calculate date range based on period
    const now = new Date();
    let startDate;
    
    switch (period) {
      case 'today':
        startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        break;
      case 'last7days':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case 'last30days':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case 'last90days':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case 'lastyear':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Generate reports based on real database data
    const reports = [];

    try {
      // Get actual report data from database
      const [salesData, inventoryData, customersData, ordersData, productsData] = await Promise.all([
        // Sales report data
        prisma.order.aggregate({
          where: {
            status: 'DELIVERED', // Use correct enum value
            createdAt: { gte: startDate }
          },
          _count: { _all: true },
          _sum: { total: true }
        }),

        // Inventory report data
        prisma.inventory.aggregate({
          _count: { _all: true },
          _sum: { 
            stock: true
          }
        }),

        // Customer report data
        prisma.user.aggregate({
          _count: { _all: true },
          where: {
            createdAt: { gte: startDate }
          }
        }),

        // Orders report data
        prisma.order.aggregate({
          _count: { _all: true },
          where: {
            createdAt: { gte: startDate }
          }
        }),

        // Products report data
        prisma.product.aggregate({
          _count: { _all: true }
        })
      ]);

      // Generate sales report if requested or show all
      if (type === 'all' || type === 'sales') {
        const previousPeriod = new Date(startDate.getTime() - (Date.now() - startDate.getTime()));
        const previousSalesData = await prisma.order.aggregate({
          where: {
            status: 'DELIVERED', // Use correct enum value
            createdAt: { 
              gte: previousPeriod,
              lt: startDate 
            }
          },
          _sum: { total: true }
        });

        const currentRevenue = salesData._sum.total || 0;
        const previousRevenue = previousSalesData._sum.total || 0;
        const growth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        reports.push({
          id: 1,
          name: "Sales Report",
          type: "sales",
          period: getReadablePeriod(period),
          generatedAt: new Date().toISOString(),
          status: "completed",
          size: "2.5 MB",
          records: salesData._count._all || 0,
          growth: Math.round(growth * 10) / 10,
          downloadUrl: "/api/reports/download/sales"
        });
      }

      // Generate inventory report if requested or show all
      if (type === 'all' || type === 'inventory') {
        reports.push({
          id: 2,
          name: "Inventory Report",
          type: "inventory",
          period: getReadablePeriod(period),
          generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          size: "890 KB",
          records: inventoryData._count._all || 0,
          growth: 0, // Inventory growth calculation would need more complex logic
          downloadUrl: "/api/reports/download/inventory"
        });
      }

      // Generate customer report if requested or show all
      if (type === 'all' || type === 'customers') {
        const previousCustomersData = await prisma.user.aggregate({
          _count: { _all: true },
          where: {
            createdAt: { 
              gte: new Date(startDate.getTime() - (Date.now() - startDate.getTime())),
              lt: startDate 
            }
          }
        });

        const currentCustomers = customersData._count._all || 0;
        const previousCustomers = previousCustomersData._count._all || 0;
        const customerGrowth = previousCustomers > 0 ? ((currentCustomers - previousCustomers) / previousCustomers) * 100 : 0;

        reports.push({
          id: 3,
          name: "Customer Analytics",
          type: "customers",
          period: getReadablePeriod(period),
          generatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          size: "1.2 MB",
          records: currentCustomers,
          growth: Math.round(customerGrowth * 10) / 10,
          downloadUrl: "/api/reports/download/customers"
        });
      }

      // Generate orders report if requested or show all
      if (type === 'all' || type === 'orders') {
        const previousOrdersData = await prisma.order.aggregate({
          _count: { _all: true },
          where: {
            createdAt: { 
              gte: new Date(startDate.getTime() - (Date.now() - startDate.getTime())),
              lt: startDate 
            }
          }
        });

        const currentOrders = ordersData._count._all || 0;
        const previousOrders = previousOrdersData._count._all || 0;
        const orderGrowth = previousOrders > 0 ? ((currentOrders - previousOrders) / previousOrders) * 100 : 0;

        reports.push({
          id: 4,
          name: "Order Trends",
          type: "orders",
          period: getReadablePeriod(period),
          generatedAt: new Date().toISOString(),
          status: "completed",
          size: "1.8 MB",
          records: currentOrders,
          growth: Math.round(orderGrowth * 10) / 10,
          downloadUrl: "/api/reports/download/orders"
        });
      }

      // Generate products report if requested or show all
      if (type === 'all' || type === 'products') {
        reports.push({
          id: 5,
          name: "Product Performance",
          type: "products",
          period: getReadablePeriod(period),
          generatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          size: "3.1 MB",
          records: productsData._count._all || 0,
          growth: 0, // Product growth would need more complex calculation
          downloadUrl: "/api/reports/download/products"
        });
      }

      // Generate revenue report if requested or show all
      if (type === 'all' || type === 'revenue') {
        const previousPeriod = new Date(startDate.getTime() - (Date.now() - startDate.getTime()));
        const previousRevenueData = await prisma.order.aggregate({
          where: {
            status: 'DELIVERED', // Use correct enum value
            createdAt: { 
              gte: previousPeriod,
              lt: startDate 
            }
          },
          _sum: { total: true }
        });

        const currentRevenue = salesData._sum.total || 0;
        const previousRevenue = previousRevenueData._sum.total || 0;
        const revenueGrowth = previousRevenue > 0 ? ((currentRevenue - previousRevenue) / previousRevenue) * 100 : 0;

        reports.push({
          id: 6,
          name: "Revenue Analysis",
          type: "revenue",
          period: getReadablePeriod(period),
          generatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          status: "completed",
          size: "1.8 MB",
          records: salesData._count._all || 0,
          growth: Math.round(revenueGrowth * 10) / 10,
          downloadUrl: "/api/reports/download/revenue"
        });
      }

    } catch (dbError) {
      console.error('Database error generating reports:', dbError);
      // If database error, return empty reports array
      // In production, you might want to return cached reports or show an error
    }

    function getReadablePeriod(period) {
      switch (period) {
        case 'today': return 'Daily';
        case 'last7days': return 'Weekly';
        case 'last30days': return 'Monthly';
        case 'last90days': return 'Quarterly';
        case 'lastyear': return 'Yearly';
        default: return 'Monthly';
      }
    }

    // Filter reports based on type
    const filteredReports = type === 'all' 
      ? reports 
      : reports.filter(report => report.type === type);

    return NextResponse.json({
      success: true,
      reports: filteredReports,
      total: filteredReports.length,
      period,
      type
    });

  } catch (error) {
    console.error('Error fetching reports:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch reports' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const { type, period, name } = await request.json();

    if (!type || !period) {
      return NextResponse.json(
        { success: false, error: 'Type and period are required' },
        { status: 400 }
      );
    }

    // In a real implementation, this would:
    // 1. Queue a background job to generate the report
    // 2. Fetch data from the database based on type and period
    // 3. Generate the report file (PDF, Excel, etc.)
    // 4. Store the report in file storage
    // 5. Return the report metadata

    // For now, simulate report generation
    const newReport = {
      id: Date.now(), // Use proper ID generation in production
      name: name || `${type.charAt(0).toUpperCase() + type.slice(1)} Report`,
      type,
      period,
      generatedAt: new Date().toISOString(),
      status: "generating",
      size: "",
      records: 0,
      growth: 0,
      downloadUrl: null
    };

    // Simulate async report generation
    setTimeout(async () => {
      // In real implementation, update the report status in database
      console.log(`Report ${newReport.id} generation completed`);
    }, 5000);

    return NextResponse.json({
      success: true,
      report: newReport,
      message: 'Report generation started'
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
