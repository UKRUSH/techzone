'use client';

import { useUserOrders } from '@/lib/hooks/useUserData';
import { useSession } from 'next-auth/react';

export default function TestRecentActivity() {
  const { data: session, status } = useSession();
  const { orders: recentOrders, isLoading: ordersLoading, error: ordersError } = useUserOrders({ limit: 5 });

  console.log('Debug - useUserOrders state:', {
    session: session?.user?.email,
    status,
    recentOrders,
    ordersLoading,
    ordersError,
    ordersLength: recentOrders?.length
  });

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-2xl font-bold mb-6">Recent Activity Debug Test</h1>
      
      <div className="bg-gray-900 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Session Status</h2>
        <p>Status: {status}</p>
        <p>User: {session?.user?.email || 'Not logged in'}</p>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg mb-6">
        <h2 className="text-xl font-semibold mb-4">Orders Hook State</h2>
        <p>Loading: {ordersLoading ? 'true' : 'false'}</p>
        <p>Error: {ordersError || 'None'}</p>
        <p>Orders Count: {recentOrders?.length || 0}</p>
        {recentOrders?.length > 0 && (
          <div className="mt-4">
            <h3 className="font-semibold">Orders:</h3>
            {recentOrders.map((order, index) => (
              <div key={order.id} className="border border-gray-700 p-3 mt-2 rounded">
                <p>#{order.orderNumber} - {order.status} - ${order.total}</p>
                <p>Items: {order.items?.length || 0}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-gray-900 p-6 rounded-lg">
        <h2 className="text-xl font-semibold mb-4">Console Logs</h2>
        <p>Check browser console for detailed debug information</p>
      </div>
    </div>
  );
}
