import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

export function useUserData() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return; // Still loading session
    
    if (status === 'unauthenticated') {
      setIsLoading(false);
      setError('Not authenticated');
      setUserData(null);
      return;
    }

    if (session?.user) {
      fetchUserData();
    } else {
      setIsLoading(false);
      setError('No user session');
      setUserData(null);
    }
  }, [session, status]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/user');
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        } else if (response.status === 404) {
          throw new Error('User not found');
        } else {
          throw new Error(`Failed to fetch user data: ${response.status}`);
        }
      }
      
      const data = await response.json();
      setUserData(data);
    } catch (err) {
      console.error('Error fetching user data:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserData = async (updateData) => {
    try {
      const response = await fetch('/api/user', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      const result = await response.json();
      
      // Refresh user data after update
      await fetchUserData();
      
      return result;
    } catch (err) {
      console.error('Error updating user data:', err);
      throw err;
    }
  };

  return {
    userData,
    isLoading,
    error,
    refetch: fetchUserData,
    updateUser: updateUserData,
    isAuthenticated: status === 'authenticated'
  };
}

export function useUserOrders(filters = {}) {
  const { data: session, status } = useSession();
  const [orders, setOrders] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      setIsLoading(false);
      setError('Not authenticated');
      return;
    }

    if (session?.user) {
      fetchOrders();
    }
  }, [session, status, filters]);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const response = await fetch(`/api/user/orders?${params}`);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`Orders API Error: ${response.status} ${response.statusText}`, errorText);
        throw new Error(`Failed to fetch orders: ${response.status} (${response.statusText})`);
      }
      
      const data = await response.json();
      setOrders(data.orders || []);
      setPagination(data.pagination || null);
    } catch (err) {
      console.error('Error fetching orders:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    orders,
    pagination,
    isLoading,
    error,
    refetch: fetchOrders,
    isAuthenticated: status === 'authenticated'
  };
}
