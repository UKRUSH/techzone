import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Return instant fallback admin stats data
    const fallbackData = {
      stats: {
        totalProducts: 156,
        totalOrders: 89,
        totalCustomers: 234,
        totalRevenue: 125000,
        formattedRevenue: 'Rs. 125,000'
      },
      recentOrders: [
        {
          id: 'ORD001',
          customer: 'John Doe',
          amount: 15999,
          formattedAmount: 'Rs. 15,999',
          time: '2 minutes ago',
          status: 'completed'
        },
        {
          id: 'ORD002',
          customer: 'Jane Smith',
          amount: 89999,
          formattedAmount: 'Rs. 89,999',
          time: '15 minutes ago',
          status: 'processing'
        },
        {
          id: 'ORD003',
          customer: 'Bob Wilson',
          amount: 45000,
          formattedAmount: 'Rs. 45,000',
          time: '1 hour ago',
          status: 'completed'
        },
        {
          id: 'ORD004',
          customer: 'Alice Brown',
          amount: 25999,
          formattedAmount: 'Rs. 25,999',
          time: '2 hours ago',
          status: 'shipped'
        },
        {
          id: 'ORD005',
          customer: 'Mike Davis',
          amount: 12999,
          formattedAmount: 'Rs. 12,999',
          time: '3 hours ago',
          status: 'completed'
        }
      ],
      topProducts: [
        {
          id: 1,
          name: 'NVIDIA RTX 4090',
          price: 299999,
          soldQuantity: 25
        },
        {
          id: 2,
          name: 'AMD Ryzen 9 7900X',
          price: 89999,
          soldQuantity: 18
        },
        {
          id: 3,
          name: 'ASUS ROG Strix B650E',
          price: 45999,
          soldQuantity: 15
        },
        {
          id: 4,
          name: 'Corsair DDR5 32GB',
          price: 25999,
          soldQuantity: 12
        },
        {
          id: 5,
          name: 'Samsung 980 PRO 2TB',
          price: 35999,
          soldQuantity: 10
        }
      ]
    };

    return NextResponse.json({
      success: true,
      data: fallbackData,
      source: 'fallback'
    });

  } catch (error) {
    console.error('Error returning fallback admin stats:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to get fallback admin statistics' },
      { status: 500 }
    );
  }
}
