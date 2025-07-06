"use client";

import { createContext, useContext, useReducer, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

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
      fetchCart();
    } else if (status === 'unauthenticated') {
      dispatch({ type: 'CLEAR_CART' });
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  }, [session, status]);

  const fetchCart = async () => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      const response = await fetch('/api/cart');
      
      if (response.ok) {
        const result = await response.json();
        // Handle the API response structure { success: true, data: cartItems }
        const cartItems = result.success ? result.data : result;
        dispatch({ type: 'SET_CART', payload: Array.isArray(cartItems) ? cartItems : [] });
      } else {
        console.error('Failed to fetch cart');
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
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ variantId, quantity }),
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
    console.log('CartProvider: updateCartItem called with:', { itemId, quantity, itemIdType: typeof itemId });
    
    try {
      const encodedItemId = encodeURIComponent(itemId);
      const url = `/api/cart/${encodedItemId}`;
      console.log('CartProvider: Making request to:', url);
      
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      console.log('CartProvider: API response status:', response.status);
      console.log('CartProvider: API response headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const result = await response.json();
        console.log('CartProvider: successful response:', result);
        // Handle the API response structure { success: true, data: updatedItem }
        const updatedItem = result.success ? result.data : result;
        dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
        return { success: true, item: updatedItem };
      } else {
        const errorText = await response.text();
        console.log('CartProvider: API error response text:', errorText);
        
        let error;
        try {
          error = JSON.parse(errorText);
        } catch (e) {
          error = { error: errorText };
        }
        
        console.log('CartProvider: parsed error:', error);
        return { success: false, error: error.error || errorText };
      }
    } catch (error) {
      console.error('CartProvider: Network error updating cart item:', error);
      return { success: false, error: `Network error: ${error.message}` };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
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
      const response = await fetch('/api/cart', {
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
