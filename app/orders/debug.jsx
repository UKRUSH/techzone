import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

// Debug component to show exactly what's happening in the orders hook
export default function OrdersDebugPage() {
  const { data: session, status } = useSession();
  const [debugInfo, setDebugInfo] = useState({});
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log('🔍 Session status changed:', status);
    console.log('🔍 Session data:', session);
    
    setDebugInfo(prev => ({
      ...prev,
      sessionStatus: status,
      sessionUser: session?.user?.email || 'No user',
      timestamp: new Date().toISOString()
    }));

    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      setIsLoading(false);
      setError('Not authenticated');
      return;
    }

    if (session?.user) {
      fetchOrdersWithDebug();
    }
  }, [session, status]);

  const fetchOrdersWithDebug = async () => {
    try {
      console.log('🔍 Starting fetchOrders...');
      setIsLoading(true);
      setError(null);
      
      const startTime = Date.now();
      const response = await fetch('/api/user/orders');
      const endTime = Date.now();
      
      console.log(`🔍 API Response: ${response.status} (${endTime - startTime}ms)`);
      
      setDebugInfo(prev => ({
        ...prev,
        apiStatus: response.status,
        apiTime: `${endTime - startTime}ms`,
        fetchAttempted: true
      }));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('🔍 API Error:', errorText);
        throw new Error(`Failed to fetch orders: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('🔍 API Data received:', data);
      
      setOrders(data.orders || []);
      setDebugInfo(prev => ({
        ...prev,
        ordersCount: data.orders?.length || 0,
        ordersData: data.orders?.slice(0, 2) // First 2 orders for debug
      }));
      
    } catch (err) {
      console.error('🔍 Fetch error:', err);
      setError(err.message);
      setDebugInfo(prev => ({
        ...prev,
        fetchError: err.message
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace', backgroundColor: '#000', color: '#fff' }}>
      <h1>Orders Debug Page</h1>
      
      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#111', border: '1px solid #333' }}>
        <h2>Debug Info</h2>
        <pre>{JSON.stringify(debugInfo, null, 2)}</pre>
      </div>

      <div style={{ marginBottom: '20px', padding: '10px', backgroundColor: '#111', border: '1px solid #333' }}>
        <h2>Current State</h2>
        <p><strong>Session Status:</strong> {status}</p>
        <p><strong>User Email:</strong> {session?.user?.email || 'None'}</p>
        <p><strong>Is Loading:</strong> {isLoading.toString()}</p>
        <p><strong>Error:</strong> {error || 'None'}</p>
        <p><strong>Orders Count:</strong> {orders.length}</p>
      </div>

      {isLoading && (
        <div style={{ padding: '20px', backgroundColor: '#001a00', border: '1px solid #00ff00' }}>
          <h3>🔄 LOADING...</h3>
        </div>
      )}

      {error && (
        <div style={{ padding: '20px', backgroundColor: '#1a0000', border: '1px solid #ff0000' }}>
          <h3>❌ ERROR: {error}</h3>
        </div>
      )}

      {!isLoading && !error && orders.length === 0 && (
        <div style={{ padding: '20px', backgroundColor: '#1a1a00', border: '1px solid #ffff00' }}>
          <h3>⚠️ NO ORDERS FOUND</h3>
        </div>
      )}

      {orders.length > 0 && (
        <div style={{ padding: '20px', backgroundColor: '#001a1a', border: '1px solid #00ffff' }}>
          <h3>✅ ORDERS FOUND ({orders.length})</h3>
          {orders.map((order, index) => (
            <div key={order.id} style={{ marginBottom: '10px', padding: '10px', backgroundColor: '#002222' }}>
              <p><strong>#{order.orderNumber}</strong> - {order.status} - ${order.total}</p>
              <p>Items: {order.items?.map(item => item.name).join(', ')}</p>
              <p>Date: {new Date(order.date).toLocaleDateString()}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ marginTop: '20px', padding: '10px', backgroundColor: '#111', border: '1px solid #333' }}>
        <h2>Manual Actions</h2>
        <button 
          onClick={fetchOrdersWithDebug}
          style={{ padding: '10px', backgroundColor: '#444', color: '#fff', border: '1px solid #666' }}
        >
          Refetch Orders
        </button>
      </div>
    </div>
  );
}
