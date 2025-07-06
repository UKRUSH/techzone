"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { motion } from "framer-motion";
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package,
  Warehouse,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown,
  BarChart3,
  RefreshCw,
  Download,
  MapPin,
  Box
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

export default function AdminInventoryPage() {
  const [inventory, setInventory] = useState([]);
  const [locations, setLocations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [showUpdateDialog, setShowUpdateDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [updateQuantity, setUpdateQuantity] = useState("");

  useEffect(() => {
    fetchInventory();
    fetchLocations();
  }, []);

  const fetchInventory = async () => {
    try {
      const response = await fetch('/api/admin/inventory');
      if (response.ok) {
        const result = await response.json();
        const inventoryData = result.success ? result.data : result.inventory || result;
        setInventory(Array.isArray(inventoryData) ? inventoryData : []);
      } else {
        console.warn("Failed to fetch inventory");
        setInventory([]);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      setInventory([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchLocations = async () => {
    try {
      const response = await fetch('/api/admin/locations');
      if (response.ok) {
        const result = await response.json();
        const locationsData = result.success ? result.data : result.locations || result;
        setLocations(Array.isArray(locationsData) ? locationsData : []);
      }
    } catch (error) {
      console.error("Error fetching locations:", error);
    }
  };

  const getStockStatus = (stock, reserved, minThreshold = 10) => {
    const available = stock - reserved;
    if (available <= 0) return { status: 'out', color: 'bg-red-400/20 text-red-400 border-red-400/30' };
    if (available <= minThreshold) return { status: 'low', color: 'bg-yellow-400/20 text-yellow-400 border-yellow-400/30' };
    return { status: 'good', color: 'bg-green-400/20 text-green-400 border-green-400/30' };
  };

  const getStockIcon = (status) => {
    switch (status) {
      case 'out': return <AlertTriangle className="w-3 h-3" />;
      case 'low': return <AlertTriangle className="w-3 h-3" />;
      case 'good': return <CheckCircle className="w-3 h-3" />;
      default: return <Package className="w-3 h-3" />;
    }
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.variant?.sku?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesLocation = selectedLocation === "all" || item.location?.name === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const handleUpdateStock = async () => {
    if (!selectedItem || !updateQuantity) return;

    try {
      const response = await fetch(`/api/admin/inventory/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          stock: parseInt(updateQuantity),
          reason: 'Admin adjustment'
        })
      });

      if (response.ok) {
        fetchInventory();
        setShowUpdateDialog(false);
        setUpdateQuantity("");
        alert('Stock updated successfully');
      } else {
        alert('Failed to update stock');
      }
    } catch (error) {
      console.error('Error updating stock:', error);
      alert('Failed to update stock');
    }
  };

  const totalItems = inventory.length;
  const lowStockItems = inventory.filter(item => {
    const available = item.stock - item.reserved;
    return available <= 10 && available > 0;
  }).length;
  const outOfStockItems = inventory.filter(item => item.stock - item.reserved <= 0).length;
  const totalValue = inventory.reduce((sum, item) => sum + (item.stock * (item.variant?.price || 0)), 0);

  const stats = [
    {
      title: "Total Items",
      value: totalItems.toString(),
      icon: Package,
      bg: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Low Stock",
      value: lowStockItems.toString(),
      icon: AlertTriangle,
      bg: "from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-400"
    },
    {
      title: "Out of Stock",
      value: outOfStockItems.toString(),
      icon: AlertTriangle,
      bg: "from-red-500/20 to-red-600/20",
      iconColor: "text-red-400"
    },
    {
      title: "Total Value",
      value: new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        notation: 'compact'
      }).format(totalValue),
      icon: BarChart3,
      bg: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500">Loading inventory...</div>
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
                Inventory Management
              </h1>
              <p className="text-white/70 mt-2">Track stock levels and manage warehouse inventory</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button 
                onClick={fetchInventory}
                variant="outline" 
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Export Report
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
                    placeholder="Search by product name or SKU..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-yellow-400/5 border-yellow-400/20 text-white placeholder-yellow-400/30"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className="bg-yellow-400/5 border border-yellow-400/20 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400/40"
                >
                  <option value="all">All Locations</option>
                  {locations.map(location => (
                    <option key={location.id} value={location.name}>{location.name}</option>
                  ))}
                </select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Inventory Table */}
        <Card className="bg-black/90 border-yellow-400/20 overflow-hidden">
          <CardHeader className="border-b border-yellow-400/10">
            <CardTitle className="text-yellow-400">Inventory Items</CardTitle>
            <CardDescription className="text-white/60">
              {filteredInventory.length} items found
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-yellow-400/5 border-b border-yellow-400/10">
                  <tr>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Product</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">SKU</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Location</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Stock</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Reserved</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Available</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Status</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Value</th>
                    <th className="text-left p-4 text-yellow-400 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInventory.map((item, index) => {
                    const available = item.stock - item.reserved;
                    const stockInfo = getStockStatus(item.stock, item.reserved);
                    
                    return (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="border-b border-yellow-400/5 hover:bg-yellow-400/5 transition-colors"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
                              <Package className="w-5 h-5 text-yellow-400" />
                            </div>
                            <div>
                              <p className="text-white font-medium">{item.product?.name || 'Unknown Product'}</p>
                              <p className="text-white/60 text-sm">{item.variant?.name || 'Standard'}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="font-mono text-yellow-400">{item.variant?.sku || 'N/A'}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-4 h-4 text-yellow-400" />
                            <span className="text-white">{item.location?.name || 'Unknown'}</span>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className="text-white font-semibold">{item.stock}</span>
                        </td>
                        <td className="p-4">
                          <span className="text-white/80">{item.reserved}</span>
                        </td>
                        <td className="p-4">
                          <span className={`font-semibold ${available <= 0 ? 'text-red-400' : available <= 10 ? 'text-yellow-400' : 'text-green-400'}`}>
                            {available}
                          </span>
                        </td>
                        <td className="p-4">
                          <Badge className={`${stockInfo.color} flex items-center gap-1 w-fit`}>
                            {getStockIcon(stockInfo.status)}
                            {stockInfo.status === 'out' ? 'Out of Stock' : 
                             stockInfo.status === 'low' ? 'Low Stock' : 'In Stock'}
                          </Badge>
                        </td>
                        <td className="p-4">
                          <span className="text-white font-medium">
                            {new Intl.NumberFormat('en-LK', {
                              style: 'currency',
                              currency: 'LKR'
                            }).format(item.stock * (item.variant?.price || 0))}
                          </span>
                        </td>
                        <td className="p-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              setSelectedItem(item);
                              setUpdateQuantity(item.stock.toString());
                              setShowUpdateDialog(true);
                            }}
                            className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        </td>
                      </motion.tr>
                    );
                  })}
                </tbody>
              </table>
              
              {filteredInventory.length === 0 && (
                <div className="text-center py-12">
                  <Warehouse className="w-12 h-12 text-yellow-400/50 mx-auto mb-4" />
                  <p className="text-white/60">No inventory items found</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Update Stock Dialog */}
        <Dialog open={showUpdateDialog} onOpenChange={setShowUpdateDialog}>
          <DialogContent className="bg-black border-yellow-400/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">Update Stock Level</DialogTitle>
              <DialogDescription className="text-white/60">
                Adjust the stock quantity for {selectedItem?.product?.name}
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="quantity" className="text-yellow-400">New Stock Quantity</Label>
                <Input
                  id="quantity"
                  type="number"
                  value={updateQuantity}
                  onChange={(e) => setUpdateQuantity(e.target.value)}
                  className="bg-yellow-400/5 border-yellow-400/20 text-white"
                  placeholder="Enter new quantity"
                />
              </div>
              
              {selectedItem && (
                <div className="bg-yellow-400/5 p-4 rounded-lg">
                  <h4 className="text-yellow-400 font-semibold mb-2">Current Status</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-white/60">Current Stock:</span>
                      <span className="text-white font-semibold ml-2">{selectedItem.stock}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Reserved:</span>
                      <span className="text-white font-semibold ml-2">{selectedItem.reserved}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Available:</span>
                      <span className="text-green-400 font-semibold ml-2">{selectedItem.stock - selectedItem.reserved}</span>
                    </div>
                    <div>
                      <span className="text-white/60">Location:</span>
                      <span className="text-white font-semibold ml-2">{selectedItem.location?.name}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button 
                  variant="outline" 
                  onClick={() => setShowUpdateDialog(false)}
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleUpdateStock}
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
                >
                  Update Stock
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
