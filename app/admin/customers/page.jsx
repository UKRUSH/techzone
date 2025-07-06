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
  Users,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  UserPlus,
  Download,
  Ban,
  CheckCircle
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

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const response = await fetch('/api/admin/customers');
      if (response.ok) {
        const result = await response.json();
        const customersData = result.success ? result.data : result.customers || result;
        setCustomers(Array.isArray(customersData) ? customersData : []);
      } else {
        console.warn("Failed to fetch customers");
        setCustomers([]);
      }
    } catch (error) {
      console.error("Error fetching customers:", error);
      setCustomers([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCustomers = customers.filter(customer =>
    customer.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone?.includes(searchTerm)
  );

  const handleViewCustomer = (customer) => {
    setSelectedCustomer(customer);
    setShowViewDialog(true);
  };

  const handleToggleStatus = async (customerId, currentStatus) => {
    try {
      const newStatus = currentStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        fetchCustomers();
        alert(`Customer ${newStatus.toLowerCase()} successfully`);
      } else {
        alert('Failed to update customer status');
      }
    } catch (error) {
      console.error('Error updating customer status:', error);
      alert('Failed to update customer status');
    }
  };

  const stats = [
    {
      title: "Total Customers",
      value: customers.length.toString(),
      icon: Users,
      bg: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Active Customers",
      value: customers.filter(c => c.status === 'ACTIVE').length.toString(),
      icon: CheckCircle,
      bg: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400"
    },
    {
      title: "New This Month",
      value: customers.filter(c => {
        const createdDate = new Date(c.createdAt);
        const now = new Date();
        return createdDate.getMonth() === now.getMonth() && createdDate.getFullYear() === now.getFullYear();
      }).length.toString(),
      icon: UserPlus,
      bg: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Total Orders",
      value: customers.reduce((sum, c) => sum + (c._count?.orders || 0), 0).toString(),
      icon: ShoppingBag,
      bg: "from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500">Loading customers...</div>
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
                Customer Management
              </h1>
              <p className="text-white/70 mt-2">Manage customer accounts and view their activity</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Export Data
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

        {/* Search and Filters */}
        <Card className="bg-black/90 border-yellow-400/20 mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-yellow-400/50" />
                  <Input
                    placeholder="Search by name, email, or phone..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-yellow-400/5 border-yellow-400/20 text-white placeholder-yellow-400/30"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Customers Table */}
        <Card className="bg-black/90 border-yellow-400/20 overflow-hidden">
          <CardHeader className="border-b border-yellow-400/10">
            <CardTitle className="text-yellow-400">Customers</CardTitle>
            <CardDescription className="text-white/60">
              {filteredCustomers.length} customers found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-yellow-400/5 border-b border-yellow-400/10">
                  <tr>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Customer</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Contact</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Orders</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Total Spent</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Status</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Joined</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCustomers.map((customer, index) => (
                    <motion.tr 
                      key={customer.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-yellow-400/5 hover:bg-yellow-400/5 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
                            <Users className="w-5 h-5 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-white font-medium">{customer.name}</p>
                            <p className="text-white/60 text-sm">{customer.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-sm">
                            <Mail className="w-3 h-3 text-yellow-400" />
                            <span className="text-white/80">{customer.email}</span>
                          </div>
                          {customer.phone && (
                            <div className="flex items-center gap-2 text-sm">
                              <Phone className="w-3 h-3 text-yellow-400" />
                              <span className="text-white/80">{customer.phone}</span>
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-semibold">
                          {customer._count?.orders || 0}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className="text-white font-semibold">
                          {new Intl.NumberFormat('en-LK', {
                            style: 'currency',
                            currency: 'LKR'
                          }).format(customer.totalSpent || 0)}
                        </span>
                      </td>
                      <td className="p-4">
                        <Badge className={
                          customer.status === 'ACTIVE' 
                            ? 'bg-green-400/20 text-green-400 border-green-400/30' 
                            : 'bg-red-400/20 text-red-400 border-red-400/30'
                        }>
                          {customer.status === 'ACTIVE' ? (
                            <><CheckCircle className="w-3 h-3 mr-1" /> Active</>
                          ) : (
                            <><Ban className="w-3 h-3 mr-1" /> Inactive</>
                          )}
                        </Badge>
                      </td>
                      <td className="p-4">
                        <span className="text-white/80 text-sm">
                          {new Date(customer.createdAt).toLocaleDateString()}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewCustomer(customer)}
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
                              <DropdownMenuItem onClick={() => handleToggleStatus(customer.id, customer.status)}>
                                {customer.status === 'ACTIVE' ? 'Deactivate' : 'Activate'} Customer
                              </DropdownMenuItem>
                              <DropdownMenuItem>Send Email</DropdownMenuItem>
                              <DropdownMenuItem>View Orders</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
              
              {filteredCustomers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-yellow-400/50 mx-auto mb-4" />
                  <p className="text-white/60">No customers found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Customer Details Dialog */}
        <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
          <DialogContent className="bg-black border-yellow-400/20 text-white max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">Customer Details</DialogTitle>
              <DialogDescription className="text-white/60">
                Complete customer information and activity
              </DialogDescription>
            </DialogHeader>
            
            {selectedCustomer && (
              <div className="space-y-6">
                {/* Customer Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-3">Personal Information</h4>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-yellow-400" />
                        <span>{selectedCustomer.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-yellow-400" />
                        <span>{selectedCustomer.email}</span>
                      </div>
                      {selectedCustomer.phone && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-yellow-400" />
                          <span>{selectedCustomer.phone}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-yellow-400" />
                        <span>Joined {new Date(selectedCustomer.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-3">Account Statistics</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Total Orders:</span>
                        <span className="font-semibold">{selectedCustomer._count?.orders || 0}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Total Spent:</span>
                        <span className="font-semibold text-yellow-400">
                          {new Intl.NumberFormat('en-LK', {
                            style: 'currency',
                            currency: 'LKR'
                          }).format(selectedCustomer.totalSpent || 0)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-white/70">Status:</span>
                        <Badge className={
                          selectedCustomer.status === 'ACTIVE' 
                            ? 'bg-green-400/20 text-green-400 border-green-400/30' 
                            : 'bg-red-400/20 text-red-400 border-red-400/30'
                        }>
                          {selectedCustomer.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Addresses */}
                {selectedCustomer.addresses && selectedCustomer.addresses.length > 0 && (
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-3">Addresses</h4>
                    <div className="space-y-3">
                      {selectedCustomer.addresses.map((address, index) => (
                        <div key={index} className="p-3 bg-yellow-400/5 rounded-lg">
                          <div className="flex items-start gap-2">
                            <MapPin className="w-4 h-4 text-yellow-400 mt-0.5" />
                            <div>
                              <p className="font-medium">{address.type || 'Address'}</p>
                              <p className="text-sm text-white/70">{address.street}</p>
                              <p className="text-sm text-white/70">{address.city}, {address.district}</p>
                              <p className="text-sm text-white/70">{address.postalCode}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Recent Orders */}
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 && (
                  <div>
                    <h4 className="text-yellow-400 font-semibold mb-3">Recent Orders</h4>
                    <div className="space-y-2">
                      {selectedCustomer.orders.slice(0, 5).map((order, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-yellow-400/5 rounded-lg">
                          <div>
                            <p className="font-medium">Order #{order.id}</p>
                            <p className="text-sm text-white/60">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold">
                              {new Intl.NumberFormat('en-LK', {
                                style: 'currency',
                                currency: 'LKR'
                              }).format(order.total)}
                            </p>
                            <Badge className="text-xs">{order.status}</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
