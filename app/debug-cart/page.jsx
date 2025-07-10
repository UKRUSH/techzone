"use client";

import { useEffect, useState } from 'react';

export default function DebugCartPage() {
  const [cartData, setCartData] = useState(null);
  const [error, setError] = useState(null);
  const [updateResult, setUpdateResult] = useState(null);

  const sessionId = 'debug-session-123';

  const fetchCart = async () => {
    try {
      const response = await fetch(`/api/cart?sessionId=${sessionId}`);
      const result = await response.json();
      setCartData(result);
      console.log('Cart data:', result);
    } catch (err) {
      setError(err.message);
    }
  };

  const addTestItem = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          variantId: '1',
          quantity: 2,
          sessionId: sessionId
        })
      });
      const result = await response.json();
      console.log('Add item result:', result);
      await fetchCart(); // Refresh cart
    } catch (err) {
      setError(err.message);
    }
  };

  const updateItem = async (itemId, quantity) => {
    try {
      console.log('Updating item:', { itemId, quantity, sessionId });
      const response = await fetch('/api/cart', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemId: itemId,
          quantity: quantity,
          sessionId: sessionId
        })
      });
      const result = await response.json();
      console.log('Update item result:', result);
      setUpdateResult(result);
      await fetchCart(); // Refresh cart
    } catch (err) {
      setError(err.message);
    }
  };

  const clearCart = async () => {
    try {
      const response = await fetch('/api/cart', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clearAll: true,
          sessionId: sessionId
        })
      });
      await fetchCart(); // Refresh cart
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return (
    <div className="container mx-auto p-4 bg-black text-white min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Debug Cart Page</h1>
      
      <div className="mb-4">
        <button 
          onClick={fetchCart}
          className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
        >
          Refresh Cart
        </button>
        <button 
          onClick={addTestItem}
          className="bg-green-500 text-white px-4 py-2 rounded mr-2"
        >
          Add Test Item
        </button>
        <button 
          onClick={clearCart}
          className="bg-red-500 text-white px-4 py-2 rounded"
        >
          Clear Cart
        </button>
      </div>

      {error && (
        <div className="bg-red-900 text-red-200 p-3 rounded mb-4">
          Error: {error}
        </div>
      )}

      {updateResult && (
        <div className="bg-purple-900 text-purple-200 p-3 rounded mb-4">
          <h3>Last Update Result:</h3>
          <pre>{JSON.stringify(updateResult, null, 2)}</pre>
        </div>
      )}

      {cartData && (
        <div className="bg-zinc-900 p-4 rounded">
          <h2 className="text-xl font-semibold mb-2">Cart Data:</h2>
          <pre className="text-sm">{JSON.stringify(cartData, null, 2)}</pre>
          
          {cartData.data && cartData.data.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Cart Items:</h3>
              {cartData.data.map((item, index) => (
                <div key={index} className="bg-zinc-800 p-3 rounded mb-2">
                  <p><strong>ID:</strong> {item.id} (type: {typeof item.id})</p>
                  <p><strong>Name:</strong> {item.variant?.product?.name || 'Unknown'}</p>
                  <p><strong>Quantity:</strong> {item.quantity}</p>
                  <div className="mt-2">
                    <button 
                      onClick={() => updateItem(item.id, item.quantity + 1)}
                      className="bg-green-600 text-white px-2 py-1 rounded mr-2 text-sm"
                    >
                      +1
                    </button>
                    <button 
                      onClick={() => updateItem(item.id, Math.max(1, item.quantity - 1))}
                      className="bg-yellow-600 text-white px-2 py-1 rounded mr-2 text-sm"
                    >
                      -1
                    </button>
                    <button 
                      onClick={() => updateItem(item.id, 5)}
                      className="bg-blue-600 text-white px-2 py-1 rounded text-sm"
                    >
                      Set to 5
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
