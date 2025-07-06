"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products/fallback');
      if (response.ok) {
        const result = await response.json();
        setProducts(result.success ? result.data : []);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-yellow-500">Products Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage your product inventory</p>
      </div>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Products ({products.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Product inventory management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {products.length > 0 ? (
              products.slice(0, 10).map((product) => (
                <div key={product.id} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-gray-400 text-sm">{product.description}</p>
                      <p className="text-yellow-400 font-medium mt-1">
                        ${product.price || 0}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded">
                        In Stock
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No products found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
