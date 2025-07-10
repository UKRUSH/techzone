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

// Initial state
const initialState = {
  items: [],
  loading: true
};

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { data: session, status } = useSession();

  // Fetch cart items when user logs in
  useEffect(() => {
    if (status === 'authenticated' && session?.user) {
      // Merge guest cart with user cart, then fetch user cart
      mergeGuestCartWithUserCart();
    } else if (status === 'unauthenticated') {
      // Load guest cart from localStorage
      const guestCart = loadGuestCart();
      dispatch({ type: 'SET_CART', payload: guestCart });
      dispatch({ type: 'SET_LOADING', payload: false });
    } else if (status === 'loading') {
      // Keep loading state while session is being determined
      dispatch({ type: 'SET_LOADING', payload: true });
    }
  }, [session, status]);

  // Safety timeout to prevent infinite loading
  useEffect(() => {
    const timeout = setTimeout(() => {
      if (state.loading) {
        console.warn('Cart loading timeout reached, forcing loading to false');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    }, 10000); // 10 second timeout

    return () => clearTimeout(timeout);
  }, [state.loading]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      
      // Include sessionId for guest users
      let url = '/api/cart';
      if (status === 'unauthenticated') {
        const sessionId = getGuestSessionId();
        url = `/api/cart?sessionId=${encodeURIComponent(sessionId)}`;
      }
      
      const response = await fetch(url);
      
      if (response.ok) {
        const result = await response.json();
        // Handle the API response structure { success: true, data: cartItems }
        const cartItems = result.success ? result.data : result;
        dispatch({ type: 'SET_CART', payload: Array.isArray(cartItems) ? cartItems : [] });
      } else {
        console.error('Failed to fetch cart, status:', response.status);
        dispatch({ type: 'SET_CART', payload: [] });
        dispatch({ type: 'SET_LOADING', payload: false });
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
      // Use API for both authenticated and guest users
      const requestBody = { variantId, quantity };
      
      // Include sessionId for guest users
      if (status === 'unauthenticated') {
        requestBody.sessionId = getGuestSessionId();
      }

      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const result = await response.json();
        // Handle the API response structure { success: true, data: cartItem }
        const cartItem = result.success ? result.data : result;
        dispatch({ type: 'ADD_ITEM', payload: cartItem });
        return { success: true, item: cartItem };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      return { success: false, error: 'Failed to add item to cart' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    console.log('🔧 CartProvider: updateCartItem called');
    console.log('  - itemId:', itemId, '(type:', typeof itemId, ')');
    console.log('  - quantity:', quantity);
    
    const sessionId = getGuestSessionId();
    console.log('  - sessionId:', sessionId);
    
    // Debug current cart state
    console.log('  - Current cart items count:', state.items.length);
    console.log('  - Current cart items:', state.items.map(item => ({
      id: item.id,
      name: item.variant?.product?.name,
      quantity: item.quantity
    })));
    
    try {
      // Use the main cart route with PUT method
      const url = `/api/cart`;
      console.log('  - Making PUT request to:', url);
      
      const requestBody = { 
        itemId: itemId, 
        quantity: quantity,
        sessionId: sessionId
      };
      console.log('  - Request body:', requestBody);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      console.log('🔧 CartProvider: API response status:', response.status);
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ CartProvider: successful response:', result);
        
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
        const errorText = await response.text();
        console.log('❌ CartProvider: API error response text:', errorText);
        
        let error;
        try {
          error = JSON.parse(errorText);
        } catch (e) {
          error = { error: errorText };
        }
        
        console.log('❌ CartProvider: parsed error:', error);
        
        // If cart item not found, try to refresh cart to sync state
        if (error.error && error.error.includes('Cart item not found')) {
          console.log('🔄 Cart item not found - attempting to refresh cart to sync state...');
          await fetchCart();
          
          // After refresh, check if the item now exists and retry once
          const refreshedItem = state.items.find(item => item.id === itemId);
          if (refreshedItem) {
            console.log('🔄 Item found after refresh, retrying update...');
            return await updateCartItem(itemId, quantity);
          } else {
            console.log('⚠️ Item still not found after refresh - it may have been removed from another session');
          }
        }
        
        return { success: false, error: error.error || errorText };
      }
    } catch (error) {
      console.error('❌ CartProvider: Network error updating cart item:', error);
      return { success: false, error: `Network error: ${error.message}` };
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
      const url = `/api/cart?clearAll=true&sessionId=${encodeURIComponent(sessionId)}`;
      
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

  // Save cart to localStorage for guest users
  const saveGuestCart = (cartItems) => {
    if (typeof window !== 'undefined' && status === 'unauthenticated') {
      localStorage.setItem('guestCart', JSON.stringify(cartItems));
    }
  };

  // Load cart from localStorage for guest users
  const loadGuestCart = () => {
    if (typeof window !== 'undefined') {
      const guestCart = localStorage.getItem('guestCart');
      return guestCart ? JSON.parse(guestCart) : [];
    }
    return [];
  };

  // Merge guest cart with user cart after login
  const mergeGuestCartWithUserCart = async () => {
    try {
      if (typeof window !== 'undefined') {
        const guestCart = loadGuestCart();
        if (guestCart.length > 0) {
          // Add each guest cart item to user's cart
          for (const item of guestCart) {
            await fetch('/api/cart', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ 
                variantId: item.variant?.id || item.variantId, 
                quantity: item.quantity 
              }),
            });
          }
          // Clear guest cart after merging
          localStorage.removeItem('guestCart');
        }
      }
      // Always fetch cart after attempting to merge (even if guest cart was empty)
      await fetchCart();
    } catch (error) {
      console.error('Error merging guest cart:', error);
      // Even if merge fails, still fetch cart to set loading to false
      await fetchCart();
    }
  };

  // Calculate cart totals with safety checks
  const cartTotal = Array.isArray(state.items) ? state.items.reduce((total, item) => {
    const price = item?.variant?.price || 0;
    const quantity = item?.quantity || 0;
    return total + (price * quantity);
  }, 0) : 0;

  const cartItemCount = Array.isArray(state.items) ? state.items.reduce((count, item) => {
    return count + (item?.quantity || 0);
  }, 0) : 0;

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
