"use client";

import { useState, useEffect, useMemo } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useUserOrders } from "@/lib/hooks/useUserData";
import { 
  Package, 
  Search, 
  Filter,
  Calendar,
  Truck,
  CheckCircle,
  Clock,
  XCircle,
  Eye,
  Download,
  ArrowLeft,
  MapPin,
  CreditCard,
  Star,
  Loader2,
  AlertCircle
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export default function OrdersPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showSlowMessage, setShowSlowMessage] = useState(false);

  // Debounce search term to avoid too many API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 500); // 500ms delay

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearchTerm, statusFilter]);

  // Memoize filters to prevent infinite re-renders
  const ordersFilters = useMemo(() => ({
    page: currentPage,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: debouncedSearchTerm || undefined
  }), [currentPage, statusFilter, debouncedSearchTerm]);

  // Use real user orders data
  const { orders, pagination, isLoading, error, isAuthenticated } = useUserOrders(ordersFilters);

  // Show slow message only after 12 seconds of loading (since API timeout is now 20s)
  useEffect(() => {
    let timer;
    if (isAuthenticated && isLoading && !orders.length) {
      timer = setTimeout(() => {
        setShowSlowMessage(true);
      }, 12000); // Wait 12 seconds before showing slow message (API has 20s timeout)
    } else {
      setShowSlowMessage(false);
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [isAuthenticated, isLoading, orders.length]);

  // Scroll to top when component mounts or when navigating back from other pages
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  // Scroll to top when viewing order details
  useEffect(() => {
    if (selectedOrder) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [selectedOrder]);

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return <CheckCircle className="w-4 h-4 text-green-400" />;
      case "confirmed":
      case "processing":
        return <Clock className="w-4 h-4 text-yellow-400" />;
      case "shipped":
        return <Truck className="w-4 h-4 text-blue-400" />;
      case "cancelled":
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <Package className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "confirmed":
      case "processing":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "shipped":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  // Loading state - show loading only when session is loading
  if (status === 'loading') {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center page-with-header">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="text-white">Loading your session...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Orders loading state - only for authenticated users
  if (isAuthenticated && isLoading && !orders.length) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center page-with-header">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="text-white">Loading your orders...</p>
            {showSlowMessage && (
              <div className="mt-4 p-4 bg-yellow-400/10 border border-yellow-400/20 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Orders are taking longer than usual to load. Please wait...
                </p>
              </div>
            )}
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state - but distinguish between auth errors and timeout errors
  if (error && !isAuthenticated) {
    // Real authentication error
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center page-with-header">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Authentication Required
            </h2>
            <p className="text-gray-400 mb-6">
              Please sign in to view your orders.
            </p>
            <Button 
              onClick={() => router.push('/auth/signin')}
              className="bg-yellow-400 hover:bg-yellow-300 text-black"
            >
              Sign In
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Timeout/database error state - but user is authenticated  
  if (error && isAuthenticated && (error.includes('timeout') || error.includes('Database connection timeout'))) {
    // Only show error after trying for a while, and not during initial load
    if (!isLoading) {
      return (
        <>
          <Header />
          <div className="min-h-screen bg-black flex items-center justify-center page-with-header">
            <div className="text-center max-w-md mx-auto px-4">
              <Clock className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-white mb-2">
                Orders Taking Longer Than Expected
              </h2>
              <p className="text-gray-400 mb-6">
                The database is taking longer than usual. Your orders will load shortly.
              </p>
              <Button 
                onClick={() => window.location.reload()}
                className="bg-yellow-400 hover:bg-yellow-300 text-black"
              >
                Try Again
              </Button>
            </div>
          </div>
          <Footer />
        </>
      );
    }
    // If still loading, don't show error - let the loading state handle it
    return null;
  }

  // Other errors for authenticated users
  if (error && isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center page-with-header">
          <div className="text-center max-w-md mx-auto px-4">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              Error Loading Orders
            </h2>
            <p className="text-gray-400 mb-6">
              {error}
            </p>
            <Button 
              onClick={() => window.location.reload()}
              className="bg-yellow-400 hover:bg-yellow-300 text-black"
            >
              Refresh Page
            </Button>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (selectedOrder) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black relative page-with-header" id="order-details-top">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
          
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 max-w-7xl">
            {/* Back Button */}
            <Button
              onClick={() => setSelectedOrder(null)}
              variant="outline"
              className="mb-6 border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Orders
            </Button>

            {/* Order Details */}
            <div className="space-y-6">
              {/* Order Header */}
              <Card className="bg-black/80 border border-yellow-400/30">
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2">
                        Order #{selectedOrder.orderNumber || selectedOrder.confirmationNumber || 'Unknown'}
                      </h1>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-400">
                        <span>Placed on {selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : 'Unknown date'}</span>
                        <span className="hidden sm:inline">•</span>
                        <span>${(selectedOrder.total || 0).toFixed(2)}</span>
                        {selectedOrder.customerName && (
                          <>
                            <span className="hidden sm:inline">•</span>
                            <span>Customer: {selectedOrder.customerName}</span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <Badge className={`${getStatusColor(selectedOrder.status)} border font-medium w-fit`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-2 capitalize">{selectedOrder.status}</span>
                      </Badge>
                      <Button variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 w-full sm:w-auto">
                        <Download className="w-4 h-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Order Items */}
                <div className="lg:col-span-2">
                  <Card className="bg-black/80 border border-yellow-400/30">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 flex items-center">
                        <Package className="w-5 h-5 mr-2" />
                        Order Items
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {selectedOrder.items && selectedOrder.items.length > 0 ? selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-yellow-400/5 rounded-lg border border-yellow-400/10">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{item.name || item.productName || 'Unknown Item'}</h3>
                              <div className="text-gray-400 text-sm space-y-1">
                                <p>Quantity: {item.quantity || 0}</p>
                                <p>Unit Price: ${(item.price || 0).toFixed(2)}</p>
                                {item.total && (
                                  <p>Item Total: ${item.total.toFixed(2)}</p>
                                )}
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-yellow-400">${((item.price || 0) * (item.quantity || 0)).toFixed(2)}</p>
                              {selectedOrder.status === 'delivered' && (
                                <Button variant="outline" size="sm" className="mt-2 text-xs border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                                  <Star className="w-3 h-3 mr-1" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        )) : (
                          <div className="text-center py-8">
                            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No items found in this order</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Order Details Sidebar */}
                <div className="space-y-6">
                  {/* Shipping Information */}
                  <Card className="bg-black/80 border border-yellow-400/30">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 flex items-center text-lg">
                        <Truck className="w-5 h-5 mr-2" />
                        Shipping
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Address</p>
                        <div className="text-white text-sm space-y-1">
                          <p>{selectedOrder.shipping?.address || selectedOrder.shippingAddress || 'No address available'}</p>
                          {selectedOrder.shipping?.address2 && (
                            <p>{selectedOrder.shipping.address2}</p>
                          )}
                          <p>
                            {selectedOrder.shipping?.city || selectedOrder.shippingCity || ''} 
                            {selectedOrder.shipping?.district && `, ${selectedOrder.shipping.district}`}
                          </p>
                          {selectedOrder.shipping?.postalCode && (
                            <p>Postal Code: {selectedOrder.shipping.postalCode}</p>
                          )}
                          {selectedOrder.shipping?.country && (
                            <p>{selectedOrder.shipping.country}</p>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Method</p>
                        <p className="text-white text-sm">{selectedOrder.shipping?.method || 'Standard Shipping'}</p>
                      </div>
                      {selectedOrder.shipping?.trackingNumber && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Tracking Number</p>
                          <p className="text-yellow-400 text-sm font-mono">{selectedOrder.shipping.trackingNumber}</p>
                        </div>
                      )}
                      {selectedOrder.shipping?.estimatedDelivery && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Est. Delivery</p>
                          <p className="text-white text-sm">{new Date(selectedOrder.shipping.estimatedDelivery).toLocaleDateString()}</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Payment Information */}
                  <Card className="bg-black/80 border border-yellow-400/30">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 flex items-center text-lg">
                        <CreditCard className="w-5 h-5 mr-2" />
                        Payment
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Method</p>
                        <p className="text-white text-sm capitalize">{selectedOrder.payment?.method || selectedOrder.paymentMethod || 'Not specified'}</p>
                      </div>
                      
                      {/* Order Summary Breakdown */}
                      <div className="space-y-2 pt-2 border-t border-gray-700">
                        {selectedOrder.payment?.subtotal && (
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-400">Subtotal</p>
                            <p className="text-white text-sm">${selectedOrder.payment.subtotal.toFixed(2)}</p>
                          </div>
                        )}
                        {selectedOrder.payment?.tax && (
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-400">Tax</p>
                            <p className="text-white text-sm">${selectedOrder.payment.tax.toFixed(2)}</p>
                          </div>
                        )}
                        {selectedOrder.payment?.shippingCost !== undefined && (
                          <div className="flex justify-between">
                            <p className="text-sm text-gray-400">Shipping</p>
                            <p className="text-white text-sm">
                              {selectedOrder.payment.shippingCost === 0 ? 'Free' : `$${selectedOrder.payment.shippingCost.toFixed(2)}`}
                            </p>
                          </div>
                        )}
                        <div className="flex justify-between pt-2 border-t border-gray-600">
                          <p className="text-sm text-gray-400 font-medium">Total</p>
                          <p className="text-yellow-400 text-lg font-semibold">
                            ${(selectedOrder.payment?.amount || selectedOrder.total)?.toFixed(2) || '0.00'}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Customer Information */}
                  {(selectedOrder.customerName || selectedOrder.customerEmail || selectedOrder.customerPhone) && (
                    <Card className="bg-black/80 border border-yellow-400/30">
                      <CardHeader>
                        <CardTitle className="text-yellow-400 flex items-center text-lg">
                          <MapPin className="w-5 h-5 mr-2" />
                          Customer Information
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {selectedOrder.customerName && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Name</p>
                            <p className="text-white text-sm">{selectedOrder.customerName}</p>
                          </div>
                        )}
                        {selectedOrder.customerEmail && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Email</p>
                            <p className="text-white text-sm">{selectedOrder.customerEmail}</p>
                          </div>
                        )}
                        {selectedOrder.customerPhone && (
                          <div>
                            <p className="text-sm text-gray-400 mb-1">Phone</p>
                            <p className="text-white text-sm">{selectedOrder.customerPhone}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions */}
                  <Card className="bg-black/80 border border-yellow-400/30">
                    <CardHeader>
                      <CardTitle className="text-yellow-400 text-lg">Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {selectedOrder.status === 'delivered' && (
                        <>
                          <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black">
                            Reorder Items
                          </Button>
                          <Button variant="outline" className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                            Return Items
                          </Button>
                        </>
                      )}
                      {selectedOrder.status === 'processing' && (
                        <Button variant="outline" className="w-full border-red-500/30 text-red-400 hover:bg-red-500/10">
                          Cancel Order
                        </Button>
                      )}
                      <Button variant="outline" className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                        Contact Support
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black relative page-with-header" id="orders-page-top">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 max-w-7xl">
          {/* Enhanced Header Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-12"
            id="page-content-start"
          >
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-10">
              <div className="text-center lg:text-left space-y-4">
                <div className="space-y-3">
                  <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-br from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent leading-tight">
                    Your Orders
                  </h1>
                  <p className="text-gray-300 text-xl lg:text-2xl font-light max-w-2xl">
                    Track and manage your purchases with ease
                  </p>
                </div>
                
                {/* Stats Bar */}
                <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-4">
                  <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-yellow-400/10 to-yellow-600/10 rounded-full border border-yellow-400/20">
                    <Package className="w-5 h-5 text-yellow-400" />
                    <div className="text-center lg:text-left">
                      <p className="text-yellow-400 font-bold text-lg">{orders.length}</p>
                      <p className="text-gray-400 text-xs">Total Orders</p>
                    </div>
                  </div>
                  
                  {orders.length > 0 && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-green-400/10 to-green-600/10 rounded-full border border-green-400/20">
                      <CheckCircle className="w-5 h-5 text-green-400" />
                      <div className="text-center lg:text-left">
                        <p className="text-green-400 font-bold text-lg">
                          {orders.filter(order => order.status === 'delivered').length}
                        </p>
                        <p className="text-gray-400 text-xs">Completed</p>
                      </div>
                    </div>
                  )}
                  
                  {orders.length > 0 && (
                    <div className="flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-blue-400/10 to-blue-600/10 rounded-full border border-blue-400/20">
                      <Truck className="w-5 h-5 text-blue-400" />
                      <div className="text-center lg:text-left">
                        <p className="text-blue-400 font-bold text-lg">
                          {orders.filter(order => ['shipped', 'processing'].includes(order.status)).length}
                        </p>
                        <p className="text-gray-400 text-xs">In Transit</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Link href="/profile">
                  <Button 
                    variant="outline" 
                    size="lg"
                    className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/60 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-yellow-400/20"
                  >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Timeout Warning - Show if there's a timeout error but user is authenticated and not currently loading */}
            {error && isAuthenticated && !isLoading && (error.includes('timeout') || error.includes('Database connection timeout')) && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6"
              >
                <Card className="bg-gradient-to-r from-blue-400/10 to-purple-400/10 border border-blue-400/30">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Clock className="w-5 h-5 text-blue-400 flex-shrink-0" />
                      <div>
                        <p className="text-blue-400 font-medium">
                          Orders Loaded Successfully
                        </p>
                        <p className="text-gray-300 text-sm">
                          Data loaded despite temporary performance issues.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Enhanced Filters Section */}
            <Card className="bg-gradient-to-br from-black/90 via-black/80 to-black/70 border border-yellow-400/30 shadow-2xl shadow-yellow-400/10 backdrop-blur-sm">
              <CardContent className="p-8">
                <div className="space-y-6">
                  {/* Filter Header */}
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-10 h-10 bg-gradient-to-br from-yellow-400/20 to-yellow-600/20 rounded-lg flex items-center justify-center">
                      <Filter className="w-5 h-5 text-yellow-400" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">Filter & Search</h3>
                      <p className="text-gray-400 text-sm">Find exactly what you're looking for</p>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Search Section */}
                    <div className="lg:col-span-2">
                      <div className="space-y-2">
                        <label className="block text-sm font-semibold text-yellow-400/90 mb-3">
                          Search Orders
                        </label>
                        <div className="relative group">
                          {searchTerm !== debouncedSearchTerm ? (
                            <Loader2 className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400/60 group-hover:text-yellow-400 w-5 h-5 transition-colors duration-300 animate-spin" />
                          ) : (
                            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400/60 group-hover:text-yellow-400 w-5 h-5 transition-colors duration-300" />
                          )}
                          <Input
                            placeholder="Search by order number, item name, or any detail..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-12 pr-12 py-4 bg-black/70 border-yellow-400/30 text-white placeholder:text-gray-500 rounded-xl text-base hover:border-yellow-400/60 focus:border-yellow-400 focus:bg-black/80 group-hover:shadow-lg group-hover:shadow-yellow-400/10 transition-all duration-300"
                          />
                          {searchTerm && (
                            <Button
                              onClick={() => setSearchTerm("")}
                              variant="ghost"
                              size="sm"
                              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              <XCircle className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                        {isLoading && searchTerm && (
                          <div className="flex items-center gap-2 text-xs text-yellow-400/70">
                            <Loader2 className="w-3 h-3 animate-spin" />
                            <span>Searching orders...</span>
                          </div>
                        )}
                        {!isLoading && debouncedSearchTerm && orders.length === 0 && (
                          <div className="flex items-center gap-2 text-xs text-gray-400">
                            <Search className="w-3 h-3" />
                            <span>No orders found for "{debouncedSearchTerm}"</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status Filter Section */}
                    <div>
                      <label className="block text-sm font-semibold text-yellow-400/90 mb-3">
                        Filter by Status
                      </label>
                      <div className="relative group">
                        <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400/60 group-hover:text-yellow-400 transition-colors duration-300">
                          {statusFilter === 'all' && <Package className="w-5 h-5" />}
                          {statusFilter === 'delivered' && <CheckCircle className="w-5 h-5" />}
                          {statusFilter === 'shipped' && <Truck className="w-5 h-5" />}
                          {statusFilter === 'processing' && <Clock className="w-5 h-5" />}
                          {statusFilter === 'cancelled' && <XCircle className="w-5 h-5" />}
                          {!['all', 'delivered', 'shipped', 'processing', 'cancelled'].includes(statusFilter) && <Filter className="w-5 h-5" />}
                        </div>
                        <select
                          value={statusFilter}
                          onChange={(e) => setStatusFilter(e.target.value)}
                          className="w-full pl-12 pr-4 py-4 bg-black/70 border border-yellow-400/30 text-white rounded-xl text-base focus:ring-2 focus:ring-yellow-400/40 focus:outline-none hover:border-yellow-400/60 focus:border-yellow-400 focus:bg-black/80 transition-all duration-300 appearance-none cursor-pointer group-hover:shadow-lg group-hover:shadow-yellow-400/10"
                        >
                          <option value="all">All Orders</option>
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                          <svg className="w-5 h-5 text-yellow-400/70 group-hover:text-yellow-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Enhanced Filter Summary */}
                  {(debouncedSearchTerm || statusFilter !== 'all') && (
                    <div className="flex flex-wrap items-center gap-3 pt-6 border-t border-yellow-400/10">
                      <div className="flex items-center gap-2">
                        <Filter className="w-4 h-4 text-yellow-400/70" />
                        <span className="text-sm font-medium text-yellow-400/90">Active filters:</span>
                      </div>
                      {debouncedSearchTerm && (
                        <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-3 py-1">
                          <Search className="w-3 h-3 mr-1" />
                          Search: "{debouncedSearchTerm}"
                        </Badge>
                      )}
                      {statusFilter !== 'all' && (
                        <Badge className="bg-blue-400/20 text-blue-400 border-blue-400/30 px-3 py-1">
                          <Filter className="w-3 h-3 mr-1" />
                          Status: {statusFilter}
                        </Badge>
                      )}
                      <Button
                        onClick={() => {
                          setSearchTerm("");
                          setDebouncedSearchTerm("");
                          setStatusFilter("all");
                          setCurrentPage(1);
                        }}
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-white text-xs px-3 py-1 rounded-md hover:bg-white/5 transition-all duration-200"
                      >
                        <XCircle className="w-3 h-3 mr-1" />
                        Clear all
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Enhanced Orders List */}
          <div className="space-y-8">
            {orders.length === 0 ? (
              <Card className="bg-gradient-to-br from-black/90 via-black/80 to-black/70 border border-yellow-400/30 shadow-2xl shadow-yellow-400/10">
                <CardContent className="p-16 sm:p-20 text-center">
                  <div className="max-w-lg mx-auto space-y-8">
                    <div className="relative">
                      <div className="w-28 h-28 bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 rounded-3xl flex items-center justify-center mx-auto shadow-2xl">
                        <Package className="w-14 h-14 text-yellow-400" />
                      </div>
                      <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center shadow-lg">
                        <Search className="w-4 h-4 text-black" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-3xl font-bold text-white">No orders found</h3>
                      <p className="text-gray-300 text-lg leading-relaxed max-w-md mx-auto">
                        {debouncedSearchTerm || statusFilter !== "all" 
                          ? "No orders match your current search criteria. Try adjusting your filters or search terms." 
                          : "You haven't placed any orders yet. Start exploring our amazing tech products and build your dream setup!"}
                      </p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                      <Link href="/products">
                        <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold px-8 py-4 rounded-xl shadow-xl hover:shadow-yellow-400/30 hover:scale-105 transition-all duration-300">
                          <Package className="w-5 h-5 mr-2" />
                          Start Shopping
                        </Button>
                      </Link>
                      
                      {(debouncedSearchTerm || statusFilter !== "all") && (
                        <Button
                          onClick={() => {
                            setSearchTerm("");
                            setDebouncedSearchTerm("");
                            setStatusFilter("all");
                            setCurrentPage(1);
                          }}
                          variant="outline"
                          className="border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/60 px-8 py-4 rounded-xl font-semibold transition-all duration-300"
                        >
                          <XCircle className="w-5 h-5 mr-2" />
                          Clear Filters
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ) : (
              <>
                {orders.map((order, index) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  whileHover={{ scale: 1.02, y: -4 }}
                  className="transform transition-all duration-300"
                >
                  <Card className="bg-gradient-to-br from-black/90 via-black/80 to-black/70 border border-yellow-400/30 hover:border-yellow-400/60 shadow-xl hover:shadow-2xl hover:shadow-yellow-400/15 transition-all duration-300 cursor-pointer group relative overflow-hidden">
                    {/* Subtle animated background */}
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/5 to-yellow-400/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                    
                    <CardContent className="p-8 lg:p-10 relative z-10 order-card-content">
                      <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-8">
                        {/* Enhanced Order Info Section */}
                        <div className="flex-1 space-y-6">
                          {/* Order Header with improved spacing */}
                          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                            <div className="flex items-center gap-4">
                              <div className="w-14 h-14 bg-gradient-to-br from-yellow-400/20 to-yellow-600/30 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-400/20 transition-all duration-300">
                                <Package className="w-7 h-7 text-yellow-400 group-hover:scale-110 transition-transform duration-300" />
                              </div>
                              <div className="space-y-1 min-w-0 flex-1">
                                <h3 className="text-2xl font-bold text-white group-hover:text-yellow-100 transition-colors duration-300 truncate">
                                  #{order.orderNumber}
                                </h3>
                                <p className="text-sm text-gray-400 font-medium">Order Number</p>
                              </div>
                            </div>
                            <Badge className={`${getStatusColor(order.status)} border font-semibold px-4 py-2 rounded-full flex items-center gap-2 w-fit text-sm shadow-lg flex-shrink-0`}>
                              {getStatusIcon(order.status)}
                              <span className="capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          
                          {/* Enhanced Order Details Grid */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-yellow-400/5 to-yellow-400/10 rounded-xl border border-yellow-400/15 group-hover:border-yellow-400/25 transition-all duration-300 order-info-box">
                              <div className="w-10 h-10 bg-yellow-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Calendar className="w-5 h-5 text-yellow-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-400 font-medium mb-1">Order Date</p>
                                <p className="text-white font-semibold leading-tight order-info-text">{new Date(order.date).toLocaleDateString()}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-400/5 to-blue-400/10 rounded-xl border border-blue-400/15 group-hover:border-blue-400/25 transition-all duration-300 order-info-box">
                              <div className="w-10 h-10 bg-blue-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-5 h-5 text-blue-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-400 font-medium mb-1">Items</p>
                                <p className="text-white font-semibold leading-tight order-info-text">{order.items.length} item{order.items.length !== 1 ? 's' : ''}</p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-400/5 to-green-400/10 rounded-xl border border-green-400/15 group-hover:border-green-400/25 transition-all duration-300 order-info-box">
                              <div className="w-10 h-10 bg-green-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-5 h-5 text-green-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-400 font-medium mb-1">Total Amount</p>
                                <p className="text-green-400 font-bold text-lg leading-tight order-info-text">${order.total.toFixed(2)}</p>
                              </div>
                            </div>
                          </div>

                          {/* Customer and Shipping Information Row */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-400/5 to-purple-400/10 rounded-xl border border-purple-400/15 group-hover:border-purple-400/25 transition-all duration-300 order-info-box">
                              <div className="w-10 h-10 bg-purple-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <MapPin className="w-5 h-5 text-purple-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-400 font-medium mb-1">Customer</p>
                                <p className="text-white font-semibold text-sm leading-tight customer-name" title={order.customerName || 'Unknown'}>
                                  {order.customerName || 'Unknown Customer'}
                                </p>
                              </div>
                            </div>
                            
                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-indigo-400/5 to-indigo-400/10 rounded-xl border border-indigo-400/15 group-hover:border-indigo-400/25 transition-all duration-300 order-info-box">
                              <div className="w-10 h-10 bg-indigo-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Truck className="w-5 h-5 text-indigo-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-400 font-medium mb-1">Shipping To</p>
                                <p className="text-white font-semibold text-sm leading-tight delivery-address" title={`${order.shipping?.address || order.shippingAddress || 'Unknown'}, ${order.shipping?.city || order.shippingCity || ''}`}>
                                  {(order.shipping?.address || order.shippingAddress) && (order.shipping?.city || order.shippingCity) 
                                    ? `${order.shipping?.address || order.shippingAddress}, ${order.shipping?.city || order.shippingCity}`
                                    : 'Address not available'
                                  }
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-orange-400/5 to-orange-400/10 rounded-xl border border-orange-400/15 group-hover:border-orange-400/25 transition-all duration-300 order-info-box">
                              <div className="w-10 h-10 bg-orange-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <CreditCard className="w-5 h-5 text-orange-400" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <p className="text-xs text-gray-400 font-medium mb-1">Payment</p>
                                <p className="text-white font-semibold text-sm leading-tight payment-method capitalize" title={order.payment?.method || order.paymentMethod || 'Unknown'}>
                                  {order.payment?.method || order.paymentMethod || 'Unknown'}
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Order Items Preview */}
                          <div className="bg-gradient-to-r from-black/40 to-black/20 rounded-xl p-5 border border-yellow-400/10">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-8 h-8 bg-yellow-400/10 rounded-lg flex items-center justify-center flex-shrink-0">
                                <Package className="w-4 h-4 text-yellow-400" />
                              </div>
                              <p className="text-sm font-semibold text-yellow-400">Items in this order:</p>
                            </div>
                            <div className="xl:hidden">
                              <p className="text-white font-medium leading-relaxed break-words order-items-text">
                                {order.items && order.items.length > 0 
                                  ? order.items.map(item => item.name || item.productName || 'Unknown Item').join(', ')
                                  : 'No items available'
                                }
                              </p>
                            </div>
                            <div className="hidden xl:block">
                              <p className="text-white font-medium leading-relaxed break-words order-items-text">
                                {order.items && order.items.length > 0 
                                  ? order.items.map(item => item.name || item.productName || 'Unknown Item').join(', ')
                                  : 'No items available'
                                }
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Enhanced Action Buttons */}
                        <div className="flex flex-col sm:flex-row xl:flex-col gap-4 xl:w-56">
                          {order.shipping?.trackingNumber && order.status !== 'cancelled' && (
                            <Button 
                              variant="outline" 
                              size="lg"
                              className="border-blue-500/40 text-blue-400 hover:bg-blue-500/15 hover:border-blue-400/70 hover:scale-105 transition-all duration-300 flex-1 xl:w-full shadow-lg hover:shadow-blue-400/20 font-semibold"
                            >
                              <Truck className="w-5 h-5 mr-2" />
                              Track Order
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => setSelectedOrder(order)}
                            variant="outline"
                            size="lg"
                            className="border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/15 hover:border-yellow-400/70 hover:scale-105 transition-all duration-300 flex-1 xl:w-full shadow-lg hover:shadow-yellow-400/20 font-semibold"
                          >
                            <Eye className="w-5 h-5 mr-2" />
                            View Details
                          </Button>

                          {order.status === 'delivered' && (
                            <Button 
                              size="lg"
                              className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-bold shadow-xl hover:shadow-yellow-400/30 hover:scale-105 transition-all duration-300 flex-1 xl:w-full"
                            >
                              <Package className="w-5 h-5 mr-2" />
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
                ))}
                
                {/* Enhanced Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <Card className="bg-gradient-to-br from-black/80 via-black/70 to-black/60 border border-yellow-400/30 shadow-xl mt-12">
                    <CardContent className="p-8">
                      <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                        {/* Enhanced Pagination Info with Search Context */}
                        <div className="text-center lg:text-left space-y-2">
                          <p className="text-gray-300 text-base">
                            Showing <span className="text-yellow-400 font-bold text-lg">{((pagination.page - 1) * 10) + 1}</span> to{' '}
                            <span className="text-yellow-400 font-bold text-lg">
                              {Math.min(pagination.page * 10, pagination.total)}
                            </span> of{' '}
                            <span className="text-yellow-400 font-bold text-lg">{pagination.total}</span> 
                            {(debouncedSearchTerm || statusFilter !== 'all') ? ' matching' : ''} orders
                          </p>
                          <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-sm">
                            <p className="text-gray-500">Page {pagination.page} of {pagination.totalPages}</p>
                            {(debouncedSearchTerm || statusFilter !== 'all') && (
                              <div className="flex items-center gap-2 text-xs">
                                <span className="text-gray-500">•</span>
                                <span className="text-blue-400">
                                  {debouncedSearchTerm && `Search: "${debouncedSearchTerm}"`}
                                  {debouncedSearchTerm && statusFilter !== 'all' && ', '}
                                  {statusFilter !== 'all' && `Status: ${statusFilter}`}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        {/* Pagination Controls */}
                        <div className="flex items-center gap-3">
                          <Button
                            variant="outline"
                            disabled={!pagination.hasPrev}
                            onClick={() => setCurrentPage(currentPage - 1)}
                            className="border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/15 hover:border-yellow-400/70 disabled:opacity-30 disabled:cursor-not-allowed px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                          >
                            <ArrowLeft className="w-5 h-5 mr-2" />
                            Previous
                          </Button>
                          
                          {/* Page Numbers */}
                          <div className="flex items-center gap-2">
                            {[...Array(Math.min(5, pagination.totalPages))].map((_, index) => {
                              const pageNum = Math.max(1, pagination.page - 2) + index;
                              if (pageNum > pagination.totalPages) return null;
                              
                              const isActive = pageNum === pagination.page;
                              
                              return (
                                <Button
                                  key={pageNum}
                                  variant={isActive ? "default" : "outline"}
                                  size="lg"
                                  onClick={() => setCurrentPage(pageNum)}
                                  className={
                                    isActive
                                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 font-bold shadow-lg px-4 py-3 min-w-[48px]"
                                      : "border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/15 hover:border-yellow-400/70 hover:scale-105 transition-all duration-300 px-4 py-3 min-w-[48px]"
                                  }
                                >
                                  {pageNum}
                                </Button>
                              );
                            })}
                          </div>
                          
                          <Button
                            variant="outline"
                            disabled={!pagination.hasNext}
                            onClick={() => setCurrentPage(currentPage + 1)}
                            className="border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/15 hover:border-yellow-400/70 disabled:opacity-30 disabled:cursor-not-allowed px-6 py-3 font-semibold transition-all duration-300 hover:scale-105"
                          >
                            Next
                            <ArrowLeft className="w-5 h-5 ml-2 rotate-180" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
