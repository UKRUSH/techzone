"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

// Helper function to get or create guest session ID
const getGuestSessionId = () => {
  if (typeof window === 'undefined') return null; // Server-side
  
  let sessionId = localStorage.getItem('guestSessionId');
  const urlParams = new URLSearchParams(window.location.search);
  const urlSessionId = urlParams.get('sessionId');
  
  if (urlSessionId) {
    localStorage.setItem('guestSessionId', urlSessionId);
    return urlSessionId;
  }
  
  if (!sessionId) {
    sessionId = 'guest-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('guestSessionId', sessionId);
  }
  
  return sessionId;
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: Array.isArray(action.payload) ? action.payload : [], loading: false };
    case 'ADD_ITEM':
      const existingItems = Array.isArray(state.items) ? state.items : [];
      const existingItemIndex = existingItems.findIndex(item => item.variant.id === action.payload.variant.id);
      
      if (existingItemIndex !== -1) {
        const updatedItems = [...existingItems];
        updatedItems[existingItemIndex] = action.payload;
        return { ...state, items: updatedItems };
      } else {
        return { ...state, items: [...existingItems, action.payload] };
      }
    case 'UPDATE_ITEM':
      const currentItems = Array.isArray(state.items) ? state.items : [];
      return { ...state, items: currentItems.map(item => item.id === action.payload.id ? action.payload : item) };
    case 'REMOVE_ITEM':
      const itemsToFilter = Array.isArray(state.items) ? state.items : [];
      return { ...state, items: itemsToFilter.filter(item => item.id !== action.payload) };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false });

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
      } else {
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
      const requestBody = { variantId, quantity };
      if (status === 'unauthenticated') {
        requestBody.sessionId = getGuestSessionId();
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        const cartItem = result.success ? result.data : result;
        dispatch({ type: 'ADD_ITEM', payload: cartItem });
        return { success: true, item: cartItem };
      } else {
        const error = await response.json().catch(() => ({ error: 'Unknown error' }));
        return { success: false, error: error.error || 'Failed to add to cart' };
      }
    } catch (error) {
      console.error('Cart error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const requestBody = { itemId, quantity, sessionId: getGuestSessionId() };
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        if (quantity <= 0) {
          dispatch({ type: 'REMOVE_ITEM', payload: itemId });
          return { success: true, message: 'Item removed' };
        } else {
          const updatedItem = result.success ? result.data : result;
          dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
          return { success: true, item: updatedItem };
        }
      } else {
        const error = await response.json().catch(() => ({ error: 'Update failed' }));
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Update error:', error);
      return { success: false, error: 'Network error' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const sessionId = getGuestSessionId();
      const url = `/api/cart?itemId=${encodeURIComponent(itemId)}&sessionId=${encodeURIComponent(sessionId)}`;
      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        return { success: true };
      } else {
        const error = await response.json().catch(() => ({ error: 'Remove failed' }));
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  const clearCart = async () => {
    try {
      const sessionId = getGuestSessionId();
      const url = sessionId ? `/api/cart?clearAll=true&sessionId=${encodeURIComponent(sessionId)}` : '/api/cart?clearAll=true';
      const response = await fetch(url, { method: 'DELETE' });

      if (response.ok) {
        dispatch({ type: 'CLEAR_CART' });
        return { success: true };
      } else {
        const error = await response.json().catch(() => ({ error: 'Clear failed' }));
        return { success: false, error: error.error };
      }
    } catch (error) {
      return { success: false, error: 'Network error' };
    }
  };

  useEffect(() => {
    if (status !== 'loading') {
      fetchCart();
    }
  }, [status]);

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
