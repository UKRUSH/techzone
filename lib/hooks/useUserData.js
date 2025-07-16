import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useSession } from 'next-auth/react';
import { useFastAPI, useDebounce } from '../performance';

// Cache for user data to prevent repeated API calls
const userDataCache = new Map();

// Function to clear all cache - useful for sign out/sign in
export const clearAllUserCache = () => {
  userDataCache.clear();
  console.log('🧹 All user cache cleared');
};

export function useUserData() {
  const { data: session, status } = useSession();
  const [userData, setUserData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const prevEmailRef = useRef(null);
  
  // Cache key for current user
  const cacheKey = useMemo(() => 
    session?.user?.email ? `user-${session.user.email}` : null, 
    [session?.user?.email]
  );

  const fetchUserData = useCallback(async (forceRefresh = false) => {
    if (!cacheKey) return;
    
    // Check cache first for instant loading (skip if force refresh)
    if (!forceRefresh && userDataCache.has(cacheKey)) {
      const cachedData = userDataCache.get(cacheKey);
      setUserData(cachedData);
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      
      // Fast API call with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // Reduced timeout for speed
      
      const response = await fetch('/api/user', {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Not authenticated');
        } else if (response.status === 404) {
          throw new Error('User not found');
        } else if (response.status === 503) {
          setError('Database temporarily unavailable. Please try again later.');
          return null;
        } else {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      }
      
      const result = await response.json();
      
      // Always clear old cache when fetching new data
      if (userDataCache.has(cacheKey)) {
        userDataCache.delete(cacheKey);
      }
      
      // Cache the result for 5 minutes
      userDataCache.set(cacheKey, result);
      setTimeout(() => userDataCache.delete(cacheKey), 5 * 60 * 1000);
      
      setUserData(result);
      setError(null);
      
    } catch (err) {
      if (err.name === 'AbortError') {
        setError('Request timeout - please try again');
      } else {
        console.error('Failed to fetch user data:', err);
        setError(err.message || 'Failed to fetch user data');
      }
      setUserData(null);
    } finally {
      setIsLoading(false);
    }
  }, [cacheKey]);

  useEffect(() => {
    if (status === 'loading') return;
    
    // Check if user email changed (sign out and sign in with different account)
    const currentEmail = session?.user?.email;
    const emailChanged = prevEmailRef.current && prevEmailRef.current !== currentEmail;
    
    if (status === 'unauthenticated') {
      // Clear ALL cache when user signs out
      userDataCache.clear();
      setIsLoading(false);
      setError('Not authenticated');
      setUserData(null);
      prevEmailRef.current = null;
      return;
    }

    if (session?.user?.email && cacheKey) {
      // Force refresh if email changed or first load
      const forceRefresh = emailChanged || !prevEmailRef.current;
      if (forceRefresh) {
        console.log('🔄 User session changed, forcing data refresh...', {
          prevEmail: prevEmailRef.current,
          currentEmail: currentEmail,
          emailChanged
        });
        userDataCache.clear(); // Clear all cache on user change
      }
      
      fetchUserData(forceRefresh);
      prevEmailRef.current = currentEmail;
    } else {
      setIsLoading(false);
      setError('No user session');
      setUserData(null);
      prevEmailRef.current = null;
    }
  }, [session?.user?.email, status, cacheKey, fetchUserData]);

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

  // Function to clear cache and force refresh
  const clearCacheAndRefresh = useCallback(async () => {
    if (cacheKey) {
      userDataCache.delete(cacheKey);
    }
    await fetchUserData(true); // Force refresh
  }, [cacheKey, fetchUserData]);

  return {
    userData,
    isLoading,
    error,
    refetch: clearCacheAndRefresh, // Use the cache-clearing version
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
  
  // Use ref to track previous filters to avoid unnecessary re-renders
  const prevFiltersRef = useRef();
  const abortControllerRef = useRef();
  const requestTimeoutRef = useRef();
  const filtersChanged = JSON.stringify(filters) !== JSON.stringify(prevFiltersRef.current);
  
  // Update ref when filters actually change
  if (filtersChanged) {
    prevFiltersRef.current = filters;
  }

  // Memoize fetchOrders to prevent it from changing on every render
  const fetchOrders = useCallback(async () => {
    try {
      console.log('🔍 fetchOrders - Starting...');
      
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      // Clear any previous timeout
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
      
      setIsLoading(true);
      setError(null);
      
      // Use the current filters from ref to avoid dependency issues
      const currentFilters = prevFiltersRef.current || {};
      const params = new URLSearchParams();
      Object.entries(currentFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });

      const url = `/api/user/orders?${params}`;
      console.log('🔄 Fetching orders from:', url);
      console.log('📋 Session user:', session?.user?.email);

      // Create AbortController for timeout - give database more time to respond
      const controller = new AbortController();
      abortControllerRef.current = controller;
      
      const timeoutId = setTimeout(() => {
        controller.abort();
      }, 20000); // Increased to 20 seconds to handle connection recovery
      requestTimeoutRef.current = timeoutId;

      const response = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      clearTimeout(timeoutId);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error(`❌ Orders API Error: ${response.status} ${response.statusText}`, errorText);
        
        // Better error handling for 503 errors
        if (response.status === 503) {
          throw new Error(`Database temporarily unavailable - please wait a moment and try again`);
        }
        
        throw new Error(`Failed to fetch orders: ${response.status} (${response.statusText})`);
      }
      
      const data = await response.json();
      console.log('✅ Orders data received:', data);
      console.log('📊 Orders count:', data.orders?.length || 0);
      console.log('🔍 Setting orders state with:', data.orders);
      
      setOrders(data.orders || []);
      setPagination(data.pagination || null);
      console.log('🔍 Orders state should be updated now');
    } catch (err) {
      // Debug: Log error details to understand what we're catching
      console.log('🔍 Error details:', { 
        name: err.name, 
        message: err.message, 
        type: typeof err,
        isAbortError: err.name === 'AbortError',
        toString: err.toString()
      });
      
      // Check for any timeout-related errors more broadly
      const isTimeoutError = err.name === 'AbortError' || 
                            err.message?.includes('timeout') || 
                            err.message?.includes('aborted') ||
                            err.toString().includes('timeout');
      
      if (isTimeoutError) {
        console.log('⏱️ Orders request timed out after 20 seconds - this indicates database performance issues');
        setError('Database connection timeout - please try again'); // Only show timeout after 20 seconds
      } else {
        console.error('💥 Error fetching orders:', err);
        setError(err.message);
      }
    } finally {
      console.log('🔍 Setting isLoading to false');
      setIsLoading(false);
      abortControllerRef.current = null;
      requestTimeoutRef.current = null;
    }
  }, [session?.user?.email]); // Remove filters from dependencies, use ref instead

  // Debug state changes
  useEffect(() => {
    console.log('🔍 useUserOrders - State Update:', {
      ordersLength: orders.length,
      isLoading,
      error,
      sessionStatus: status,
      hasSession: !!session?.user
    });
  }, [orders, isLoading, error, status, session]);

  useEffect(() => {
    console.log('🔍 useUserOrders - Effect triggered:', {
      status,
      sessionUser: session?.user?.email,
      filtersChanged
    });
    
    if (status === 'loading') {
      console.log('🔍 Session still loading, waiting...');
      return;
    }
    
    if (status === 'unauthenticated') {
      console.log('🔍 User not authenticated, setting state');
      setIsLoading(false);
      setError('Not authenticated');
      return;
    }

    if (session?.user) {
      console.log('🔍 User authenticated, fetching orders...');
      fetchOrders();
    }
  }, [session?.user?.email, status, filtersChanged]); // Removed fetchOrders from dependencies

  // Cleanup function to cancel any pending requests
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (requestTimeoutRef.current) {
        clearTimeout(requestTimeoutRef.current);
      }
    };
  }, []);

  return {
    orders,
    pagination,
    isLoading,
    error,
    refetch: fetchOrders,
    isAuthenticated: status === 'authenticated'
  };
}
