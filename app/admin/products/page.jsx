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
  const [activeView, setActiveView] = useState("grid"); // "grid" or "table"
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("all");

  // Mock data for demonstration
  const mockProducts = [
    {
      id: "1",
      name: "AMD Ryzen 9 7900X",
      category: { name: "CPU" },
      brand: { name: "AMD" },
      variants: [
        { id: "v1", sku: "AMD-7900X-001", price: 599.99, attributes: {} }
      ],
      totalStock: 45,
      averageRating: 4.8,
      reviewCount: 124,
      createdAt: new Date(),
      images: [],
      status: "In Stock"
    },
    {
      id: "2",
      name: "NVIDIA GeForce RTX 4080 SUPER",
      category: { name: "GPU" },
      brand: { name: "NVIDIA" },
      variants: [
        { id: "v2", sku: "NV-4080S-001", price: 999.99, attributes: {} }
      ],
      totalStock: 23,
      averageRating: 4.9,
      reviewCount: 89,
      createdAt: new Date(),
      images: [],
      status: "Featured"
    },
    {
      id: "3",
      name: "Samsung 980 PRO NVMe SSD 2TB",
      category: { name: "Storage" },
      brand: { name: "Samsung" },
      variants: [
        { id: "v3", sku: "SAM-980P-2TB", price: 229.99, attributes: {} }
      ],
      totalStock: 78,
      averageRating: 4.7,
      reviewCount: 231,
      createdAt: new Date(),
      images: [],
      status: "In Stock"
    },
    {
      id: "4",
      name: "ASUS ROG Strix X670E-E Gaming WiFi",
      category: { name: "Motherboard" },
      brand: { name: "ASUS" },
      variants: [
        { id: "v4", sku: "ASUS-X670E-001", price: 499.99, attributes: {} }
      ],
      totalStock: 12,
      averageRating: 4.6,
      reviewCount: 67,
      createdAt: new Date(),
      images: [],
      status: "Low Stock"
    }
  ];

  // Mock stats with enhanced visual styling
  const stats = [
    {
      title: "Total Products",
      value: "247",
      change: "+12%",
      positive: true,
      icon: Package,
      bg: "from-yellow-500/20 to-yellow-700/20",
      iconColor: "text-yellow-500"
    },
    {
      title: "Total Revenue",
      value: "$89,432",
      change: "+8.2%",
      positive: true,
      icon: DollarSign,
      bg: "from-emerald-500/20 to-emerald-700/20",
      iconColor: "text-emerald-500"
    },
    {
      title: "Active Users",
      value: "1,429",
      change: "+5.1%",
      positive: true,
      icon: Users,
      bg: "from-blue-500/20 to-blue-700/20",
      iconColor: "text-blue-500"
    },
    {
      title: "Orders Today",
      value: "34",
      change: "+18%",
      positive: true,
      icon: ShoppingCart,
      bg: "from-purple-500/20 to-purple-700/20", 
      iconColor: "text-purple-500"
    }
  ];

  useEffect(() => {
    fetchProducts();
    fetchFilters();

    // Add subtle background animations
    const interval = setInterval(() => {
      const dots = document.querySelectorAll('.animated-dot');
      dots.forEach(dot => {
        const x = Math.random() * 20 - 10;
        const y = Math.random() * 20 - 10;
        dot.style.transform = `translate(${x}px, ${y}px)`;
      });
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products?limit=100');
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || []);
      } else {
        console.error("Error fetching products:", data.error);
        // Set mock data as fallback
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Set mock data as fallback
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
    product.category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteProduct = async (productId) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        const response = await fetch(`/api/products/${productId}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          setProducts(products.filter(p => p.id !== productId));
        } else {
          const error = await response.json();
          console.error('Error deleting product:', error);
          alert('Failed to delete product');
        }
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Failed to delete product');
      }
    }
  };

  const handleProductCreated = (newProduct) => {
    setProducts([newProduct, ...products]);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl animate-pulse-slow"></div>
      <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-yellow-600/5 blur-3xl animate-pulse-slower"></div>
      <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-yellow-400/5 blur-3xl animate-pulse-slow"></div>
      
      {/* Animated dots */}
      <div className="absolute top-40 right-20 w-2 h-2 rounded-full bg-yellow-400/60 shadow-lg shadow-yellow-400/20 animated-dot"></div>
      <div className="absolute top-1/2 left-32 w-1.5 h-1.5 rounded-full bg-yellow-500/60 shadow-lg shadow-yellow-500/20 animated-dot"></div>
      <div className="absolute bottom-40 right-1/3 w-2 h-2 rounded-full bg-yellow-300/60 shadow-lg shadow-yellow-300/20 animated-dot"></div>
      
      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9InJnYmEoMjU1LDIxNSwwLDAuMDMpIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTAgMzBoMzB2MzBIMHoiIHN0cm9rZT0icmdiYSgyNTUsMjE1LDAsMC4wMykiIHN0cm9rZS13aWR0aD0iLjUiLz48L2c+PC9zdmc+')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-block"
            >
              <Badge 
                variant="outline" 
                className="mb-4 py-1.5 px-6 bg-gradient-to-r from-black/60 to-yellow-600/30 border-yellow-500/40 text-yellow-500 rounded-full shadow-md relative overflow-hidden group"
              >
                <Sparkles className="w-3.5 h-3.5 mr-1.5 text-yellow-400 group-hover:scale-110 transition-transform" /> 
                Admin Dashboard
                <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/0 via-yellow-400/30 to-yellow-400/0 rounded-full blur-sm animate-shimmer-slow"></div>
              </Badge>
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-extrabold mb-2 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-md">
              Product Management
            </h1>
            
            <div className="w-20 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mb-3 rounded-full shadow-lg shadow-yellow-500/20"></div>
            <p className="text-gray-300 mt-2 text-lg">Manage your product catalog and inventory</p>
          </div>
          
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black font-medium shadow-lg hover:shadow-xl transition-all px-6 py-6">
                <Plus className="w-5 h-5 mr-2" />
                Add Product
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[525px] bg-zinc-900 border-yellow-500/20 shadow-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-yellow-500">Create New Product</DialogTitle>
                <DialogDescription className="text-gray-300">Fill out the details to add a new product to your store.</DialogDescription>
              </DialogHeader>
              <CreateProductDialog 
                onClose={() => setIsCreateDialogOpen(false)} 
                categories={categories}
                brands={brands}
                onProductCreated={handleProductCreated}
              />
            </DialogContent>
          </Dialog>
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
                  <div className="text-3xl font-bold text-white">{stat.value}</div>
                  <p className={`text-xs flex items-center mt-2 ${stat.positive ? 'text-emerald-500' : 'text-red-500'}`}>
                    <ArrowUpRight className="h-3 w-3 mr-1" />
                    {stat.change} from last month
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* View Toggle and Search */}
        <motion.div 
          className="flex flex-col md:flex-row gap-6 items-center justify-between mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <div className="flex items-center gap-2 p-1 bg-zinc-900/50 rounded-xl border border-zinc-800">
            <Button 
              variant={activeView === 'grid' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveView('grid')}
              className={activeView === 'grid' ? 
                'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' : 
                'text-gray-300 hover:text-yellow-500'}
            >
              <Layers className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button 
              variant={activeView === 'table' ? 'default' : 'ghost'} 
              size="sm"
              onClick={() => setActiveView('table')}
              className={activeView === 'table' ? 
                'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black' : 
                'text-gray-300 hover:text-yellow-500'}
            >
              <BarChart className="h-4 w-4 mr-2" />
              Table
            </Button>
          </div>
          
          <Card className="w-full md:w-auto bg-transparent border-0 shadow-none">
            <CardContent className="p-0">
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-yellow-500" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-zinc-900 border-zinc-800 focus:border-yellow-500/50 focus:ring-1 focus:ring-yellow-500/20 text-white min-w-[300px]"
                  />
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="outline" 
                      className="border-zinc-800 text-gray-300 hover:text-yellow-500 hover:bg-yellow-500/5 hover:border-yellow-500/30"
                    >
                      <Filter className="w-4 h-4 mr-2" />
                      {activeFilter === 'all' ? 'All Products' : activeFilter}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-zinc-900 border-zinc-800 text-white">
                    <DropdownMenuItem 
                      onClick={() => setActiveFilter('all')}
                      className={`${activeFilter === 'all' ? 'bg-yellow-500/20 text-yellow-500' : ''} cursor-pointer hover:bg-yellow-500/10 hover:text-yellow-500`}
                    >
                      All Products
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setActiveFilter('In Stock')}
                      className={`${activeFilter === 'In Stock' ? 'bg-yellow-500/20 text-yellow-500' : ''} cursor-pointer hover:bg-yellow-500/10 hover:text-yellow-500`}
                    >
                      In Stock
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setActiveFilter('Low Stock')}
                      className={`${activeFilter === 'Low Stock' ? 'bg-yellow-500/20 text-yellow-500' : ''} cursor-pointer hover:bg-yellow-500/10 hover:text-yellow-500`}
                    >
                      Low Stock
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => setActiveFilter('Featured')}
                      className={`${activeFilter === 'Featured' ? 'bg-yellow-500/20 text-yellow-500' : ''} cursor-pointer hover:bg-yellow-500/10 hover:text-yellow-500`}
                    >
                      Featured
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        </motion.div>

      {/* Products Display */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate"
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-zinc-700 transition-all duration-300">
          <CardHeader className="border-b border-zinc-800/50 pb-4">
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="text-xl text-white">Products <span className="text-yellow-500">({filteredProducts.length})</span></CardTitle>
                <CardDescription className="text-gray-300 mt-1">
                  Manage your product inventory and details
                </CardDescription>
              </div>
              
              {activeFilter !== 'all' && (
                <Badge className="bg-yellow-500/20 text-yellow-500 border-yellow-500/30 hover:bg-yellow-500/30 transition-colors cursor-pointer" onClick={() => setActiveFilter('all')}>
                  {activeFilter} ×
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pt-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-4 border-yellow-500/30 animate-ping absolute"></div>
                  <div className="h-16 w-16 animate-spin text-yellow-500 relative border-4 border-yellow-500/50 border-t-transparent rounded-full"></div>
                </div>
                <span className="text-gray-300 text-lg mt-6 font-medium">Loading products...</span>
              </div>
            ) : filteredProducts.length === 0 ? (
              <motion.div 
                className="text-center py-16 max-w-md mx-auto"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="bg-yellow-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Search className="h-10 w-10 text-yellow-500/70" />
                </div>
                <p className="text-2xl font-medium mb-3 text-yellow-500">No products found</p>
                <p className="text-gray-300 mb-8">Try searching with different keywords or clear filters</p>
                <Button 
                  onClick={() => { setSearchTerm(""); setActiveFilter("all"); }}
                  variant="outline" 
                  size="lg" 
                  className="border-yellow-500/30 hover:border-yellow-500/50 text-yellow-500/90"
                >
                  View All Products
                </Button>
              </motion.div>
            ) : activeView === 'grid' ? (
              <motion.div 
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
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
                      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                      
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
                              <CardDescription className="text-gray-300 mt-1">
                                {product.brand.name}
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
                              <DropdownMenuItem className="text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-500 cursor-pointer">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-gray-300 hover:bg-yellow-500/10 hover:text-yellow-500 cursor-pointer">
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
                            {product.category.name}
                          </Badge>
                          <Badge 
                            className={`
                              ${product.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 
                                product.status === 'Featured' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 
                                product.status === 'Low Stock' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 
                                'bg-gray-500/20 text-gray-500 border-gray-500/30'}
                            `}
                          >
                            {product.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 gap-2 mt-3 text-sm">
                          <div className="bg-zinc-900/50 p-2 rounded-md">
                            <div className="text-gray-400 text-xs">Price</div>
                            <div className="text-white font-medium">${product.variants[0].price}</div>
                          </div>
                          <div className="bg-zinc-900/50 p-2 rounded-md">
                            <div className="text-gray-400 text-xs">Stock</div>
                            <div className="text-white font-medium">{product.totalStock}</div>
                          </div>
                          <div className="bg-zinc-900/50 p-2 rounded-md">
                            <div className="text-gray-400 text-xs">Rating</div>
                            <div className="text-white font-medium flex items-center">
                              {product.averageRating} 
                              <span className="text-yellow-500 ml-1">★</span>
                            </div>
                          </div>
                          <div className="bg-zinc-900/50 p-2 rounded-md">
                            <div className="text-gray-400 text-xs">Reviews</div>
                            <div className="text-white font-medium">{product.reviewCount}</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </motion.div>
            ) : (
              <div className="overflow-hidden rounded-md border border-zinc-800">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="bg-zinc-900/70 border-b border-zinc-800">
                        <th className="h-10 px-4 text-left font-medium text-gray-300">Product</th>
                        <th className="h-10 px-4 text-left font-medium text-gray-300">Category</th>
                        <th className="h-10 px-4 text-left font-medium text-gray-300">Brand</th>
                        <th className="h-10 px-4 text-right font-medium text-gray-300">Price</th>
                        <th className="h-10 px-4 text-right font-medium text-gray-300">Stock</th>
                        <th className="h-10 px-4 text-right font-medium text-gray-300">Status</th>
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
                          <td className="p-4 align-middle text-gray-300">{product.category.name}</td>
                          <td className="p-4 align-middle text-gray-300">{product.brand.name}</td>
                          <td className="p-4 align-middle text-right text-white">${product.variants[0].price}</td>
                          <td className="p-4 align-middle text-right text-white">{product.totalStock}</td>
                          <td className="p-4 align-middle text-right">
                            <Badge 
                              className={`
                                ${product.status === 'In Stock' ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/30' : 
                                  product.status === 'Featured' ? 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30' : 
                                  product.status === 'Low Stock' ? 'bg-amber-500/20 text-amber-500 border-amber-500/30' : 
                                  'bg-gray-500/20 text-gray-500 border-gray-500/30'}
                              `}
                            >
                              {product.status}
                            </Badge>
                          </td>
                          <td className="p-4 align-middle text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10">
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-yellow-500 hover:bg-yellow-500/10">
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
      
      {/* Enhanced Call to Action */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.8 }}
        className="mt-16 mb-10"
      >
        <Card className="bg-gradient-to-br from-black via-zinc-900 to-yellow-950/5 border-yellow-500/20 hover:border-yellow-500/40 hover:shadow-2xl transition-all duration-500">
          <CardContent className="py-12 px-8">
            <div className="max-w-lg mx-auto text-center">
              <div className="bg-gradient-to-br from-yellow-500/20 to-yellow-700/20 w-16 h-16 flex items-center justify-center rounded-full mx-auto mb-6 shadow-inner">
                <Sparkles className="h-8 w-8 text-yellow-500" />
              </div>
              <h3 className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 drop-shadow-sm">
                Need to add new products?
              </h3>
              <p className="text-gray-300 mb-8 max-w-md mx-auto">
                Streamline your inventory management with our bulk import tool. 
                Add multiple products at once and save time.
              </p>
              <Button className="bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 shadow-lg hover:shadow-xl px-8 py-2.5 text-black font-medium transition-all">
                Try Bulk Import Tool
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
      </div>
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
    setIsSubmitting(true);

    try {
      const productData = {
        name: formData.name,
        description: formData.description,
        categoryId: formData.categoryId,
        brandId: formData.brandId,
        variants: [{
          sku: formData.sku || `${formData.name.replace(/\s+/g, '-').toUpperCase()}-001`,
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock)
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
        onClose();
      } else {
        const error = await response.json();
        console.error('Error creating product:', error);
        alert('Failed to create product: ' + (error.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating product:', error);
      alert('Failed to create product');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right text-gray-300">
            Name
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right text-gray-300">
            Description
          </Label>
          <Input
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({...formData, description: e.target.value})}
            className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="categoryId" className="text-right text-gray-300">
            Category
          </Label>
          <select
            id="categoryId"
            value={formData.categoryId}
            onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
            className="col-span-3 bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2"
            required
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="brandId" className="text-right text-gray-300">
            Brand
          </Label>
          <select
            id="brandId"
            value={formData.brandId}
            onChange={(e) => setFormData({...formData, brandId: e.target.value})}
            className="col-span-3 bg-zinc-800 border border-zinc-700 text-white rounded-md px-3 py-2"
            required
          >
            <option value="">Select Brand</option>
            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="sku" className="text-right text-gray-300">
            SKU
          </Label>
          <Input
            id="sku"
            value={formData.sku}
            onChange={(e) => setFormData({...formData, sku: e.target.value})}
            className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            placeholder="Auto-generated if empty"
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="price" className="text-right text-gray-300">
            Price
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            value={formData.price}
            onChange={(e) => setFormData({...formData, price: e.target.value})}
            className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
        
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="stock" className="text-right text-gray-300">
            Stock
          </Label>
          <Input
            id="stock"
            type="number"
            value={formData.stock}
            onChange={(e) => setFormData({...formData, stock: e.target.value})}
            className="col-span-3 bg-zinc-800 border-zinc-700 text-white"
            required
          />
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose} className="border-zinc-700 text-gray-300 hover:bg-zinc-800">
          Cancel
        </Button>
        <Button type="submit" className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
              Creating...
            </>
          ) : (
            'Create Product'
          )}
        </Button>
      </div>
    </form>
  );
}
