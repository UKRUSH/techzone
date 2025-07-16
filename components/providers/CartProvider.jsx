"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

// Helper function to clear stale cart data
const clearStaleCartData = () => {
  if (typeof window !== 'undefined') {
    // Clear any cached cart data that might be causing issues
    const keys = Object.keys(localStorage);
    keys.forEach(key => {
      if (key.includes('cart') || key.includes('Cart')) {
        localStorage.removeItem(key);
        console.log('🧹 Cleared stale cart data:', key);
      }
    });
  }
};

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
    console.log('🛒 CartProvider: updateCartItem called', { itemId, quantity });
    
    // First check if the item exists in our current state
    const currentItem = state.items.find(item => item.id === itemId);
    if (!currentItem) {
      console.warn('🛒 CartProvider: Item not found in current state:', itemId);
      return { success: false, error: 'Item not found in cart', code: 'ITEM_NOT_FOUND' };
    }
    
    console.log('🛒 CartProvider: Found item in state:', {
      id: currentItem.id,
      currentQuantity: currentItem.quantity,
      newQuantity: quantity
    });
    
    try {
      const requestBody = { itemId, quantity, sessionId: getGuestSessionId() };
      console.log('🛒 CartProvider: Request body:', requestBody);
      
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestBody),
      });

      console.log('🛒 CartProvider: Response received', {
        ok: response.ok,
        status: response.status,
        statusText: response.statusText
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
        let error = { error: 'Update failed' };
        
        console.log('🔍 CartProvider: Non-OK response details:', {
          status: response.status,
          statusText: response.statusText,
          headers: Object.fromEntries(response.headers.entries()),
          url: response.url
        });
        
        try {
          const responseText = await response.text();
          console.log('🔍 CartProvider: Raw response text:', responseText);
          
          if (responseText.trim()) {
            try {
              error = JSON.parse(responseText);
              console.log('🔍 CartProvider: Parsed error:', error);
            } catch (jsonError) {
              console.error('🔍 CartProvider: JSON parse failed:', jsonError);
              error = { error: `Invalid JSON response: ${responseText.substring(0, 100)}` };
            }
          } else {
            console.log('🔍 CartProvider: Empty response body');
            error = { error: `Empty response with status ${response.status}` };
          }
        } catch (parseError) {
          console.error('🔍 CartProvider: Failed to read response:', parseError);
          error = { error: `Response read error: ${parseError.message}` };
        }
        
        // Handle 404 errors specifically - item doesn't exist in database
        if (response.status === 404) {
          console.warn('🛒 CartProvider: Cart item not found in database, removing from local state');
          
          // Remove the stale item from local state immediately
          dispatch({ type: 'REMOVE_ITEM', payload: itemId });
          
          error = { 
            error: 'This item is no longer available in your cart. It has been removed.', 
            code: 'ITEM_NOT_FOUND' 
          };
          
          // Force a cart refresh to sync with database
          setTimeout(() => {
            console.log('🔄 CartProvider: Refreshing cart after removing stale item');
            fetchCart();
          }, 500);
          
          return { success: false, error: error.error, code: error.code };
        }
        
        // Create meaningful errors based on other status codes
        if (!error.error || error.error === 'Update failed') {
          if (response.status === 403) {
            error = { 
              error: 'Cart session mismatch. Please refresh the page.', 
              code: 'SESSION_MISMATCH' 
            };
          } else if (response.status === 400) {
            error = { 
              error: 'Invalid request. Please try again.', 
              code: 'BAD_REQUEST' 
            };
          } else if (response.status >= 500) {
            error = { 
              error: 'Server error. Please try again later.', 
              code: 'SERVER_ERROR' 
            };
          } else {
            error = { 
              error: `Request failed with status ${response.status}: ${response.statusText}`,
              code: 'UNKNOWN_ERROR'
            };
          }
        }
        
        console.error('Cart update failed:', error);
        
        // If it's a session mismatch, trigger cart refresh
        if (error.code === 'SESSION_MISMATCH') {
          console.log('🔄 Triggering cart refresh due to session mismatch');
          clearStaleCartData();
          setTimeout(() => {
            dispatch({ type: 'SET_LOADING', payload: true });
            fetchCart();
          }, 500);
        }
        
        return { success: false, error: error.error, code: error.code };
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
      // Clear any potentially stale cart data on load
      clearStaleCartData();
      
      // Force a fresh cart fetch
      console.log('🔄 CartProvider: Forcing fresh cart fetch on load');
      fetchCart();
    }
  }, [status]);

  // Additional effect to handle session changes and refresh cart
  useEffect(() => {
    if (status === 'authenticated' || status === 'unauthenticated') {
      console.log('🔄 CartProvider: Session status changed, refreshing cart');
      
      // Clear local storage cart data when session changes
      clearStaleCartData();
      
      // Wait a bit then refresh cart
      setTimeout(() => {
        fetchCart();
      }, 100);
    }
  }, [session?.user?.email, status]); // Trigger when user email changes (login/logout)

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
