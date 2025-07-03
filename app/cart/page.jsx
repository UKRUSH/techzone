"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  ShoppingCart, 
  Minus, 
  Plus, 
  Trash2, 
  ArrowLeft,
  Package,
  CreditCard,
  Loader2
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";

export default function CartPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { 
    items, 
    loading, 
    cartTotal, 
    cartItemCount,
    updateCartItem, 
    removeFromCart, 
    clearCart 
  } = useCart();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    const result = await updateCartItem(itemId, newQuantity);
    if (!result.success) {
      console.error('Failed to update cart item:', result.error);
      // You could show a toast notification here
    }
  };

  const handleRemoveItem = async (itemId) => {
    const result = await removeFromCart(itemId);
    if (!result.success) {
      console.error('Failed to remove cart item:', result.error);
      // You could show a toast notification here
    }
  };

  const handleClearCart = async () => {
    const result = await clearCart();
    if (!result.success) {
      console.error('Failed to clear cart:', result.error);
      // You could show a toast notification here
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-background">
          <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
            <Link href="/" className="hover:text-primary">Home</Link>
            <span>/</span>
            <span className="text-white">Shopping Cart</span>
          </div>

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => router.back()}
                className="text-gray-400 hover:text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Continue Shopping
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <ShoppingCart className="w-5 h-5 text-primary" />
              <h1 className="text-2xl font-bold text-white">
                Shopping Cart ({cartItemCount})
              </h1>
            </div>
          </div>

          {items.length === 0 ? (
            // Empty cart
            <div className="text-center py-16">
              <Package className="w-24 h-24 text-gray-400 mx-auto mb-6" />
              <h2 className="text-2xl font-semibold text-white mb-4">Your cart is empty</h2>
              <p className="text-gray-400 mb-8">
                Add some amazing PC components to get started!
              </p>
              <Link href="/products">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Browse Products
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2 space-y-4">
                <Card className="bg-card border-gray-800">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-white">Cart Items</CardTitle>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleClearCart}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Clear All
                    </Button>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center space-x-4 p-4 border border-gray-800 rounded-lg">
                        {/* Product Image */}
                        <div className="flex-shrink-0">
                          <div className="w-20 h-20 bg-gray-800 rounded-lg overflow-hidden">
                            <Image
                              src={item.variant.product.images?.[0] || "/placeholder-product.jpg"}
                              alt={item.variant.product.name}
                              width={80}
                              height={80}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <Link href={`/products/${item.variant.product.id}`}>
                            <h3 className="font-semibold text-white hover:text-primary line-clamp-2">
                              {item.variant.product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-gray-400 mt-1">
                            {item.variant.product.brand?.name} • {item.variant.product.category?.name}
                          </p>
                          <div className="flex items-center space-x-2 mt-2">
                            <span className="text-lg font-bold text-primary">
                              ${item.variant.price.toFixed(2)}
                            </span>
                            {item.variant.totalStock > 0 ? (
                              <Badge variant="secondary" className="text-xs">
                                {item.variant.totalStock} in stock
                              </Badge>
                            ) : (
                              <Badge variant="destructive" className="text-xs">
                                Out of stock
                              </Badge>
                            )}
                          </div>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                            className="w-8 h-8 p-0"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>
                          <span className="w-12 text-center text-white font-medium">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                            disabled={item.quantity >= item.variant.totalStock}
                            className="w-8 h-8 p-0"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Subtotal & Remove */}
                        <div className="flex flex-col items-end space-y-2">
                          <span className="text-lg font-bold text-white">
                            ${(item.variant.price * item.quantity).toFixed(2)}
                          </span>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Order Summary */}
              <div className="space-y-6">
                <Card className="bg-card border-gray-800">
                  <CardHeader>
                    <CardTitle className="text-white">Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between text-gray-400">
                      <span>Subtotal ({cartItemCount} items)</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                      <span>Tax</span>
                      <span>${(cartTotal * 0.08).toFixed(2)}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between text-xl font-bold text-white">
                      <span>Total</span>
                      <span>${(cartTotal * 1.08).toFixed(2)}</span>
                    </div>
                  </CardContent>
                </Card>

                <Button 
                  size="lg" 
                  className="w-full bg-primary hover:bg-primary/90 text-black font-semibold"
                >
                  <CreditCard className="w-5 h-5 mr-2" />
                  Proceed to Checkout
                </Button>

                {/* Security & Guarantees */}
                <Card className="bg-card border-gray-800">
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <Package className="w-4 h-4" />
                      <span>Free shipping on orders over $50</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <ShoppingCart className="w-4 h-4" />
                      <span>30-day return policy</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-400">
                      <CreditCard className="w-4 h-4" />
                      <span>Secure checkout</span>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
