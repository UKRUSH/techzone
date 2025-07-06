"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  Package,
  Truck,
  Home,
  Download,
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  CreditCard,
  Loader2,
  AlertCircle,
  Star,
  Share2
} from "lucide-react";

export default function OrderConfirmationPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const orderId = params.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch order details
  useEffect(() => {
    if (orderId && status === 'authenticated') {
      fetchOrderDetails();
    }
  }, [orderId, status]);

  const fetchOrderDetails = async () => {
    try {
      const response = await fetch(`/api/orders?id=${orderId}`);
      const data = await response.json();

      if (data.success) {
        setOrder(data.data);
      } else {
        setError(data.error || 'Failed to load order details');
      }
    } catch (error) {
      console.error('Error fetching order:', error);
      setError('Failed to load order details');
    } finally {
      setLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/30';
      case 'confirmed': return 'text-blue-400 bg-blue-400/10 border-blue-400/30';
      case 'shipped': return 'text-purple-400 bg-purple-400/10 border-purple-400/30';
      case 'delivered': return 'text-green-400 bg-green-400/10 border-green-400/30';
      case 'cancelled': return 'text-red-400 bg-red-400/10 border-red-400/30';
      default: return 'text-gray-400 bg-gray-400/10 border-gray-400/30';
    }
  };

  if (status === 'loading' || loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-yellow-400 animate-spin mx-auto mb-4" />
            <p className="text-white">Loading order details...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (status === 'unauthenticated') {
    router.push('/auth/signin');
    return null;
  }

  if (error || !order) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Order Not Found</h2>
            <p className="text-gray-400 mb-6">{error || 'The order you\'re looking for doesn\'t exist.'}</p>
            <Link href="/">
              <Button className="bg-yellow-400 hover:bg-yellow-300 text-black">
                <Home className="w-4 h-4 mr-2" />
                Return Home
              </Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-20 left-20 w-80 h-80 rounded-full bg-green-400/8 blur-3xl animate-pulse-slower" />
        </div>

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Success Header */}
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mb-6"
            >
              <div className="w-24 h-24 bg-green-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-12 h-12 text-green-400" />
              </div>
            </motion.div>
            
            <h1 className="text-5xl md:text-6xl font-black bg-clip-text text-transparent bg-gradient-to-r from-white via-green-400 to-white mb-4">
              Order Confirmed!
            </h1>
            
            <p className="text-xl text-gray-300 mb-6">
              Thank you for your purchase. Your order has been received and is being processed.
            </p>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Badge className="bg-green-400/10 text-green-400 border-green-400/30 px-4 py-2 text-base">
                Order #{order.confirmationNumber || order.id}
              </Badge>
              <Badge className={`border px-4 py-2 text-base ${getStatusColor(order.status)}`}>
                {order.status.toUpperCase()}
              </Badge>
            </div>
          </motion.div>

          {/* Order Details */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Package className="h-5 w-5 text-yellow-400" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {order.orderItems?.map((item, index) => (
                    <div key={item.id} className="flex items-center space-x-3 py-3 border-b border-zinc-800 last:border-b-0">
                      <div className="w-12 h-12 bg-zinc-800 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">
                          {item.productName}
                        </p>
                        <p className="text-gray-400 text-sm">
                          Qty: {item.quantity} × Rs. {item.price.toFixed(2)}
                        </p>
                      </div>
                      <span className="text-yellow-400 font-bold">
                        Rs. {(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                  
                  <div className="pt-4 space-y-2">
                    <div className="flex justify-between text-gray-300">
                      <span>Subtotal</span>
                      <span>Rs. {order.subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>VAT (18%)</span>
                      <span>Rs. {order.tax.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-300">
                      <span>Shipping</span>
                      <span className="text-green-400">Free</span>
                    </div>
                    <div className="border-t border-zinc-700 pt-2">
                      <div className="flex justify-between text-xl font-bold text-white">
                        <span>Total</span>
                        <span className="text-yellow-400">Rs. {order.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Customer & Shipping Info */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="space-y-6"
            >
              {/* Customer Information */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Mail className="h-5 w-5 text-yellow-400" />
                    Customer Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <span className="font-medium">{order.customerName}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="w-4 h-4 text-yellow-400" />
                    {order.customerEmail}
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="w-4 h-4 text-yellow-400" />
                    {order.customerPhone}
                  </div>
                </CardContent>
              </Card>

              {/* Shipping Address */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-yellow-400" />
                    Shipping Address
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-gray-300 space-y-1">
                    <p>{order.shippingAddress}</p>
                    {order.shippingAddress2 && <p>{order.shippingAddress2}</p>}
                    <p>{order.shippingCity}, {order.shippingDistrict || order.shippingState} {order.shippingPostalCode || order.shippingZipCode}</p>
                    <p>{order.shippingCountry}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Order Details */}
              <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-yellow-400" />
                    Order Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Calendar className="w-4 h-4 text-yellow-400" />
                    <span>Ordered: {formatDate(order.createdAt)}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <CreditCard className="w-4 h-4 text-yellow-400" />
                    <span>Payment: {order.paymentMethod.replace('_', ' ').toUpperCase()}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-300">
                    <Truck className="w-4 h-4 text-yellow-400" />
                    <span>Estimated Delivery: {formatDate(order.estimatedDelivery)}</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Order Tracking */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-12"
          >
            <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Truck className="h-5 w-5 text-yellow-400" />
                  Order Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Tracking Number:</span>
                    <span className="text-yellow-400 font-mono">{order.tracking?.number}</span>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Status Updates</h4>
                    {order.tracking?.updates?.map((update, index) => (
                      <div key={index} className="flex items-start gap-3 pb-3 border-b border-zinc-800 last:border-b-0">
                        <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <span className="text-white font-medium">{update.status}</span>
                            <span className="text-gray-400 text-sm">{formatDate(update.date)}</span>
                          </div>
                          <p className="text-gray-300 text-sm mt-1">{update.description}</p>
                          {update.location && (
                            <p className="text-gray-400 text-xs mt-1">📍 {update.location}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-center space-y-4"
          >
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                onClick={() => window.print()} 
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
              >
                <Download className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
              
              <Button 
                onClick={() => navigator.share && navigator.share({
                  title: 'TechZone Order Confirmation',
                  text: `Order #${order.confirmationNumber} confirmed!`,
                  url: window.location.href
                })}
                className="bg-zinc-800 hover:bg-zinc-700 text-white border border-zinc-700"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share Order
              </Button>
              
              <Link href="/">
                <Button className="bg-yellow-400 hover:bg-yellow-300 text-black">
                  <Home className="w-4 h-4 mr-2" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
            
            <p className="text-gray-400 text-sm mt-6">
              Questions about your order? Contact our support team at support@techzone.lk
            </p>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}