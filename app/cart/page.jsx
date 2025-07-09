"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Loader2,
  Shield,
  Truck,
  RotateCcw,
  Star,
  Gift,
  Percent,
  Zap,
  CheckCircle,
  AlertCircle,
  Heart,
  Share2,
  Clock,
  Sparkles
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
    clearCart,
    fetchCart
  } = useCart();

  // Animation variants
  const fadeIn = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 }
  };

  const slideIn = {
    initial: { opacity: 0, x: -20 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 20 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  const handleQuantityChange = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    console.log('Cart page: handleQuantityChange called with:', { itemId, newQuantity, itemIdType: typeof itemId });
    console.log('Cart page: Current cart items:', items.map(item => ({ id: item.id, name: item.variant?.product?.name, quantity: item.quantity })));
    
    try {
      const result = await updateCartItem(itemId, newQuantity);
      console.log('Cart page: updateCartItem result:', result);
      if (!result.success) {
        // Show user-friendly error message
        console.error('Failed to update cart item:', result.error);
        
        // Try to refresh the cart to get the latest state
        console.log('Cart page: Attempting to refresh cart due to update failure');
        try {
          await fetchCart();
          alert(`Error: ${result.error || 'Failed to update item quantity'}. Cart has been refreshed.`);
        } catch (refreshError) {
          console.error('Cart page: Failed to refresh cart:', refreshError);
          alert(`Error: ${result.error || 'Failed to update item quantity'}. Please refresh the page.`);
        }
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
      alert('Error: Unable to update item quantity. Please try again.');
    }
  };

  const handleRemoveItem = async (itemId) => {
    try {
      const result = await removeFromCart(itemId);
      if (!result.success) {
        console.error('Failed to remove cart item:', result.error);
        alert(`Error: ${result.error || 'Failed to remove item'}`);
      }
    } catch (error) {
      console.error('Error removing cart item:', error);
      alert('Error: Unable to remove item. Please try again.');
    }
  };

  const handleClearCart = async () => {
    if (!confirm('Are you sure you want to clear your entire cart?')) {
      return;
    }
    
    try {
      const result = await clearCart();
      if (!result.success) {
        console.error('Failed to clear cart:', result.error);
        alert(`Error: ${result.error || 'Failed to clear cart'}`);
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      alert('Error: Unable to clear cart. Please try again.');
    }
  };

  const handleProceedToCheckout = () => {
    if (items.length === 0) {
      alert('Your cart is empty. Please add items before proceeding to checkout.');
      return;
    }
    
    // For now, navigate to a checkout page or show a message
    // You can replace this with actual checkout logic
    router.push('/checkout');
  };

  // Loading state with premium design
  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen relative overflow-hidden">
          {/* Premium Loading Background */}
          <div className="absolute inset-0 bg-black" />
          
          {/* Animated Background Elements */}
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-yellow-400/8 blur-3xl animate-pulse-slower" />
          
          {/* Circuit Pattern */}
          <div className="absolute inset-0 opacity-5">
            <div 
              className="w-full h-full"
              style={{
                backgroundImage: `
                  linear-gradient(rgba(255, 193, 7, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(255, 193, 7, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '100px 100px'
              }}
            />
          </div>

          <div className="container mx-auto px-4 py-8 relative z-10">
            <div className="flex items-center justify-center py-32">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                className="relative"
              >
                <div className="w-16 h-16 border-4 border-yellow-400/20 border-t-yellow-400 rounded-full" />
                <div className="absolute inset-2 w-12 h-12 border-4 border-yellow-400/10 border-b-yellow-400/50 rounded-full animate-spin" style={{ animationDirection: 'reverse' }} />
              </motion.div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (status === 'unauthenticated') {
    return null; // Will redirect
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden pt-32">{/* Added pt-32 for header space */}
        {/* Premium Black Background with Yellow Accents */}
        <div className="absolute inset-0 bg-black" />
        
        {/* Subtle Yellow Glow Orbs */}
        <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl animate-pulse-slow" />
        <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-yellow-400/8 blur-3xl animate-pulse-slower" />
        
        {/* Minimal Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255, 193, 7, 0.1) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255, 193, 7, 0.1) 1px, transparent 1px)
              `,
              backgroundSize: '100px 100px'
            }}
          />
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <ShoppingCart className="absolute top-32 left-1/4 w-8 h-8 text-yellow-400/20 animate-float" style={{ animationDelay: '0s' }} />
          <Package className="absolute top-48 right-1/4 w-6 h-6 text-yellow-400/20 animate-float" style={{ animationDelay: '2s' }} />
          <Zap className="absolute bottom-32 left-1/3 w-7 h-7 text-yellow-400/20 animate-float" style={{ animationDelay: '4s' }} />
          <Gift className="absolute bottom-48 right-1/3 w-6 h-6 text-yellow-400/20 animate-float" style={{ animationDelay: '6s' }} />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Enhanced Breadcrumb */}
          <motion.div 
            className="flex items-center space-x-2 text-sm mb-8"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="text-gray-400 hover:text-yellow-400 transition-colors duration-300">
              Home
            </Link>
            <span className="text-yellow-400">•</span>
            <span className="text-yellow-400 font-medium">Shopping Cart</span>
          </motion.div>

          {/* Premium Header Section */}
          <motion.div 
            className="mb-12 text-center relative"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Header Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-yellow-400/5 to-black/50 blur-3xl rounded-full transform scale-150" />
            
            <div className="relative z-10">
              {/* Enhanced Badge */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="mb-6"
              >
                <Badge variant="secondary" className="mb-4 bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 shadow-2xl shadow-yellow-400/10 px-6 py-3 text-base font-black tracking-wide backdrop-blur-md relative overflow-hidden">
                  <ShoppingCart className="w-5 h-5 mr-2 animate-pulse" />
                  YOUR CART
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-shimmer-slow" />
                </Badge>
              </motion.div>
              
              {/* Enhanced Title */}
              <div className="flex items-center justify-center gap-6 mb-6">
                <motion.div 
                  className="p-4 rounded-2xl bg-black/50 border border-yellow-400/30 shadow-2xl shadow-yellow-400/10 relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Package className="h-8 w-8 text-yellow-400 drop-shadow-lg relative z-10" />
                  <div className="absolute inset-0 bg-yellow-400/5 animate-pulse" />
                </motion.div>
                
                <motion.h1 
                  className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-yellow-400 to-white drop-shadow-2xl relative"
                  whileHover={{ scale: 1.02 }}
                  transition={{ duration: 0.3 }}
                >
                  <span className="relative inline-block">
                    CART ({cartItemCount})
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/10 to-transparent animate-shimmer-slow" />
                  </span>
                </motion.h1>
                
                <motion.div 
                  className="p-4 rounded-2xl bg-black/50 border border-yellow-400/30 shadow-2xl shadow-yellow-400/10 relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: -5 }}
                  transition={{ duration: 0.3 }}
                >
                  <CreditCard className="h-8 w-8 text-yellow-400 drop-shadow-lg relative z-10" />
                  <div className="absolute inset-0 bg-yellow-400/5 animate-pulse" />
                </motion.div>
              </div>

              {/* Continue Shopping Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <Button
                  variant="outline"
                  onClick={() => router.back()}
                  className="bg-transparent border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/50 transition-all duration-300 px-6 py-3"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {items.length === 0 ? (
              // Enhanced Empty Cart
              <motion.div 
                className="text-center py-16"
                variants={fadeIn}
                initial="initial"
                animate="animate"
                exit="exit"
                transition={{ duration: 0.6 }}
              >
                <Card className="max-w-2xl mx-auto bg-gradient-to-br from-zinc-900 to-black border-zinc-800 overflow-hidden relative">
                  {/* Background Effects */}
                  <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-50" />
                  
                  <CardContent className="p-12 relative z-10">
                    <motion.div
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                      className="mb-8"
                    >
                      <div className="relative">
                        <Package className="w-24 h-24 text-yellow-400/60 mx-auto" />
                        <div className="absolute inset-0 bg-yellow-400/20 blur-xl rounded-full" />
                      </div>
                    </motion.div>
                    
                    <h2 className="text-3xl font-bold text-white mb-4">Your Cart is Empty</h2>
                    <p className="text-gray-400 mb-8 text-lg leading-relaxed">
                      Ready to build your dream PC? Browse our premium components and start adding items to your cart!
                    </p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      {[
                        { icon: Zap, text: "Lightning Fast", subtext: "Quick checkout" },
                        { icon: Shield, text: "Secure Shopping", subtext: "Protected payments" },
                        { icon: Truck, text: "Free Shipping", subtext: "On orders $50+" }
                      ].map((feature, index) => (
                        <motion.div
                          key={index}
                          className="p-4 bg-zinc-800/50 rounded-lg border border-zinc-700/50"
                          whileHover={{ scale: 1.05 }}
                          transition={{ duration: 0.2 }}
                        >
                          <feature.icon className="h-6 w-6 text-yellow-400 mx-auto mb-2" />
                          <p className="text-sm font-medium text-white">{feature.text}</p>
                          <p className="text-xs text-gray-400">{feature.subtext}</p>
                        </motion.div>
                      ))}
                    </div>
                    
                    <Link href="/products">
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold shadow-lg hover:shadow-xl hover:shadow-yellow-400/25 transition-all duration-300 relative overflow-hidden group">
                          <ShoppingCart className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                          Start Shopping
                          
                          {/* Button shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Button>
                      </motion.div>
                    </Link>
                  </CardContent>
                </Card>
              </motion.div>
            ) : (
              // Enhanced Cart Content
              <motion.div 
                className="grid grid-cols-1 xl:grid-cols-3 gap-8"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {/* Enhanced Cart Items */}
                <div className="xl:col-span-2 space-y-6">
                  {/* Cart Header */}
                  <motion.div variants={fadeIn}>
                    <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-50" />
                      
                      <CardHeader className="flex flex-row items-center justify-between relative z-10">
                        <CardTitle className="text-white flex items-center gap-2 text-xl">
                          <Package className="h-6 w-6 text-yellow-400" />
                          Cart Items ({cartItemCount})
                        </CardTitle>
                        <motion.div
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleClearCart}
                            className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-300"
                          >
                            <Trash2 className="w-4 h-4 mr-2" />
                            Clear All
                          </Button>
                        </motion.div>
                      </CardHeader>
                    </Card>
                  </motion.div>

                  {/* Cart Items List */}
                  <motion.div className="space-y-4" variants={staggerContainer}>
                    {items.map((item, index) => (
                      <motion.div
                        key={item.id}
                        variants={slideIn}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        whileHover={{ scale: 1.01 }}
                        className="group"
                      >
                        <Card className="bg-gradient-to-br from-black via-zinc-900 to-black border border-zinc-800 hover:border-yellow-400/30 transition-all duration-500 overflow-hidden relative">
                          {/* Card Background Effects */}
                          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                          
                          {/* Top accent */}
                          <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500" />
                          
                          <CardContent className="p-6 relative z-10">
                            <div className="flex items-center space-x-6">
                              {/* Enhanced Product Image */}
                              <div className="flex-shrink-0 relative group/image">
                                <div className="w-24 h-24 bg-zinc-800/50 rounded-xl overflow-hidden border border-zinc-700/50 group-hover/image:border-yellow-400/50 transition-all duration-300">
                                  <Image
                                    src={item.variant.product.images?.[0] || "/placeholder-product.jpg"}
                                    alt={item.variant.product.name}
                                    width={96}
                                    height={96}
                                    className="w-full h-full object-cover group-hover/image:scale-110 transition-transform duration-500"
                                  />
                                  
                                  {/* Image overlay on hover */}
                                  <div className="absolute inset-0 bg-yellow-400/10 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300" />
                                </div>
                                
                                {/* Floating action buttons */}
                                <div className="absolute -top-2 -right-2 flex gap-1 opacity-0 group-hover/image:opacity-100 transition-opacity duration-300">
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-6 h-6 bg-yellow-400 text-black rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <Heart className="w-3 h-3" />
                                  </motion.button>
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="w-6 h-6 bg-zinc-700 text-white rounded-full flex items-center justify-center shadow-lg"
                                  >
                                    <Share2 className="w-3 h-3" />
                                  </motion.button>
                                </div>
                              </div>

                              {/* Enhanced Product Info */}
                              <div className="flex-1 min-w-0">
                                <Link href={`/products/${item.variant.product.id}`}>
                                  <motion.h3 
                                    className="font-semibold text-white hover:text-yellow-400 line-clamp-2 text-lg group-hover:text-yellow-400 transition-colors duration-300"
                                    whileHover={{ x: 5 }}
                                    transition={{ duration: 0.2 }}
                                  >
                                    {item.variant.product.name}
                                  </motion.h3>
                                </Link>
                                
                                <div className="flex items-center gap-2 mt-2 mb-3">
                                  <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20 text-xs">
                                    {item.variant.product.brand?.name}
                                  </Badge>
                                  <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20 text-xs">
                                    {item.variant.product.category?.name}
                                  </Badge>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <span className="text-2xl font-bold text-yellow-400">
                                    Rs. {item.variant.price.toFixed(2)}
                                  </span>
                                  {item.variant.totalStock > 0 ? (
                                    <Badge className="bg-green-500/10 text-green-400 border-green-500/20">
                                      <CheckCircle className="w-3 h-3 mr-1" />
                                      {item.variant.totalStock} in stock
                                    </Badge>
                                  ) : (
                                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20">
                                      <AlertCircle className="w-3 h-3 mr-1" />
                                      Out of stock
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Enhanced Quantity Controls */}
                              <div className="flex flex-col items-center space-y-3">
                                <div className="flex items-center space-x-3 bg-zinc-800/80 rounded-xl p-3 border border-zinc-700/50 shadow-lg">
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                                      disabled={item.quantity <= 1}
                                      className="w-8 h-8 p-0 rounded bg-zinc-700 hover:bg-yellow-400 text-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-zinc-700 disabled:hover:text-white"
                                    >
                                      <Minus className="w-3 h-3" />
                                    </Button>
                                  </motion.div>
                                  
                                  <div className="w-16 text-center bg-zinc-700/50 rounded-lg py-2 px-3 border border-zinc-600">
                                    <span className="text-white font-bold text-xl">{item.quantity}</span>
                                  </div>
                                  
                                  <motion.div
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                  >
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                                      disabled={item.quantity >= item.variant.totalStock}
                                      className="w-8 h-8 p-0 rounded bg-zinc-700 hover:bg-yellow-400 text-white hover:text-black transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:bg-zinc-700 disabled:hover:text-white"
                                    >
                                      <Plus className="w-3 h-3" />
                                    </Button>
                                  </motion.div>
                                </div>
                              </div>

                              {/* Enhanced Subtotal & Actions */}
                              <div className="flex flex-col items-end space-y-3 min-w-0">
                                <motion.span 
                                  className="text-2xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-300"
                                  whileHover={{ scale: 1.05 }}
                                >
                                  Rs. {(item.variant.price * item.quantity).toFixed(2)}
                                </motion.span>
                                
                                <motion.div
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="text-red-400 hover:text-red-300 hover:bg-red-400/10 transition-all duration-300 relative group/remove"
                                  >
                                    <Trash2 className="w-4 h-4 group-hover/remove:animate-bounce" />
                                  </Button>
                                </motion.div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                </div>

                {/* Enhanced Order Summary */}
                <motion.div 
                  className="space-y-6"
                  variants={fadeIn}
                  transition={{ delay: 0.2 }}
                >
                  {/* Order Summary Card */}
                  <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 overflow-hidden sticky top-8">
                    {/* Background Effects */}
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-50" />
                    
                    <CardHeader className="relative z-10">
                      <CardTitle className="text-white flex items-center gap-2 text-xl">
                        <CreditCard className="h-6 w-6 text-yellow-400" />
                        Order Summary
                      </CardTitle>
                    </CardHeader>
                    
                    <CardContent className="space-y-6 relative z-10">
                      {/* Summary Details */}
                      <div className="space-y-4">
                        <div className="flex justify-between text-gray-300">
                          <span>Subtotal ({cartItemCount} items)</span>
                          <span className="font-medium">Rs. {cartTotal.toFixed(2)}</span>
                        </div>
                        
                        <div className="flex justify-between text-gray-300">
                          <span className="flex items-center gap-2">
                            <Truck className="w-4 h-4 text-green-400" />
                            Shipping
                          </span>
                          <span className="font-medium text-green-400">Free</span>
                        </div>
                        
                        <div className="flex justify-between text-gray-300">
                          <span>VAT (18%)</span>
                          <span className="font-medium">Rs. {(cartTotal * 0.18).toFixed(2)}</span>
                        </div>
                        
                        <Separator className="bg-zinc-700" />
                        
                        <div className="flex justify-between text-2xl font-bold text-white">
                          <span>Total</span>
                          <span className="text-yellow-400">Rs. {(cartTotal * 1.18).toFixed(2)}</span>
                        </div>
                      </div>

                      {/* Checkout Button */}
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Button 
                          size="lg" 
                          onClick={handleProceedToCheckout}
                          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-bold text-lg py-6 shadow-lg hover:shadow-xl hover:shadow-yellow-400/25 transition-all duration-300 relative overflow-hidden group"
                        >
                          <CreditCard className="w-5 h-5 mr-2 group-hover:animate-bounce" />
                          Proceed to Checkout
                          
                          {/* Button shimmer effect */}
                          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        </Button>
                      </motion.div>

                      {/* Security Features */}
                      <div className="space-y-3 pt-4 border-t border-zinc-700">
                        {[
                          { icon: Shield, text: "256-bit SSL encryption", color: "text-green-400" },
                          { icon: RotateCcw, text: "30-day return policy", color: "text-blue-400" },
                          { icon: Zap, text: "Lightning fast checkout", color: "text-yellow-400" }
                        ].map((feature, index) => (
                          <motion.div
                            key={index}
                            className="flex items-center space-x-3 text-sm"
                            whileHover={{ x: 5 }}
                            transition={{ duration: 0.2 }}
                          >
                            <feature.icon className={`w-4 h-4 ${feature.color}`} />
                            <span className="text-gray-300">{feature.text}</span>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>

                  {/* Promotional Card */}
                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Card className="bg-gradient-to-br from-yellow-400/10 to-yellow-500/5 border-yellow-400/30 overflow-hidden relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent" />
                      
                      <CardContent className="p-6 relative z-10">
                        <div className="flex items-center gap-3 mb-3">
                          <Sparkles className="h-6 w-6 text-yellow-400" />
                          <h3 className="font-bold text-yellow-400">Special Offer!</h3>
                        </div>
                        <p className="text-gray-300 text-sm mb-4">
                          Free premium assembly service on orders over $1000
                        </p>
                        <div className="flex items-center gap-2 text-xs text-yellow-400">
                          <Clock className="w-3 h-3" />
                          <span>Limited time offer</span>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
