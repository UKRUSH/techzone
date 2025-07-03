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
  Package,
  DollarSign,
  Users,
  ShoppingCart,
  ArrowUpRight,
  Layers,
  BarChart,
  AlertCircle,
  Sparkles
} from "lucide-react";

// Animation variants
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

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("grid");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showViewDialog, setShowViewDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);

  // Mock data for demonstration
  const mockProducts = [
    { id: "1", name: "Intel Core i7-13700K", category: { name: "CPU" }, brand: { name: "Intel" }, status: "In Stock", totalStock: 50, variants: [{ price: 409.99 }] },
    { id: "2", name: "NVIDIA GeForce RTX 4070", category: { name: "GPU" }, brand: { name: "NVIDIA" }, status: "Featured", totalStock: 25, variants: [{ price: 599.99 }] }
  ];

  const stats = [
    {
      title: "Total Products",
      value: products.length.toString(),
      icon: Package,
      bg: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Revenue",
      value: "$124,563",
      icon: DollarSign,
      bg: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400"
    },
    {
      title: "Customers",
      value: "2,847",
      icon: Users,
      bg: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Orders",
      value: "1,943",
      icon: ShoppingCart,
      bg: "from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-400"
    }
  ];

  useEffect(() => {
    fetchProducts();
    fetchFilters();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('/api/products');
      if (response.ok) {
        const data = await response.json();
        setProducts(data.products || []);
      } else {
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands')
      ]);
      
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      }
      
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        setBrands(brandsData);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.category?.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (product.brand?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleViewProduct = (product) => {
    setSelectedProduct(product);
    setShowViewDialog(true);
  };

  const handleEditProduct = (product) => {
    setSelectedProduct(product);
    setShowEditDialog(true);
  };

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        console.log('Attempting to delete product:', productId);
        
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        console.log('Delete response status:', response.status);
        console.log('Delete response ok:', response.ok);

        if (response.ok) {
          setProducts(products.filter(p => p.id !== productId));
          alert('Product deleted successfully');
        } else {
          const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
          console.error('Delete failed:', errorData);
          alert('Failed to delete product: ' + (errorData.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product: ' + error.message);
      }
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      {/* Header */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600">
              Products Dashboard
            </h1>
            <p className="text-gray-400 mt-2">Manage your product inventory and details</p>
          </div>
          
          <div className="flex items-center gap-4">
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium shadow-lg">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Product
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[525px] bg-zinc-900 border-yellow-500/20">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-bold text-yellow-500">Create New Product</DialogTitle>
                  <DialogDescription className="text-gray-300">
                    Add a new product to your inventory.
                  </DialogDescription>
                </DialogHeader>
                <CreateProductDialog 
                  onClose={() => setIsCreateDialogOpen(false)} 
                  categories={categories}
                  brands={brands}
                  onProductCreated={handleProductCreated}
                />
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </motion.div>

      {/* Stats Cards */}
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        variants={staggerContainer}
        initial="initial"
        animate="animate"
      >
        {stats.map((stat, index) => (
          <motion.div
            key={index}
            variants={fadeIn}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-yellow-500/30 hover:shadow-lg transition-all duration-300">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-300">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full bg-gradient-to-br ${stat.bg}`}>
                  <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-white">{stat.value}</div>
                <p className="text-xs text-gray-400 flex items-center mt-1">
                  <ArrowUpRight className="h-3 w-3 mr-1 text-green-400" />
                  +12% from last month
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Search and Filters */}
      <motion.div 
        className="mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
      >
        <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
          <CardContent className="p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-yellow-500"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant={activeView === "grid" ? "default" : "outline"}
                  onClick={() => setActiveView("grid")}
                  className={activeView === "grid" ? "bg-yellow-500 text-black" : "border-zinc-700 text-gray-300 hover:bg-zinc-800"}
                >
                  <Layers className="h-4 w-4 mr-2" />
                  Grid
                </Button>
                <Button
                  variant={activeView === "table" ? "default" : "outline"}
                  onClick={() => setActiveView("table")}
                  className={activeView === "table" ? "bg-yellow-500 text-black" : "border-zinc-700 text-gray-300 hover:bg-zinc-800"}
                >
                  <BarChart className="h-4 w-4 mr-2" />
                  Table
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Products Grid/Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
          <CardHeader>
            <CardTitle className="text-white">Products ({filteredProducts.length})</CardTitle>
            <CardDescription className="text-gray-400">
              Manage your product inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeView === "grid" ? (
              <motion.div 
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
              >
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    variants={fadeIn}
                    transition={{ duration: 0.4, delay: index * 0.05 }}
                    whileHover={{ y: -5, scale: 1.02, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <Card className="h-full bg-gradient-to-b from-zinc-900 to-black hover:shadow-xl transition-all duration-300 border-zinc-800 hover:border-yellow-500/30 overflow-hidden group">
                      <CardHeader className="pb-2">
                        <div className="flex justify-between items-start">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-full bg-yellow-500/10 flex items-center justify-center">
                              <Package className="h-5 w-5 text-yellow-500" />
                            </div>
                            <div>
                              <CardTitle className="text-white group-hover:text-yellow-500 transition-colors duration-200">
                                {product.name}
                              </CardTitle>
                              <CardDescription className="text-gray-400">
                                {product.category?.name || 'Unknown Category'}
                              </CardDescription>
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0 text-gray-400 hover:text-yellow-500 hover:bg-transparent">
                                <MoreHorizontal className="h-5 w-5" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end" className="bg-zinc-900 border-zinc-800">
                              <DropdownMenuItem 
                                className="text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-500 cursor-pointer"
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-500 cursor-pointer"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem 
                                className="text-red-400 hover:bg-red-500/10 cursor-pointer"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <Badge variant="secondary" className="bg-zinc-800 text-gray-300 font-normal">
                            {product.category?.name || 'Unknown Category'}
                          </Badge>
                          <Badge 
                            className={`${
                              product.status === 'Featured' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 
                              product.status === 'Low Stock' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 
                              'bg-blue-500/20 text-blue-400 border-blue-500/20'
                            }`}
                          >
                            {product.status || 'In Stock'}
                          </Badge>
                        </div>
                        
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Price</span>
                            <span className="text-white font-semibold">${product.variants?.[0]?.price || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Stock</span>
                            <span className="text-white font-semibold">{product.totalStock || 0}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-400 text-sm">Brand</span>
                            <span className="text-white font-semibold">{product.brand?.name || 'N/A'}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="rounded-lg border border-zinc-800 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-zinc-800/50">
                      <tr className="border-b border-zinc-800">
                        <th className="h-10 px-4 text-left font-medium text-gray-300">Product</th>
                        <th className="h-10 px-4 text-left font-medium text-gray-300">Category</th>
                        <th className="h-10 px-4 text-left font-medium text-gray-300">Brand</th>
                        <th className="h-10 px-4 text-right font-medium text-gray-300">Price</th>
                        <th className="h-10 px-4 text-right font-medium text-gray-300">Stock</th>
                        <th className="h-10 px-4 text-left font-medium text-gray-300">Status</th>
                        <th className="h-10 px-4 text-right font-medium text-gray-300">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredProducts.map((product) => (
                        <tr 
                          key={product.id} 
                          className="border-b border-zinc-800/50 hover:bg-zinc-900/50 transition-colors"
                        >
                          <td className="p-4 align-middle">
                            <div className="flex items-center gap-3">
                              <div className="h-9 w-9 rounded-md bg-yellow-500/10 p-2 flex items-center justify-center">
                                <Package className="h-5 w-5 text-yellow-500" />
                              </div>
                              <span className="font-medium text-white">{product.name}</span>
                            </div>
                          </td>
                          <td className="p-4 align-middle text-gray-300">{product.category?.name || 'N/A'}</td>
                          <td className="p-4 align-middle text-gray-300">{product.brand?.name || 'N/A'}</td>
                          <td className="p-4 align-middle text-right text-white">${product.variants?.[0]?.price || 0}</td>
                          <td className="p-4 align-middle text-right text-white">{product.totalStock || 0}</td>
                          <td className="p-4 align-middle">
                            <Badge 
                              className={`${
                                product.status === 'Featured' ? 'bg-green-500/20 text-green-400 border-green-500/20' : 
                                product.status === 'Low Stock' ? 'bg-red-500/20 text-red-400 border-red-500/20' : 
                                'bg-blue-500/20 text-blue-400 border-blue-500/20'
                              }`}
                            >
                              {product.status || 'In Stock'}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                                onClick={() => handleViewProduct(product)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10"
                                onClick={() => handleEditProduct(product)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-500/10"
                                onClick={() => handleDeleteProduct(product.id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* View Product Dialog */}
      <Dialog open={showViewDialog} onOpenChange={setShowViewDialog}>
        <DialogContent className="sm:max-w-[600px] bg-zinc-900 border-yellow-500/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-yellow-500">Product Details</DialogTitle>
            <DialogDescription className="text-gray-300">View complete product information.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-yellow-500 font-medium">Product Name</Label>
                  <p className="text-white mt-1">{selectedProduct.name}</p>
                </div>
                <div>
                  <Label className="text-yellow-500 font-medium">Category</Label>
                  <p className="text-white mt-1">{selectedProduct.category?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-yellow-500 font-medium">Brand</Label>
                  <p className="text-white mt-1">{selectedProduct.brand?.name || 'N/A'}</p>
                </div>
                <div>
                  <Label className="text-yellow-500 font-medium">Price</Label>
                  <p className="text-white mt-1">${selectedProduct.variants?.[0]?.price || selectedProduct.price || 0}</p>
                </div>
                <div>
                  <Label className="text-yellow-500 font-medium">Stock</Label>
                  <p className="text-white mt-1">{selectedProduct.totalStock || selectedProduct.variants?.[0]?.stock || 0}</p>
                </div>
                <div>
                  <Label className="text-yellow-500 font-medium">Status</Label>
                  <Badge className={`mt-1 ${
                    selectedProduct.status === 'Featured' ? 'bg-green-500/20 text-green-400' : 
                    selectedProduct.status === 'Low Stock' ? 'bg-red-500/20 text-red-400' : 
                    'bg-blue-500/20 text-blue-400'
                  }`}>
                    {selectedProduct.status || 'In Stock'}
                  </Badge>
                </div>
              </div>
              <div>
                <Label className="text-yellow-500 font-medium">Description</Label>
                <p className="text-white mt-1">{selectedProduct.description || 'No description available'}</p>
              </div>
              <div className="flex justify-end pt-4">
                <Button 
                  onClick={() => setShowViewDialog(false)}
                  className="bg-yellow-500 hover:bg-yellow-600 text-black"
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Product Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[525px] bg-zinc-900 border-yellow-500/20 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-yellow-500">Edit Product</DialogTitle>
            <DialogDescription className="text-gray-300">Update the product details.</DialogDescription>
          </DialogHeader>
          {selectedProduct && (
            <EditProductDialog 
              product={selectedProduct}
              onClose={() => setShowEditDialog(false)} 
              categories={categories}
              brands={brands}
              onProductUpdated={(updatedProduct) => {
                setProducts(products.map(p => p.id === updatedProduct.id ? updatedProduct : p));
                setShowEditDialog(false);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// Create Product Dialog Component
function CreateProductDialog({ onClose, categories, brands, onProductCreated }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    categoryId: "",
    brandId: "",
    price: "",
    stock: "",
    sku: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description || !formData.categoryId || !formData.brandId) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const productData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        variants: [{
          sku: formData.sku || `${formData.name.replace(/\s+/g, '-').toUpperCase()}-001`,
          price: parseFloat(formData.price) || 0,
          stock: parseInt(formData.stock) || 0
        }]
      };

      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(productData),
      });

      if (response.ok) {
        const newProduct = await response.json();
        onProductCreated(newProduct);
        setFormData({
          name: "",
          description: "",
          categoryId: "",
          brandId: "",
          price: "",
          stock: "",
          sku: ""
        });
        onClose();
        alert('Product created successfully!');
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        alert('Failed to create product: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name" className="text-yellow-500">Product Name*</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="price" className="text-yellow-500">Price</Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description" className="text-yellow-500">Description*</Label>
        <Input
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-zinc-800 border-zinc-700 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="categoryId" className="text-yellow-500">Category*</Label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="cpu">CPU</option>
            <option value="gpu">GPU</option>
            <option value="ram">RAM</option>
            <option value="storage">Storage</option>
            <option value="motherboard">Motherboard</option>
            <option value="psu">PSU</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="brandId" className="text-yellow-500">Brand*</Label>
          <select
            id="brandId"
            value={formData.brandId}
            onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-md"
            required
          >
            <option value="">Select Brand</option>
            <option value="intel">Intel</option>
            <option value="amd">AMD</option>
            <option value="nvidia">NVIDIA</option>
            <option value="corsair">Corsair</option>
            <option value="samsung">Samsung</option>
            <option value="asus">ASUS</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="stock" className="text-yellow-500">Stock</Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="sku" className="text-yellow-500">SKU</Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            placeholder="Auto-generated if empty"
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          {isSubmitting ? 'Creating...' : 'Create Product'}
        </Button>
      </div>
    </form>
  );
}

// Edit Product Dialog Component  
function EditProductDialog({ product, onClose, categories, brands, onProductUpdated }) {
  const [formData, setFormData] = useState({
    name: product.name || "",
    description: product.description || "",
    categoryId: product.category?.id || "",
    brandId: product.brand?.id || "",
    price: product.variants?.[0]?.price?.toString() || "",
    stock: product.totalStock?.toString() || "",
    sku: product.variants?.[0]?.sku || ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      setIsSubmitting(true);
      
      // For now, just update the local state since we're using mock data
      const updatedProduct = {
        ...product,
        name: formData.name,
        description: formData.description,
        category: { id: formData.categoryId, name: formData.categoryId },
        brand: { id: formData.brandId, name: formData.brandId },
        variants: [{
          ...product.variants?.[0],
          price: parseFloat(formData.price) || 0,
          sku: formData.sku
        }],
        totalStock: parseInt(formData.stock) || 0
      };
      
      onProductUpdated(updatedProduct);
      alert('Product updated successfully!');
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Failed to update product: ' + error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-name" className="text-yellow-500">Product Name*</Label>
          <Input
            id="edit-name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-price" className="text-yellow-500">Price</Label>
          <Input
            id="edit-price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({ ...formData, price: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="edit-description" className="text-yellow-500">Description*</Label>
        <Input
          id="edit-description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          className="bg-zinc-800 border-zinc-700 text-white"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-categoryId" className="text-yellow-500">Category*</Label>
          <select
            id="edit-categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-md"
            required
          >
            <option value="">Select Category</option>
            <option value="cpu">CPU</option>
            <option value="gpu">GPU</option>
            <option value="ram">RAM</option>
            <option value="storage">Storage</option>
            <option value="motherboard">Motherboard</option>
            <option value="psu">PSU</option>
          </select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-brandId" className="text-yellow-500">Brand*</Label>
          <select
            id="edit-brandId"
            value={formData.brandId}
            onChange={(e) => setFormData({ ...formData, brandId: e.target.value })}
            className="w-full p-2 bg-zinc-800 border border-zinc-700 text-white rounded-md"
            required
          >
            <option value="">Select Brand</option>
            <option value="intel">Intel</option>
            <option value="amd">AMD</option>
            <option value="nvidia">NVIDIA</option>
            <option value="corsair">Corsair</option>
            <option value="samsung">Samsung</option>
            <option value="asus">ASUS</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="edit-stock" className="text-yellow-500">Stock</Label>
          <Input
            id="edit-stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="edit-sku" className="text-yellow-500">SKU</Label>
          <Input
            id="edit-sku"
            value={formData.sku}
            onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
            className="bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700">
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-yellow-500 hover:bg-yellow-600 text-black"
        >
          {isSubmitting ? 'Updating...' : 'Update Product'}
        </Button>
      </div>
    </form>
  );
}
