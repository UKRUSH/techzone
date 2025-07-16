"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

// Helper function to get or create guest session ID
const getGuestSessionId = () => {
  if (typeof window === 'undefined') return null; // Server-side
  
  // Check if there's a stored session ID first (for consistency)
  let sessionId = localStorage.getItem('guestSessionId');
  
  // Always check URL and use it if available (but update stored ID)
  const urlParams = new URLSearchParams(window.location.search);
  const urlSessionId = urlParams.get('sessionId');
  
  if (urlSessionId) {
    console.log('🔧 URL sessionId detected:', urlSessionId);
    // If URL sessionId is different from stored, update storage but log the change
    if (sessionId && sessionId !== urlSessionId) {
      console.log('⚠️ SessionId mismatch - stored:', sessionId, 'URL:', urlSessionId);
      console.log('🔄 Updating stored sessionId to match URL');
    }
    localStorage.setItem('guestSessionId', urlSessionId);
    return urlSessionId;
  }
  
  // Fall back to stored sessionId or create new one
  if (!sessionId) {
    sessionId = 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestSessionId', sessionId);
    console.log('🔧 Generated new sessionId:', sessionId);
  } else {
    console.log('🔧 Using localStorage sessionId:', sessionId);
  }
  
  return sessionId;
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return {
        ...state,
        items: Array.isArray(action.payload) ? action.payload : [],
        loading: false
      };
    case 'ADD_ITEM':
      const existingItems = Array.isArray(state.items) ? state.items : [];
      const existingItemIndex = existingItems.findIndex(
        item => item.variant.id === action.payload.variant.id
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...existingItems];
        updatedItems[existingItemIndex] = action.payload;
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...existingItems, action.payload]
        };
      }
    case 'UPDATE_ITEM':
      const currentItems = Array.isArray(state.items) ? state.items : [];
      return {
        ...state,
        items: currentItems.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'REMOVE_ITEM':
      const itemsToFilter = Array.isArray(state.items) ? state.items : [];
      return {
        ...state,
        items: itemsToFilter.filter(item => item.id !== action.payload)
      };
    case 'CLEAR_CART':
      return {
        ...state,
        items: []
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload
      };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [state, dispatch] = useReducer(cartReducer, {
    items: [],
    loading: false
  });

  // Fetch cart from API
  const fetchCart = async () => {
    dispatch({ type: 'SET_LOADING', payload: true });
    
    try {
      const sessionId = getGuestSessionId();
      const url = sessionId ? `/api/cart?sessionId=${encodeURIComponent(sessionId)}` : '/api/cart';
      
      const response = await fetch(url);
      
      if (response.ok) {
        const data = await response.json();
        const cartItems = Array.isArray(data) ? data : (data.items || []);
        dispatch({ type: 'SET_CART', payload: cartItems });
        console.log(`✅ Fetched ${cartItems.length} cart items`);
      } else {
        console.error('Failed to fetch cart:', response.status);
        dispatch({ type: 'SET_CART', payload: [] });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
      dispatch({ type: 'SET_CART', payload: [] });
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const addToCart = async (variantId, quantity = 1) => {
    try {
      console.log('🛒 CartProvider: addToCart called', { variantId, quantity });
      
      // Use API for both authenticated and guest users
      const requestBody = { variantId, quantity };
      
      // Include sessionId for guest users
      if (status === 'unauthenticated') {
        requestBody.sessionId = getGuestSessionId();
      }

      console.log('🛒 CartProvider: Request body', requestBody);

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🛒 CartProvider: Response status', response.status, response.statusText);

      if (response.ok) {
        const result = await response.json();
        console.log('🛒 CartProvider: Response result', result);
        
        // Handle the API response structure { success: true, data: cartItem }
        const cartItem = result.success ? result.data : result;
        dispatch({ type: 'ADD_ITEM', payload: cartItem });
        return { success: true, item: cartItem };
      } else {
        let errorMessage = 'Unknown error';
        try {
          const error = await response.json();
          console.log('🛒 CartProvider: Error response', error);
          errorMessage = error.error || error.message || 'Failed to add to cart';
        } catch (parseError) {
          console.log('🛒 CartProvider: Could not parse error response', parseError);
          errorMessage = `HTTP ${response.status}: ${response.statusText}`;
        }
        return { success: false, error: errorMessage };
      }
    } catch (error) {
      console.error('🛒 CartProvider: Network error adding to cart:', error);
      return { success: false, error: 'Network error: Failed to add item to cart' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    console.log('🛒 CartProvider: updateCartItem called', { itemId, quantity });
    
    try {
      const requestBody = { 
        itemId: itemId, 
        quantity: quantity,
        sessionId: getGuestSessionId()
      };
      console.log('🛒 CartProvider: Request body:', requestBody);
      
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🛒 CartProvider: API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ CartProvider: Successful response:', result);
        
        if (quantity <= 0) {
          // Item was removed
          dispatch({ type: 'REMOVE_ITEM', payload: itemId });
          return { success: true, message: 'Item removed from cart' };
        } else {
          // Item was updated
          const updatedItem = result.success ? result.data : result;
          dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
          return { success: true, item: updatedItem };
        }
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        console.log('❌ CartProvider: API error response:', errorData);
        
        return { success: false, error: errorData.error || 'Failed to update item' };
      }
    } catch (error) {
      console.error('🛒 CartProvider: Network error:', error);
      return { success: false, error: 'Network error: Failed to update item' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const sessionId = getGuestSessionId();
      const url = `/api/cart?itemId=${encodeURIComponent(itemId)}&sessionId=${encodeURIComponent(sessionId)}`;
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error removing from cart:', error);
      return { success: false, error: 'Failed to remove item from cart' };
    }
  };

  const clearCart = async () => {
    try {
      const sessionId = getGuestSessionId();
      const url = sessionId ? `/api/cart?clearAll=true&sessionId=${encodeURIComponent(sessionId)}` : '/api/cart?clearAll=true';
      
      const response = await fetch(url, {
        method: 'DELETE',
      });

      if (response.ok) {
        dispatch({ type: 'CLEAR_CART' });
        return { success: true };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      return { success: false, error: 'Failed to clear cart' };
    }
  };

  // Load cart when component mounts or session changes
  useEffect(() => {
    if (status !== 'loading') {
      fetchCart();
    }
  }, [status]);

  // Calculate totals
  const cartTotal = state.items.reduce((total, item) => {
    const price = item.variant?.price || 0;
    const quantity = item.quantity || 0;
    return total + (price * quantity);
  }, 0);

  const cartItemCount = state.items.reduce((count, item) => {
    return count + (item.quantity || 0);
  }, 0);

  const value = {
    items: state.items,
    loading: state.loading,
    cartTotal,
    cartItemCount,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    fetchCart
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
