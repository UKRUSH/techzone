"use client";

// Updated delete and edit functionality - v2.0
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Package, 
  Search, 
  RefreshCw,
  Eye,
  DollarSign,
  Tag,
  Boxes,
  Loader2,
  CheckCircle,
  X,
  Save,
  ImageIcon,
  Filter,
  MoreHorizontal,
  Star,
  Sparkles,
  Zap,
  TrendingUp,
  Crown,
  Shield,
  Bolt,
  AlertCircle
} from "lucide-react";

export default function AdminProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    brand: '',
    stock: '',
    imageUrl: ''
  });

  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchBrands();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Add timestamp to prevent caching
      const timestamp = Date.now();
      const response = await fetch(`/api/products?_t=${timestamp}`);
      if (response.ok) {
        const result = await response.json();
        setProducts(result.success ? result.data : []);
        console.log(`🔄 Refreshed products list: ${result.data?.length || 0} products`);
      } else {
        console.error("Failed to fetch products from database");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const result = await response.json();
        setCategories(result.success ? result.data : []);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const result = await response.json();
        setBrands(result.success ? result.data : []);
      }
    } catch (error) {
      console.error("Error fetching brands:", error);
    }
  };

  // Filter products based on search and category
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (typeof product.category === 'object' ? product.category?.name : product.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      if (!formData.name) {
        alert('Please enter a product name');
        setIsSubmitting(false);
        return;
      }

      if (!formData.price) {
        alert('Please enter a price');
        setIsSubmitting(false);
        return;
      }

      if (!formData.category) {
        alert('Please select a category');
        setIsSubmitting(false);
        return;
      }

      if (!formData.brand) {
        alert('Please select a brand');
        setIsSubmitting(false);
        return;
      }

      console.log('📦 Saving product to MongoDB database...');
      const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          brand: formData.brand,
          variants: [{
            sku: `${formData.name.replace(/\s+/g, '-').toUpperCase()}-001`,
            price: parseFloat(formData.price) || 0,
            attributes: {
              stock: parseInt(formData.stock) || 0,
              imageUrl: formData.imageUrl.trim()
            }
          }]
        }),
      });

      if (response.ok) {
        const result = await response.json();
        setFormData({
          name: '',
          description: '',
          price: '',
          category: '',
          brand: '',
          stock: '',
          imageUrl: ''
        });
        setShowAddForm(false);
        fetchProducts();
        alert('Product created successfully!');
        console.log('✅ Product created:', result.data);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create product'}`);
        console.error('❌ API Error:', error);
      }
    } catch (error) {
      console.error('❌ Error creating product:', error);
      alert('Error creating product. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: (product.variants?.[0]?.price || 0).toString(),
      category: typeof product.category === 'object' ? product.category?.name : product.category || '',
      brand: typeof product.brand === 'object' ? product.brand?.name : product.brand || '',
      stock: (product.variants?.[0]?.attributes?.stock || 0).toString(),
      imageUrl: product.variants?.[0]?.attributes?.imageUrl || ''
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (isSubmitting) return;
    
    setIsSubmitting(true);

    try {
      if (!formData.name) {
        alert('Please enter a product name');
        setIsSubmitting(false);
        return;
      }

      if (!formData.price) {
        alert('Please enter a price');
        setIsSubmitting(false);
        return;
      }

      if (!formData.category) {
        alert('Please select a category');
        setIsSubmitting(false);
        return;
      }

      if (!formData.brand) {
        alert('Please select a brand');
        setIsSubmitting(false);
        return;
      }

      console.log('📝 Updating product in MongoDB database...');
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingProduct.id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          category: formData.category,
          brand: formData.brand,
          price: parseFloat(formData.price) || 0,
          stock: parseInt(formData.stock) || 0,
          imageUrl: formData.imageUrl.trim()
        }),
      });

      if (response.ok) {
        try {
          const result = await response.json();
          
          if (result.success) {
            setFormData({
              name: '',
              description: '',
              price: '',
              category: '',
              brand: '',
              stock: '',
              imageUrl: ''
            });
            setShowEditForm(false);
            setEditingProduct(null);
            await fetchProducts(); // Refresh the products list
            alert('Product updated successfully!');
            console.log('✅ Product updated:', result.data?.name || formData.name);
          } else {
            console.error('❌ Update failed with success=false:', result);
            alert(`Error: ${result.error || result.message || 'Update operation failed'}`);
          }
        } catch (jsonError) {
          console.error('❌ Failed to parse update response as JSON:', jsonError);
          alert('Product might have been updated, but response was invalid. Refreshing...');
          await fetchProducts();
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to update product'}`);
        console.error('❌ API Error:', error);
      }
    } catch (error) {
      console.error('❌ Error updating product:', error);
      alert('Error updating product. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      console.log('🗑️ Attempting to delete product:', { id: product.id, name: product.name });
      const response = await fetch(`/api/products?id=${product.id}`, {
        method: 'DELETE',
      });

      console.log('🗑️ Delete response status:', response.status);
      console.log('🗑️ Delete response ok:', response.ok);
      console.log('🗑️ Delete response headers:', Object.fromEntries(response.headers.entries()));

      if (response.ok) {
        try {
          const result = await response.json();
          console.log('✅ Delete result:', result);
          
          if (result.success) {
            await fetchProducts(); // Refresh the products list
            alert('Product deleted successfully!');
            console.log('✅ Product deleted successfully:', result.data?.name || product.name);
          } else {
            console.error('❌ Delete failed with success=false:', result);
            alert(`Error: ${result.error || result.message || 'Delete operation failed'}`);
          }
        } catch (jsonError) {
          console.error('❌ Failed to parse delete response as JSON:', jsonError);
          alert('Product might have been deleted, but response was invalid. Refreshing...');
          await fetchProducts();
        }
      } else {
        console.log('❌ Delete failed, response status:', response.status);
        const responseText = await response.text();
        console.log('❌ Delete response text:', responseText);
        
        let error;
        try {
          error = JSON.parse(responseText);
        } catch (parseError) {
          console.log('❌ Failed to parse error response as JSON:', parseError);
          error = { error: `HTTP ${response.status}: ${responseText || 'Unknown error'}` };
        }
        
        // Handle specific error cases
        if (error.code === 'PRODUCT_NOT_FOUND' || response.status === 404) {
          alert('This product has already been deleted or does not exist. Refreshing the list...');
          await fetchProducts(); // Refresh to show current state
        } else {
          alert(`Error: ${error.error || error.message || 'Failed to delete product'}`);
        }
        console.error('❌ API Error:', error);
      }
    } catch (networkError) {
      console.error('❌ Network error deleting product:', networkError);
      alert('Network error occurred while deleting product. Please check your connection.');
    }
  };

  const handleClearAllProducts = async () => {
    if (!confirm(`Are you sure you want to delete ALL products? This action cannot be undone and will permanently remove ${products.length} products from your database.`)) {
      return;
    }

    // Double confirmation for such a destructive action
    const confirmText = prompt(`This will delete ${products.length} products permanently. Type "DELETE ALL" to confirm:`);
    if (confirmText !== "DELETE ALL") {
      alert('Confirmation failed. Products were not deleted.');
      return;
    }

    try {
      setLoading(true);
      console.log('🗑️ Clearing all products from database...');
      
      const response = await fetch('/api/products/clear', {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        console.log('✅ Clear all result:', result);
        
        if (result.success) {
          const data = result.data;
          alert(`Successfully cleared all products!\n\nDeleted:\n• ${data.products} products\n• ${data.variants} variants\n• ${data.inventory} inventory records\n• ${data.cartItems} cart items\n• ${data.orderItems} order items`);
          await fetchProducts(); // Refresh the products list
        } else {
          alert(`Error: ${result.error || 'Failed to clear all products'}`);
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to clear all products'}`);
        console.error('❌ API Error:', error);
      }
      
    } catch (error) {
      console.error('❌ Error clearing all products:', error);
      alert('Error occurred while clearing products. Please check console for details.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative"
        >
          {/* Golden glow effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 blur-3xl rounded-full animate-pulse"></div>
          
          <div className="relative z-10 bg-black/90 backdrop-blur-xl border border-yellow-500/50 rounded-3xl p-10 shadow-2xl">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full blur opacity-75 animate-pulse"></div>
              <div className="relative w-20 h-20 mx-auto bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                <Loader2 className="h-10 w-10 animate-spin text-black" />
              </div>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-500 bg-clip-text text-transparent mb-3">
              Loading Products
            </h2>
            <p className="text-yellow-300 text-lg flex items-center gap-2 justify-center">
              <Bolt className="w-5 h-5" />
              Fetching your inventory...
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Enhanced Animated Background Elements with Yellow Accents */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-yellow-400/15 to-yellow-500/15 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-yellow-500/15 to-amber-500/15 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-yellow-400/8 to-yellow-500/8 rounded-full blur-3xl animate-pulse delay-500"></div>
        
        {/* Golden floating orbs */}
        <motion.div
          initial={{ x: -100, y: -100 }}
          animate={{ 
            x: [0, 100, 0, -100, 0],
            y: [0, -100, 100, 0, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-yellow-400/12 to-amber-500/12 rounded-full blur-2xl"
        ></motion.div>
        
        <motion.div
          initial={{ x: 100, y: 100 }}
          animate={{ 
            x: [0, -150, 0, 150, 0],
            y: [0, 150, -100, 0, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-amber-400/12 to-yellow-500/12 rounded-full blur-2xl"
        ></motion.div>
      </div>

      {/* Floating Action Button for Mobile - Black & Yellow Theme */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 1, type: "spring", stiffness: 200 }}
        className="fixed bottom-6 right-6 z-50 md:hidden"
      >
        <Button
          onClick={() => setShowAddForm(true)}
          className="w-16 h-16 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-black shadow-2xl border-0 group font-bold"
        >
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
          <Plus className="w-8 h-8 text-black relative z-10" />
        </Button>
      </motion.div>

      {/* Main Content */}
      <div className="relative z-10">
        {/* Black & Yellow Header Section */}
        <div className="sticky top-0 z-20 backdrop-blur-xl bg-black/80 border-b border-yellow-500/30 shadow-2xl">
          <div className="container mx-auto px-6 py-8">
            <motion.div 
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-6"
            >
              {/* Enhanced Title Section */}
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
                <div className="space-y-3">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="flex items-center gap-4"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl blur opacity-75 animate-pulse"></div>
                      <div className="relative bg-gradient-to-r from-yellow-400 to-yellow-500 p-3 rounded-2xl">
                        <Crown className="w-8 h-8 text-black" />
                      </div>
                    </div>
                    <div>
                      <h1 className="text-4xl lg:text-6xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                          Product
                        </span>
                        <span className="text-white ml-3">
                          Management
                        </span>
                      </h1>
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.3 }}
                        className="text-lg text-yellow-300 mt-2 flex items-center gap-2"
                      >
                        <Bolt className="w-5 h-5 text-yellow-400" />
                        <span>Powered by premium inventory control</span>
                      </motion.div>
                    </div>
                  </motion.div>
                  
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex items-center gap-4 text-gray-300"
                  >
                    <div className="flex items-center gap-2 bg-black/50 rounded-full px-4 py-2 border border-yellow-500/30">
                      <Package className="w-5 h-5 text-yellow-400" />
                      <span className="font-semibold text-xl text-yellow-400">{filteredProducts.length}</span>
                      <span className="text-yellow-300">products</span>
                    </div>
                    <div className="h-6 w-px bg-yellow-500/30"></div>
                    <div className="flex items-center gap-2 text-yellow-300">
                      <Shield className="w-5 h-5 text-yellow-400" />
                      <span>Elite inventory management system</span>
                    </div>
                  </motion.div>
                </div>
                
                {/* Action Buttons - Black & Yellow Theme */}
                <motion.div 
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="flex gap-3"
                >
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      onClick={() => setShowAddForm(true)}
                      className="group relative bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-black font-bold px-8 py-4 rounded-2xl shadow-2xl border-0 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-400 rounded-2xl blur opacity-75 group-hover:opacity-100 transition-opacity"></div>
                      <div className="relative flex items-center gap-3">
                        <Plus className="w-6 h-6" />
                        <span className="text-lg">Add Product</span>
                      </div>
                    </Button>
                  </motion.div>
                  
                  {products.length > 0 && (
                    <motion.div 
                      whileHover={{ scale: 1.05 }} 
                      whileTap={{ scale: 0.95 }}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.3 }}
                    >
                      <Button
                        onClick={handleClearAllProducts}
                        className="group relative bg-gradient-to-r from-gray-800 to-black hover:from-gray-700 hover:to-gray-900 text-yellow-400 font-bold px-8 py-4 rounded-2xl shadow-2xl border border-yellow-500/30 transition-all duration-300"
                        disabled={loading}
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-yellow-500/10 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        <div className="relative flex items-center gap-3">
                          <Trash2 className="w-6 h-6" />
                          <span className="text-lg">Clear All</span>
                        </div>
                      </Button>
                    </motion.div>
                  )}
                </motion.div>
              </div>

              {/* Black & Yellow Search and Filter Bar */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="bg-black/60 backdrop-blur-xl border border-yellow-500/30 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
                  {/* Golden gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/8 via-yellow-400/5 to-yellow-500/8 rounded-3xl"></div>
                  
                  <div className="relative z-10 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                    {/* Enhanced Search Input */}
                    <div className="md:col-span-6 lg:col-span-7 relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-300" />
                        <Input
                          placeholder="Search products by name, description, or category..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-12 h-14 bg-black/70 border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 text-white placeholder:text-yellow-300/70 rounded-xl text-lg font-medium transition-all duration-300 shadow-lg"
                        />
                        {searchTerm && (
                          <motion.button
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            onClick={() => setSearchTerm('')}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-400 hover:text-white transition-colors"
                          >
                            <X className="w-5 h-5" />
                          </motion.button>
                        )}
                      </div>
                    </div>
                    
                    {/* Enhanced Category Filter */}
                    <div className="md:col-span-4 lg:col-span-3 relative group">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      <select
                        value={selectedCategory}
                        onChange={(e) => setSelectedCategory(e.target.value)}
                        className="relative w-full h-14 px-4 bg-black/70 border border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 rounded-xl text-white font-medium appearance-none cursor-pointer transition-all duration-300 shadow-lg"
                      >
                        <option value="all" className="bg-black text-white">All Categories</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name} className="bg-black text-white">
                            {category.name}
                          </option>
                        ))}
                      </select>
                      <Filter className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-yellow-400 pointer-events-none group-hover:text-yellow-300 transition-colors duration-300" />
                    </div>
                    
                    {/* Enhanced Refresh Button */}
                    <div className="md:col-span-2 lg:col-span-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={fetchProducts}
                          variant="outline"
                          className="w-full h-14 border-yellow-500/40 hover:border-yellow-400/60 text-yellow-300 hover:text-yellow-400 hover:bg-yellow-400/10 bg-black/50 rounded-xl font-semibold transition-all duration-300 shadow-lg group"
                          disabled={loading}
                        >
                          <RefreshCw className={`w-5 h-5 mr-2 ${loading ? 'animate-spin' : ''} group-hover:text-yellow-300`} />
                          {loading ? 'Loading' : 'Refresh'}
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-6 py-8 space-y-8">
          {/* Enhanced Add Product Form */}
          <AnimatePresence>
            {showAddForm && (
              <motion.div
                initial={{ opacity: 0, y: -50, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -50, scale: 0.95 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className="mb-8 relative"
              >
                {/* Premium Golden Backdrop Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-amber-500/15 to-yellow-600/20 blur-3xl rounded-3xl"></div>
                
                <div className="relative bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 backdrop-blur-xl border-2 border-yellow-500/50 rounded-3xl shadow-2xl overflow-hidden">
                  {/* Animated Border Glow */}
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 via-transparent to-yellow-400/30 animate-pulse rounded-3xl"></div>
                  
                  {/* Premium Header Section */}
                  <div className="relative border-b border-yellow-500/30 bg-gradient-to-r from-black/50 to-gray-900/50 p-8">
                    <motion.div 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center gap-6">
                        <div className="relative group">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
                          <div className="relative p-4 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                            <Plus className="w-8 h-8 text-black" />
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <h2 className="text-4xl font-black tracking-tight">
                            <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                              Create Premium
                            </span>
                            <span className="text-white ml-3">Product</span>
                          </h2>
                          <div className="flex items-center gap-3 text-yellow-200">
                            <Sparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
                            <span className="text-lg font-medium">Build your elite inventory with precision</span>
                          </div>
                        </div>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setShowAddForm(false)}
                        className="p-3 bg-gray-800/50 hover:bg-gray-700/50 border border-yellow-500/30 hover:border-yellow-400/50 rounded-xl text-yellow-300 hover:text-yellow-400 transition-all duration-300"
                      >
                        <X className="w-6 h-6" />
                      </motion.button>
                    </motion.div>
                    
                    {/* Progress indicator */}
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="mt-6 flex items-center gap-4"
                    >
                      <div className="flex items-center gap-2 text-yellow-300">
                        <Crown className="w-5 h-5 text-yellow-400" />
                        <span className="font-semibold">Premium Product Creation</span>
                      </div>
                      <div className="h-px bg-gradient-to-r from-yellow-400/50 to-transparent flex-1"></div>
                      <div className="text-yellow-400 text-sm font-medium">Step 1 of 1</div>
                    </motion.div>
                  </div>
                  
                  {/* Enhanced Form Content */}
                  <div className="p-8 relative">
                    {/* Floating Background Elements */}
                    <div className="absolute top-10 right-10 w-32 h-32 bg-gradient-to-r from-yellow-400/10 to-amber-500/10 rounded-full blur-2xl animate-pulse"></div>
                    <div className="absolute bottom-10 left-10 w-24 h-24 bg-gradient-to-r from-amber-400/10 to-yellow-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
                    
                    <motion.form 
                      onSubmit={handleSubmit} 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.4 }}
                      className="relative z-10 grid gap-8 lg:grid-cols-2"
                    >
                      {/* Enhanced Form Fields with Premium Styling */}
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                        className="space-y-4 group"
                      >
                        <Label htmlFor="name" className="text-yellow-300 font-bold text-xl flex items-center gap-2">
                          <Package className="w-5 h-5 text-yellow-400" />
                          Product Name *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            className="relative h-16 bg-gradient-to-r from-black/80 to-gray-900/80 border-2 border-yellow-500/40 hover:border-yellow-400/70 focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/25 text-white text-xl rounded-2xl transition-all duration-300 backdrop-blur-sm"
                            placeholder="Enter premium product name"
                            required
                          />
                          <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/5 to-transparent pointer-events-none"></div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="space-y-4 group"
                      >
                        <Label htmlFor="price" className="text-yellow-300 font-bold text-xl flex items-center gap-2">
                          <DollarSign className="w-5 h-5 text-yellow-400" />
                          Price (Rs.) *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-green-400/20 to-emerald-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <Input
                            id="price"
                            type="number"
                            value={formData.price}
                            onChange={(e) => handleInputChange('price', e.target.value)}
                            className="relative h-16 bg-gradient-to-r from-black/80 to-gray-900/80 border-2 border-yellow-500/40 hover:border-yellow-400/70 focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/25 text-white text-xl rounded-2xl transition-all duration-300 backdrop-blur-sm"
                            placeholder="0.00"
                            required
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-400 font-bold">Rs.</div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                        className="space-y-4 group"
                      >
                        <Label htmlFor="category" className="text-yellow-300 font-bold text-xl flex items-center gap-2">
                          <Tag className="w-5 h-5 text-yellow-400" />
                          Category *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <select
                            id="category"
                            value={formData.category}
                            onChange={(e) => handleInputChange('category', e.target.value)}
                            className="relative w-full h-16 bg-gradient-to-r from-black/80 to-gray-900/80 border-2 border-yellow-500/40 hover:border-yellow-400/70 focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/25 text-white rounded-2xl px-6 text-xl transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                            required
                          >
                            <option value="" className="bg-black text-white">Select premium category</option>
                            {categories.map((category) => (
                              <option key={category.id} value={category.name} className="bg-black text-white">
                                {category.name}
                              </option>
                            ))}
                          </select>
                          <Filter className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-yellow-400 pointer-events-none" />
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 }}
                        className="space-y-4 group"
                      >
                        <Label htmlFor="brand" className="text-yellow-300 font-bold text-xl flex items-center gap-2">
                          <Star className="w-5 h-5 text-yellow-400" />
                          Brand *
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/20 to-pink-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <select
                            id="brand"
                            value={formData.brand}
                            onChange={(e) => handleInputChange('brand', e.target.value)}
                            className="relative w-full h-16 bg-gradient-to-r from-black/80 to-gray-900/80 border-2 border-yellow-500/40 hover:border-yellow-400/70 focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/25 text-white rounded-2xl px-6 text-xl transition-all duration-300 backdrop-blur-sm appearance-none cursor-pointer"
                            required
                          >
                            <option value="" className="bg-black text-white">Select elite brand</option>
                            {brands.map((brand) => (
                              <option key={brand.id} value={brand.name} className="bg-black text-white">
                                {brand.name}
                              </option>
                            ))}
                          </select>
                          <Crown className="absolute right-6 top-1/2 transform -translate-y-1/2 h-6 w-6 text-yellow-400 pointer-events-none" />
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.9 }}
                        className="space-y-4 group"
                      >
                        <Label htmlFor="stock" className="text-yellow-300 font-bold text-xl flex items-center gap-2">
                          <Boxes className="w-5 h-5 text-yellow-400" />
                          Stock Quantity
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-orange-400/20 to-red-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <Input
                            id="stock"
                            type="number"
                            value={formData.stock}
                            onChange={(e) => handleInputChange('stock', e.target.value)}
                            className="relative h-16 bg-gradient-to-r from-black/80 to-gray-900/80 border-2 border-yellow-500/40 hover:border-yellow-400/70 focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/25 text-white text-xl rounded-2xl transition-all duration-300 backdrop-blur-sm"
                            placeholder="Available quantity"
                          />
                          <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-yellow-400 font-bold">units</div>
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.0 }}
                        className="space-y-4 group"
                      >
                        <Label htmlFor="imageUrl" className="text-yellow-300 font-bold text-xl flex items-center gap-2">
                          <ImageIcon className="w-5 h-5 text-yellow-400" />
                          Product Image
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-cyan-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <Input
                            id="imageUrl"
                            value={formData.imageUrl}
                            onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                            className="relative h-16 bg-gradient-to-r from-black/80 to-gray-900/80 border-2 border-yellow-500/40 hover:border-yellow-400/70 focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/25 text-white text-xl rounded-2xl transition-all duration-300 backdrop-blur-sm"
                            placeholder="https://example.com/premium-image.jpg"
                          />
                        </div>
                      </motion.div>

                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.1 }}
                        className="lg:col-span-2 space-y-4 group"
                      >
                        <Label htmlFor="description" className="text-yellow-300 font-bold text-xl flex items-center gap-2">
                          <Edit3 className="w-5 h-5 text-yellow-400" />
                          Product Description
                        </Label>
                        <div className="relative">
                          <div className="absolute inset-0 bg-gradient-to-r from-indigo-400/20 to-purple-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                          <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            className="relative bg-gradient-to-r from-black/80 to-gray-900/80 border-2 border-yellow-500/40 hover:border-yellow-400/70 focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/25 text-white text-xl min-h-[140px] rounded-2xl transition-all duration-300 backdrop-blur-sm resize-none"
                            placeholder="Describe your premium product features, benefits, and specifications..."
                          />
                        </div>
                      </motion.div>

                      {/* Enhanced Action Buttons */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1.2 }}
                        className="lg:col-span-2 pt-8"
                      >
                        <div className="flex gap-6">
                          <motion.div 
                            whileHover={{ scale: 1.02, y: -2 }} 
                            whileTap={{ scale: 0.98 }} 
                            className="flex-1"
                          >
                            <Button
                              type="submit"
                              disabled={isSubmitting}
                              className="relative w-full h-20 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500 text-black font-black text-xl rounded-2xl shadow-2xl border-0 transition-all duration-500 overflow-hidden group"
                            >
                              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                              <div className="relative z-10 flex items-center justify-center gap-4">
                                {isSubmitting ? (
                                  <>
                                    <Loader2 className="w-7 h-7 animate-spin text-black" />
                                    <span className="tracking-wide">Creating Premium Product...</span>
                                  </>
                                ) : (
                                  <>
                                    <div className="p-2 bg-black/20 rounded-xl">
                                      <Save className="w-7 h-7 text-black" />
                                    </div>
                                    <span className="tracking-wide">Create Premium Product</span>
                                    <Sparkles className="w-6 h-6 text-black" />
                                  </>
                                )}
                              </div>
                              
                              {/* Animated background effect */}
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
                            </Button>
                          </motion.div>
                          
                          <motion.div 
                            whileHover={{ scale: 1.02, y: -2 }} 
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button
                              type="button"
                              onClick={() => setShowAddForm(false)}
                              className="h-20 px-10 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 text-yellow-300 hover:text-yellow-400 border-2 border-yellow-500/40 hover:border-yellow-400/60 rounded-2xl font-bold text-xl transition-all duration-300 backdrop-blur-sm group"
                            >
                              <div className="flex items-center gap-3">
                                <X className="w-7 h-7 group-hover:rotate-90 transition-transform duration-300" />
                                <span>Cancel</span>
                              </div>
                            </Button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.form>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          
          {/* Edit Product Form */}
          <AnimatePresence>
            {showEditForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-8"
              >
                <div className="bg-black/60 backdrop-blur-xl border border-yellow-500/40 rounded-3xl p-8 shadow-2xl">
                  <div className="mb-6">
                    <h2 className="text-3xl font-bold text-white flex items-center gap-3">
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl blur opacity-75 animate-pulse"></div>
                        <div className="relative p-2 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-xl">
                          <Edit3 className="w-6 h-6 text-black" />
                        </div>
                      </div>
                      Edit Product
                    </h2>
                    <p className="text-yellow-200 mt-2 text-lg">Update the details for "{editingProduct?.name}"</p>
                  </div>
                  <form onSubmit={handleUpdate} className="grid gap-8 md:grid-cols-2">
                    {/* Edit form fields - black & yellow styling */}
                    <div className="space-y-3 group">
                      <Label htmlFor="edit-name" className="text-yellow-300 font-semibold text-lg">Product Name *</Label>
                      <Input
                        id="edit-name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="h-14 bg-black/70 border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 text-white text-lg rounded-xl transition-all duration-300"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="edit-price" className="text-yellow-300 font-semibold text-lg">Price (Rs.) *</Label>
                      <Input
                        id="edit-price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="h-14 bg-black/70 border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 text-white text-lg rounded-xl transition-all duration-300"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="edit-category" className="text-yellow-300 font-semibold text-lg">Category *</Label>
                      <select
                        id="edit-category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full h-14 bg-black/70 border border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 text-white rounded-xl px-4 text-lg transition-all duration-300"
                        required
                      >
                        <option value="" className="bg-black">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name} className="bg-black">
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="edit-brand" className="text-yellow-300 font-semibold text-lg">Brand *</Label>
                      <select
                        id="edit-brand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="w-full h-14 bg-black/70 border border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 text-white rounded-xl px-4 text-lg transition-all duration-300"
                        required
                      >
                        <option value="" className="bg-black">Select brand</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.name} className="bg-black">
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="edit-stock" className="text-yellow-300 font-semibold text-lg">Stock Quantity</Label>
                      <Input
                        id="edit-stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value)}
                        className="h-14 bg-black/70 border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 text-white text-lg rounded-xl transition-all duration-300"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-3 group">
                      <Label htmlFor="edit-imageUrl" className="text-yellow-300 font-semibold text-lg">Image URL</Label>
                      <Input
                        id="edit-imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        className="h-14 bg-black/70 border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 text-white text-lg rounded-xl transition-all duration-300"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-3 group">
                      <Label htmlFor="edit-description" className="text-yellow-300 font-semibold text-lg">Description</Label>
                      <Textarea
                        id="edit-description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="bg-black/70 border-yellow-500/40 hover:border-yellow-400/60 focus:border-yellow-400 text-white text-lg min-h-[120px] rounded-xl transition-all duration-300"
                        placeholder="Enter product description"
                      />
                    </div>

                    <div className="md:col-span-2 flex gap-6 pt-6">
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="flex-1">
                        <Button
                          type="submit"
                          disabled={isSubmitting}
                          className="w-full h-16 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-amber-600 text-black font-bold text-lg rounded-2xl shadow-2xl border-0 transition-all duration-300"
                        >
                          {isSubmitting ? (
                            <>
                              <Loader2 className="w-6 h-6 mr-3 animate-spin text-black" />
                              Updating Product...
                            </>
                          ) : (
                            <>
                              <Save className="w-6 h-6 mr-3" />
                              Update Product
                            </>
                          )}
                        </Button>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        <Button
                          type="button"
                          onClick={() => {
                            setShowEditForm(false);
                            setEditingProduct(null);
                            setFormData({
                              name: '',
                              description: '',
                              price: '',
                              category: '',
                              brand: '',
                              stock: '',
                              imageUrl: ''
                            });
                          }}
                          className="h-16 px-8 bg-gray-800/70 hover:bg-gray-700/70 text-yellow-300 hover:text-yellow-400 border border-yellow-500/30 hover:border-yellow-400/50 rounded-2xl font-semibold text-lg transition-all duration-300"
                        >
                          <X className="w-6 h-6 mr-3" />
                          Cancel
                        </Button>
                      </motion.div>
                    </div>
                  </form>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          {/* Black & Yellow Products Grid */}
          <div className="bg-black/60 backdrop-blur-xl border border-yellow-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
            {/* Golden animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/8 via-transparent to-yellow-400/8 rounded-3xl"></div>
            
            <div className="relative z-10">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-8">
                <div className="space-y-4">
                  <motion.h2 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-3xl font-bold text-white flex items-center gap-3"
                  >
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl blur opacity-75 animate-pulse"></div>
                      <div className="relative p-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl">
                        <Boxes className="w-6 h-6 text-black" />
                      </div>
                    </div>
                    Your Products ({filteredProducts.length})
                  </motion.h2>
                  <motion.p 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="text-yellow-200 text-lg flex items-center gap-2"
                  >
                    <Star className="w-5 h-5 text-yellow-400" />
                    Elite inventory management system
                  </motion.p>
                  
                  {/* Detailed Statistics */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-4"
                  >
                    <div className="bg-green-500/10 border border-green-400/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle className="w-4 h-4 text-green-400" />
                        <span className="text-green-300 text-sm font-semibold">In Stock</span>
                      </div>
                      <p className="text-green-200 font-bold text-lg">
                        {products.filter(p => (p.variants?.[0]?.attributes?.stock || 0) > 0).length}
                      </p>
                    </div>
                    
                    <div className="bg-orange-500/10 border border-orange-400/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <AlertCircle className="w-4 h-4 text-orange-400" />
                        <span className="text-orange-300 text-sm font-semibold">Low Stock</span>
                      </div>
                      <p className="text-orange-200 font-bold text-lg">
                        {products.filter(p => {
                          const stock = p.variants?.[0]?.attributes?.stock || 0;
                          return stock > 0 && stock <= 10;
                        }).length}
                      </p>
                    </div>
                    
                    <div className="bg-red-500/10 border border-red-400/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <X className="w-4 h-4 text-red-400" />
                        <span className="text-red-300 text-sm font-semibold">Out of Stock</span>
                      </div>
                      <p className="text-red-200 font-bold text-lg">
                        {products.filter(p => (p.variants?.[0]?.attributes?.stock || 0) === 0).length}
                      </p>
                    </div>
                    
                    <div className="bg-yellow-500/10 border border-yellow-400/30 rounded-xl p-3">
                      <div className="flex items-center gap-2 mb-1">
                        <DollarSign className="w-4 h-4 text-yellow-400" />
                        <span className="text-yellow-300 text-sm font-semibold">Total Value</span>
                      </div>
                      <p className="text-yellow-200 font-bold text-lg">
                        Rs. {products.reduce((total, p) => {
                          const price = p.variants?.[0]?.price || 0;
                          const stock = p.variants?.[0]?.attributes?.stock || 0;
                          return total + (price * stock);
                        }, 0).toLocaleString()}
                      </p>
                    </div>
                  </motion.div>
                </div>
                
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className="space-y-4"
                >
                  <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 px-6 py-4 rounded-2xl border border-yellow-400/40 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-yellow-300 font-bold text-2xl">{products.length}</p>
                      <p className="text-yellow-200 text-sm">Total Products</p>
                    </div>
                  </div>
                  
                  <div className="bg-gradient-to-r from-black/40 to-gray-800/40 px-6 py-3 rounded-2xl border border-yellow-400/30 backdrop-blur-sm">
                    <div className="text-center">
                      <p className="text-white font-semibold text-lg">
                        {Math.round((products.filter(p => (p.variants?.[0]?.attributes?.stock || 0) > 0).length / Math.max(products.length, 1)) * 100)}%
                      </p>
                      <p className="text-yellow-200 text-xs">Stock Rate</p>
                    </div>
                  </div>
                </motion.div>
              </div>

            {filteredProducts.length > 0 ? (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, index) => {
                  // Debug: Log image URL to see what we're working with
                  if (product.variants?.[0]?.attributes?.imageUrl) {
                    console.log(`Product "${product.name}" image URL:`, product.variants[0].attributes.imageUrl);
                  }
                  
                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="group"
                    >
                      <div className="relative bg-black/80 backdrop-blur-xl border border-yellow-500/30 hover:border-yellow-400/60 rounded-3xl p-6 shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:scale-[1.02]">
                        {/* Golden glow effect on hover */}
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/0 via-yellow-400/0 to-yellow-500/0 group-hover:from-yellow-500/8 group-hover:via-yellow-400/8 group-hover:to-yellow-500/8 rounded-3xl transition-all duration-500"></div>
                        
                        <div className="relative z-10">
                          {/* Enhanced Product Image */}
                          <div className="aspect-video bg-gradient-to-br from-gray-800 to-black rounded-2xl mb-6 flex items-center justify-center overflow-hidden relative group-hover:shadow-lg transition-all duration-300">
                            {product.variants?.[0]?.attributes?.imageUrl ? (
                              <img
                                src={product.variants[0].attributes.imageUrl}
                                alt={product.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                onLoad={(e) => {
                                  console.log('Image loaded successfully:', product.variants[0].attributes.imageUrl);
                                }}
                                onError={(e) => {
                                  console.log('Image failed to load:', product.variants[0].attributes.imageUrl);
                                  e.target.style.display = 'none';
                                  const fallback = e.target.parentElement.querySelector('.image-fallback');
                                  if (fallback) fallback.style.display = 'flex';
                                }}
                              />
                            ) : null}
                            
                            <div 
                              className={`image-fallback absolute inset-0 flex flex-col items-center justify-center ${
                                product.variants?.[0]?.attributes?.imageUrl ? 'hidden' : 'flex'
                              }`}
                            >
                              <div className="p-4 bg-yellow-500/20 rounded-2xl backdrop-blur-sm border border-yellow-400/30">
                                <ImageIcon className="w-12 h-12 text-yellow-400" />
                              </div>
                              <p className="text-sm text-yellow-300 mt-3 font-medium">
                                {product.variants?.[0]?.attributes?.imageUrl ? 'Image failed to load' : 'No image available'}
                              </p>
                            </div>

                            {/* Status Badge */}
                            <div className="absolute top-4 right-4">
                              <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                                (product.variants?.[0]?.attributes?.stock || 0) > 0 
                                  ? 'bg-yellow-500/30 text-yellow-300 border border-yellow-400/50' 
                                  : 'bg-red-500/30 text-red-300 border border-red-400/50'
                              }`}>
                                {(product.variants?.[0]?.attributes?.stock || 0) > 0 ? 'In Stock' : 'Out of Stock'}
                              </div>
                            </div>
                          </div>

                          {/* Enhanced Product Info */}
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-bold text-white text-xl group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-yellow-400 group-hover:to-yellow-500 group-hover:bg-clip-text transition-all duration-300 line-clamp-1">
                                {product.name}
                              </h3>
                              <p className="text-yellow-200 text-sm line-clamp-2 mt-2 leading-relaxed">
                                {product.description || 'No description available'}
                              </p>
                            </div>

                            {/* Price and Stock Info */}
                            <div className="grid grid-cols-2 gap-4">
                              <div className="bg-gradient-to-br from-yellow-400/15 to-yellow-500/15 border border-yellow-400/30 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <DollarSign className="w-5 h-5 text-yellow-400" />
                                  <span className="text-yellow-300 font-semibold text-sm">Price</span>
                                </div>
                                <p className="text-yellow-200 font-bold text-lg">
                                  Rs. {(product.variants?.[0]?.price || 0).toLocaleString()}
                                </p>
                              </div>
                              
                              <div className="bg-gradient-to-br from-gray-700/30 to-gray-800/30 border border-yellow-400/20 rounded-2xl p-4">
                                <div className="flex items-center gap-2 mb-2">
                                  <Package className="w-5 h-5 text-yellow-400" />
                                  <span className="text-yellow-300 font-semibold text-sm">Stock</span>
                                </div>
                                <p className="text-white font-bold text-lg">
                                  {product.variants?.[0]?.attributes?.stock || 0}
                                </p>
                              </div>
                            </div>

                            {/* Category and Brand Tags */}
                            <div className="flex flex-wrap gap-2">
                              {(typeof product.category === 'object' ? product.category?.name : product.category) && (
                                <div className="bg-gradient-to-r from-yellow-400/20 to-yellow-500/20 border border-yellow-400/40 text-yellow-300 px-3 py-1 rounded-xl text-sm font-semibold">
                                  {typeof product.category === 'object' ? product.category?.name : product.category}
                                </div>
                              )}
                              {(typeof product.brand === 'object' ? product.brand?.name : product.brand) && (
                                <div className="bg-gradient-to-r from-amber-400/20 to-amber-500/20 border border-amber-400/40 text-amber-300 px-3 py-1 rounded-xl text-sm font-semibold">
                                  {typeof product.brand === 'object' ? product.brand?.name : product.brand}
                                </div>
                              )}
                            </div>

                            {/* Enhanced Action Buttons */}
                            <div className="flex gap-3 pt-4">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                <Button
                                  onClick={() => handleEdit(product)}
                                  className="w-full h-12 bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-black font-semibold rounded-2xl shadow-lg border-0 transition-all duration-300"
                                >
                                  <Edit3 className="w-4 h-4 mr-2" />
                                  Edit
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="flex-1">
                                <Button
                                  onClick={() => handleDelete(product)}
                                  className="w-full h-12 bg-gradient-to-r from-gray-700 to-gray-800 hover:from-gray-600 hover:to-gray-700 text-red-400 hover:text-red-300 font-semibold rounded-2xl shadow-lg border border-red-500/30 hover:border-red-400/50 transition-all duration-300"
                                >
                                  <Trash2 className="w-4 h-4 mr-2" />
                                  Delete
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/15 to-yellow-500/15 blur-3xl rounded-full"></div>
                  <div className="relative bg-black/70 backdrop-blur-xl border border-yellow-500/40 rounded-3xl p-12 max-w-md mx-auto">
                    <div className="p-6 bg-gradient-to-br from-gray-800 to-black rounded-2xl mb-6 mx-auto w-fit border border-yellow-400/20">
                      <Package className="w-16 h-16 text-yellow-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-3">No products found</h3>
                    <p className="text-yellow-200 mb-8 text-lg leading-relaxed">
                      {searchTerm || selectedCategory !== 'all' 
                        ? 'Try adjusting your search filters or clear them to see all products' 
                        : 'Start building your premium inventory by adding your first product'}
                    </p>
                    {!searchTerm && selectedCategory === 'all' && (
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button
                          onClick={() => setShowAddForm(true)}
                          className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-amber-500 text-black font-bold px-8 py-4 rounded-2xl shadow-2xl text-lg border-0"
                        >
                          <Plus className="w-6 h-6 mr-3" />
                          Add Your First Product
                        </Button>
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
