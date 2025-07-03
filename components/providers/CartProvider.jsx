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
        items: action.payload,
        loading: false
      };
    case 'ADD_ITEM':
      const existingItemIndex = state.items.findIndex(
        item => item.variant.id === action.payload.variant.id
      );
      
      if (existingItemIndex !== -1) {
        // Update existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex] = action.payload;
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item
        return {
          ...state,
          items: [...state.items, action.payload]
        };
      }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: state.items.map(item =>
          item.id === action.payload.id ? action.payload : item
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: state.items.filter(item => item.id !== action.payload)
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
        const cartItems = await response.json();
        dispatch({ type: 'SET_CART', payload: cartItems });
      } else {
        console.error('Failed to fetch cart');
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
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
        const cartItem = await response.json();
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
    try {
      const response = await fetch(`/api/cart/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      if (response.ok) {
        const updatedItem = await response.json();
        dispatch({ type: 'UPDATE_ITEM', payload: updatedItem });
        return { success: true, item: updatedItem };
      } else {
        const error = await response.json();
        return { success: false, error: error.error };
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      return { success: false, error: 'Failed to update cart item' };
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

  // Calculate cart totals
  const cartTotal = state.items.reduce((total, item) => {
    return total + (item.variant.price * item.quantity);
  }, 0);

  const cartItemCount = state.items.reduce((count, item) => {
    return count + item.quantity;
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
