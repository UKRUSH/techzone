"use client";

import { useState, useEffect } from "react";
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
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Use real user orders data
  const { orders, pagination, isLoading, error, isAuthenticated } = useUserOrders({
    page: currentPage,
    limit: 10,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    search: searchTerm || undefined
  });

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    }
  }, [status, router]);

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

  // Loading state
  if (status === 'loading' || (isLoading && !orders.length)) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="text-white">Loading your orders...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  // Error state
  if (error || !isAuthenticated) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center max-w-md">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-white mb-2">
              {error ? "Error Loading Orders" : "Authentication Required"}
            </h2>
            <p className="text-gray-400 mb-6">
              {error || "Please sign in to view your orders."}
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

  if (selectedOrder) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black relative">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
          
          <div className="container mx-auto px-4 py-8 relative z-10">
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
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <h1 className="text-2xl font-bold text-white mb-2">
                        Order #{selectedOrder.orderNumber}
                      </h1>
                      <div className="flex items-center gap-4 text-sm text-gray-400">
                        <span>Placed on {new Date(selectedOrder.date).toLocaleDateString()}</span>
                        <span>•</span>
                        <span>${selectedOrder.total.toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge className={`${getStatusColor(selectedOrder.status)} border font-medium`}>
                        {getStatusIcon(selectedOrder.status)}
                        <span className="ml-2 capitalize">{selectedOrder.status}</span>
                      </Badge>
                      <Button variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
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
                        {selectedOrder.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4 p-4 bg-yellow-400/5 rounded-lg border border-yellow-400/10">
                            <div className="w-16 h-16 bg-gray-800 rounded-lg flex items-center justify-center">
                              <Package className="w-8 h-8 text-gray-600" />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-white">{item.name}</h3>
                              <p className="text-gray-400 text-sm">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-yellow-400">${item.price.toFixed(2)}</p>
                              {selectedOrder.status === 'delivered' && (
                                <Button variant="outline" size="sm" className="mt-2 text-xs border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                                  <Star className="w-3 h-3 mr-1" />
                                  Review
                                </Button>
                              )}
                            </div>
                          </div>
                        ))}
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
                        <p className="text-white text-sm">{selectedOrder.shipping.address}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Method</p>
                        <p className="text-white text-sm">{selectedOrder.shipping.method}</p>
                      </div>
                      {selectedOrder.shipping.trackingNumber && (
                        <div>
                          <p className="text-sm text-gray-400 mb-1">Tracking</p>
                          <p className="text-yellow-400 text-sm font-mono">{selectedOrder.shipping.trackingNumber}</p>
                        </div>
                      )}
                      {selectedOrder.shipping.estimatedDelivery && (
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
                        <p className="text-white text-sm">{selectedOrder.payment.method}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Total</p>
                        <p className="text-yellow-400 text-lg font-semibold">${selectedOrder.payment.amount.toFixed(2)}</p>
                      </div>
                    </CardContent>
                  </Card>

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
      <div className="min-h-screen bg-black relative">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">Your Orders</h1>
                <p className="text-gray-400">Track and manage your purchases</p>
              </div>
              <div className="flex items-center gap-4">
                <Link href="/profile">
                  <Button variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Profile
                  </Button>
                </Link>
              </div>
            </div>

            {/* Filters */}
            <Card className="bg-black/80 border border-yellow-400/30">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400/70 w-4 h-4" />
                    <Input
                      placeholder="Search orders..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-black/60 border-yellow-400/30 text-white"
                    />
                  </div>

                  {/* Status Filter */}
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="bg-black/70 border border-yellow-400/30 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400/40"
                  >
                    <option value="all">All Orders</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Orders List */}
          <div className="space-y-4">
            {filteredOrders.length === 0 ? (
              <Card className="bg-black/80 border border-yellow-400/30">
                <CardContent className="p-12 text-center">
                  <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-white mb-2">No orders found</h3>
                  <p className="text-gray-400 mb-6">
                    {searchTerm || statusFilter !== "all" 
                      ? "Try adjusting your search criteria" 
                      : "You haven't placed any orders yet"}
                  </p>
                  <Link href="/products">
                    <Button className="bg-yellow-400 hover:bg-yellow-300 text-black">
                      Start Shopping
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              filteredOrders.map((order) => (
                <motion.div
                  key={order.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  whileHover={{ scale: 1.01 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-black/80 border border-yellow-400/30 hover:bg-black/90 transition-colors cursor-pointer">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-3">
                            <h3 className="text-lg font-semibold text-white">
                              Order #{order.orderNumber}
                            </h3>
                            <Badge className={`${getStatusColor(order.status)} border font-medium`}>
                              {getStatusIcon(order.status)}
                              <span className="ml-2 capitalize">{order.status}</span>
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2 text-yellow-400" />
                              {new Date(order.date).toLocaleDateString()}
                            </div>
                            <div className="flex items-center">
                              <Package className="w-4 h-4 mr-2 text-yellow-400" />
                              {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                            </div>
                            <div className="flex items-center">
                              <span className="text-yellow-400 font-semibold">
                                ${order.total.toFixed(2)}
                              </span>
                            </div>
                          </div>

                          <div className="mt-3">
                            <p className="text-sm text-gray-400">
                              {order.items.map(item => item.name).join(', ')}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          {order.shipping.trackingNumber && order.status !== 'cancelled' && (
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                            >
                              <Truck className="w-4 h-4 mr-2" />
                              Track
                            </Button>
                          )}
                          
                          <Button
                            onClick={() => setSelectedOrder(order)}
                            variant="outline"
                            size="sm"
                            className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                          >
                            <Eye className="w-4 h-4 mr-2" />
                            View Details
                          </Button>

                          {order.status === 'delivered' && (
                            <Button 
                              size="sm"
                              className="bg-yellow-400 hover:bg-yellow-300 text-black"
                            >
                              Reorder
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
