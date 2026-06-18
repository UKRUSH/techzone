"use client";

import { createContext, useContext, useReducer, useEffect, useCallback, useRef } from 'react';
import { useSession } from 'next-auth/react';

const CartContext = createContext();

const getGuestSessionId = () => {
  if (typeof window === 'undefined') return null;
  let sessionId = localStorage.getItem('guestSessionId');
  const urlSessionId = new URLSearchParams(window.location.search).get('sessionId');
  if (urlSessionId) {
    localStorage.setItem('guestSessionId', urlSessionId);
    return urlSessionId;
  }
  if (!sessionId) {
    sessionId = 'guest-' + Date.now() + '-' + Math.random().toString(36).substring(2, 11);
    localStorage.setItem('guestSessionId', sessionId);
  }
  return sessionId;
};

const cartReducer = (state, action) => {
  switch (action.type) {
    case 'SET_CART':
      return { ...state, items: Array.isArray(action.payload) ? action.payload : [], loading: false };
    case 'ADD_ITEM': {
      const existing = Array.isArray(state.items) ? state.items : [];
      const idx = existing.findIndex(i => i.variant?.id === action.payload.variant?.id);
      if (idx !== -1) {
        const updated = [...existing];
        updated[idx] = action.payload;
        return { ...state, items: updated };
      }
      return { ...state, items: [...existing, action.payload] };
    }
    case 'UPDATE_ITEM':
      return {
        ...state,
        items: (Array.isArray(state.items) ? state.items : []).map(i =>
          i.id === action.payload.id ? action.payload : i
        )
      };
    case 'REMOVE_ITEM':
      return {
        ...state,
        items: (Array.isArray(state.items) ? state.items : []).filter(i => i.id !== action.payload)
      };
    case 'CLEAR_CART':
      return { ...state, items: [] };
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    default:
      return state;
  }
};

export function CartProvider({ children }) {
  const { status } = useSession();
  const [state, dispatch] = useReducer(cartReducer, { items: [], loading: false });
  const fetchedForStatus = useRef(null);
  const fetchingRef = useRef(false);

  const fetchCart = useCallback(async () => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    dispatch({ type: 'SET_LOADING', payload: true });

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 8000);
    try {
      const sessionId = getGuestSessionId();
      const url = sessionId ? `/api/cart?sessionId=${encodeURIComponent(sessionId)}` : '/api/cart';
      const res = await fetch(url, { signal: controller.signal });
      if (res.ok) {
        const data = await res.json();
        let items = [];
        if (data.success && Array.isArray(data.data)) items = data.data;
        else if (Array.isArray(data)) items = data;
        else if (data.items && Array.isArray(data.items)) items = data.items;
        dispatch({ type: 'SET_CART', payload: items });
      } else {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    } catch {
      dispatch({ type: 'SET_LOADING', payload: false });
    } finally {
      clearTimeout(timer);
      fetchingRef.current = false;
    }
  }, []);

  // Only fetch once per unique resolved status value
  useEffect(() => {
    if (status !== 'loading' && status !== fetchedForStatus.current) {
      fetchedForStatus.current = status;
      fetchCart();
    }
  }, [status, fetchCart]);

  const addToCart = async (variantId, quantity = 1) => {
    try {
      const body = { variantId, quantity };
      if (status === 'unauthenticated') body.sessionId = getGuestSessionId();
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      if (res.ok) {
        const result = await res.json();
        const cartItem = result.success ? result.data : result;
        dispatch({ type: 'ADD_ITEM', payload: cartItem });
        return { success: true, item: cartItem };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || err.message || 'Failed to add to cart' };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const updateCartItem = async (itemId, quantity) => {
    try {
      const res = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ itemId, quantity, sessionId: getGuestSessionId() }),
      });
      if (res.ok) {
        const result = await res.json();
        if (quantity <= 0) {
          dispatch({ type: 'REMOVE_ITEM', payload: itemId });
          return { success: true };
        }
        dispatch({ type: 'UPDATE_ITEM', payload: result.success ? result.data : result });
        return { success: true };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error || 'Failed to update', code: err.code };
    } catch {
      return { success: false, error: 'Network error' };
    }
  };

  const removeFromCart = async (itemId) => {
    try {
      const sessionId = getGuestSessionId();
      const res = await fetch(
        `/api/cart?itemId=${encodeURIComponent(itemId)}&sessionId=${encodeURIComponent(sessionId)}`,
        { method: 'DELETE' }
      );
      if (res.ok) {
        dispatch({ type: 'REMOVE_ITEM', payload: itemId });
        return { success: true };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error };
    } catch {
      return { success: false, error: 'Failed to remove item' };
    }
  };

  const clearCart = async () => {
    try {
      const sessionId = getGuestSessionId();
      const url = sessionId
        ? `/api/cart?clearAll=true&sessionId=${encodeURIComponent(sessionId)}`
        : '/api/cart?clearAll=true';
      const res = await fetch(url, { method: 'DELETE' });
      if (res.ok) {
        dispatch({ type: 'CLEAR_CART' });
        return { success: true };
      }
      const err = await res.json().catch(() => ({}));
      return { success: false, error: err.error };
    } catch {
      return { success: false, error: 'Failed to clear cart' };
    }
  };

  const cartTotal = state.items.reduce((sum, i) => sum + ((i.variant?.price || 0) * (i.quantity || 0)), 0);
  const cartItemCount = state.items.reduce((sum, i) => sum + (i.quantity || 0), 0);

  return (
    <CartContext.Provider value={{
      items: state.items,
      loading: state.loading,
      cartTotal,
      cartItemCount,
      addToCart,
      updateCartItem,
      removeFromCart,
      clearCart,
      fetchCart,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within a CartProvider');
  return context;
}
