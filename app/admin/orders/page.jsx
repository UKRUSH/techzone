"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  ShoppingCart,
  Package,
  Clock,
  CheckCircle,
  AlertCircle,
  Truck,
  DollarSign,
  MapPin,
  Phone,
  User,
  Calendar,
  Download
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch('/api/orders');
      if (response.ok) {
        const result = await response.json();
        const ordersData = result.success ? result.data : result.orders || result;
        setOrders(Array.isArray(ordersData) ? ordersData : []);
      } else {
        console.warn("Failed to fetch orders");
        setOrders([]);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30';
      case 'PROCESSING':
        return 'bg-blue-400/20 text-blue-400 border-blue-400/30';
      case 'SHIPPED':
        return 'bg-purple-400/20 text-purple-400 border-purple-400/30';
      case 'DELIVERED':
        return 'bg-green-400/20 text-green-400 border-green-400/30';
      case 'CANCELLED':
        return 'bg-red-400/20 text-red-400 border-red-400/30';
      default:
        return 'bg-gray-400/20 text-gray-400 border-gray-400/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toUpperCase()) {
      case 'PENDING':
        return <Clock className="w-3 h-3" />;
      case 'PROCESSING':
        return <Package className="w-3 h-3" />;
      case 'SHIPPED':
        return <Truck className="w-3 h-3" />;
      case 'DELIVERED':
        return <CheckCircle className="w-3 h-3" />;
      case 'CANCELLED':
        return <AlertCircle className="w-3 h-3" />;
      default:
        return <Clock className="w-3 h-3" />;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id?.toString().includes(searchTerm) || 
                         order.user?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || order.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleViewOrder = (order) => {
    setSelectedOrder(order);
    setShowViewDialog(true);
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const response = await fetch(`/api/orders/${orderId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        // Refresh orders
        fetchOrders();
        alert('Order status updated successfully');
      } else {
        alert('Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      alert('Failed to update order status');
    }
  };

  const stats = [
    {
      title: "Total Orders",
      value: orders.length.toString(),
      icon: ShoppingCart,
      bg: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Pending",
      value: orders.filter(o => o.status === 'PENDING').length.toString(),
      icon: Clock,
      bg: "from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-400"
    },
    {
      title: "Processing",
      value: orders.filter(o => o.status === 'PROCESSING').length.toString(),
      icon: Package,
      bg: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Delivered",
      value: orders.filter(o => o.status === 'DELIVERED').length.toString(),
      icon: CheckCircle,
      bg: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500">Loading orders...</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-sm">
                Orders Management
              </h1>
              <p className="text-white/70 mt-2">Manage customer orders and track delivery status</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Export Orders
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {stats.map((stat, index) => (
            <motion.div key={stat.title} variants={fadeIn}>
              <Card className={`bg-gradient-to-br ${stat.bg} border border-yellow-400/20 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform`}>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                      <p className="text-3xl font-bold text-white mt-2">{stat.value}</p>
                    </div>
                    <div className={`p-3 rounded-full ${stat.iconColor} bg-black/20`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Filters and Search */}
        <Card className="bg-black/90 border-yellow-400/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-yellow-400/50" />
                  <Input
                    placeholder="Search by order ID, customer name, or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-yellow-400/5 border-yellow-400/20 text-white placeholder-yellow-400/30"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="bg-yellow-400/5 border border-yellow-400/20 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400/40"
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="shipped">Shipped</option>
                  <option value="delivered">Delivered</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card className="bg-black/90 border-yellow-400/20 overflow-hidden">
          <CardHeader className="border-b border-yellow-400/10">
            <CardTitle className="text-yellow-400">Recent Orders</CardTitle>
            <CardDescription className="text-white/60">
              {filteredOrders.length} orders found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-yellow-400/5 border-b border-yellow-400/10">
                  <tr>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Order ID</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Customer</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Total</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Status</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Date</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.map((order, index) => (
                    <motion.tr 
                      key={order.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-yellow-400/5 hover:bg-yellow-400/5 transition-colors"
                    >
                      <td className="p-4">
                        <span className="font-mono text-yellow-400">#{order.id}</span>
                      </td>
                      <td className="p-4">
                        <div>
                          <p className="text-white font-medium">{order.user?.name || 'Guest'}</p>
                          <p className="text-white/60 text-sm">{order.user?.email}</p>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-semibold">
                          {new Intl.NumberFormat('en-LK', {
                            style: 'currency',
                            currency: 'LKR'
                          }).format(order.total || 0)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge className={`${getStatusColor(order.status)} flex items-center gap-1 w-fit`}>
                          {getStatusIcon(order.status)}
                          {order.status || 'PENDING'}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-white/80">
                          {new Date(order.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewOrder(order)}
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent className="bg-black border-yellow-400/20">
                              <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'PROCESSING')}>
                                Mark as Processing
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'SHIPPED')}>
                                Mark as Shipped
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'DELIVERED')}>
                                Mark as Delivered
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleUpdateStatus(order.id, 'CANCELLED')}>
                                Cancel Order
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              
              {filteredOrders.length === 0 && (
                <div className="text-center py-12">
                  <ShoppingCart className="w-12 h-12 text-yellow-400/50 mx-auto mb-4" />
                  <p className="text-white/60">No orders found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Order Details Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="bg-black border-yellow-400/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">Order Details</DialogTitle>
              <DialogDescription className="text-white/60">
                Order #{selectedOrder?.id}
              </DialogDescription>
            </DialogHeader>
            
            {selectedOrder && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">Customer Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-yellow-400" />
                        <span>{selectedOrder.user?.name || 'Guest'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span>📧</span>
                        <span>{selectedOrder.user?.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-yellow-400" />
                        <span>{selectedOrder.phone || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">Order Information</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        <span>{new Date(selectedOrder.createdAt).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                        <span>
                          {new Intl.NumberFormat('en-LK', {
                            style: 'currency',
                            currency: 'LKR'
                          }).format(selectedOrder.total || 0)}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(selectedOrder.status)}
                        <span className="text-yellow-400">{selectedOrder.status}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                {selectedOrder.shippingAddress && (
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-2">Shipping Address</h4>
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-yellow-400 mt-0.5" />
                      <div>
                        <p>{selectedOrder.shippingAddress.street}</p>
                        <p>{selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.district}</p>
                        <p>{selectedOrder.shippingAddress.postalCode}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="text-yellow-400 font-semibold mb-2">Order Items</h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.map((item, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-yellow-400/5 rounded-lg">
                        <div>
                          <p className="font-medium">{item.product?.name || 'Product'}</p>
                          <p className="text-sm text-white/60">Quantity: {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">
                            {new Intl.NumberFormat('en-LK', {
                              style: 'currency',
                              currency: 'LKR'
                            }).format(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
