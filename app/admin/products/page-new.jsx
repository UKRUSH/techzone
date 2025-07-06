"use client";

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
  Star
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
      const response = await fetch('/api/products');
      if (response.ok) {
        const result = await response.json();
        setProducts(result.success ? result.data : []);
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
    const price = typeof product.price === 'object' ? 
      (product.price?.amount || product.variants?.[0]?.price || 0) : 
      (product.price || 0);
    const stock = typeof product.stock === 'object' ? 
      (product.stock?.quantity || product.variants?.[0]?.attributes?.stock || 0) : 
      (product.stock || 0);
    
    setFormData({
      name: product.name || '',
      description: product.description || '',
      price: price.toString(),
      category: typeof product.category === 'object' ? product.category?.name : product.category || '',
      brand: typeof product.brand === 'object' ? product.brand?.name : product.brand || '',
      stock: stock.toString(),
      imageUrl: product.variants?.[0]?.attributes?.imageUrl || ''
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleDelete = async (product) => {
    if (!confirm(`Are you sure you want to delete "${product.name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/products?id=${product.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        fetchProducts();
        alert('Product deleted successfully!');
        console.log('✅ Product deleted:', result.data);
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to delete product'}`);
        console.error('❌ API Error:', error);
      }
    } catch (error) {
      console.error('❌ Error deleting product:', error);
      alert('Error deleting product. Check console for details.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <Loader2 className="h-12 w-12 animate-spin text-purple-400 mx-auto mb-4" />
          <p className="text-slate-300 text-lg">Loading products...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-slate-900/80 backdrop-blur-lg border-b border-slate-700 p-6">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Product Management
              </h1>
              <p className="text-slate-400 mt-2 flex items-center">
                <Package className="w-4 h-4 mr-2" />
                {filteredProducts.length} products • Manage your inventory
              </p>
            </div>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-6 py-3 rounded-xl shadow-lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add New Product
              </Button>
            </motion.div>
          </div>

          {/* Search and Filter Bar */}
          <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
            <CardContent className="p-4">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search products by name or description..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-slate-700/50 border-slate-600 text-white placeholder:text-slate-400 h-12"
                  />
                </div>
                
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-lg text-white h-12 min-w-[180px]"
                >
                  <option value="all">All Categories</option>
                  {categories.map(category => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                
                <Button
                  onClick={fetchProducts}
                  variant="outline"
                  className="border-slate-600 text-slate-300 hover:bg-slate-700 h-12 px-6"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Refresh
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="p-6">
        {/* Add Product Form */}
        <AnimatePresence>
          {showAddForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-8"
            >
              <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="text-white flex items-center">
                    <Plus className="w-5 h-5 mr-2 text-purple-400" />
                    Add New Product
                  </CardTitle>
                  <CardDescription className="text-slate-400">
                    Fill in the details to add a new product to your inventory
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name" className="text-white">Product Name *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => handleInputChange('name', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="Enter product name"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="price" className="text-white">Price (Rs.) *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => handleInputChange('price', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="0.00"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="category" className="text-white">Category *</Label>
                      <select
                        id="category"
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 text-white h-10 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select category</option>
                        {categories.map((category) => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="brand" className="text-white">Brand *</Label>
                      <select
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => handleInputChange('brand', e.target.value)}
                        className="w-full bg-slate-700/50 border border-slate-600 text-white h-10 rounded-md px-3 py-2"
                        required
                      >
                        <option value="">Select brand</option>
                        {brands.map((brand) => (
                          <option key={brand.id} value={brand.name}>
                            {brand.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="stock" className="text-white">Stock Quantity</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => handleInputChange('stock', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="0"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="imageUrl" className="text-white">Image URL</Label>
                      <Input
                        id="imageUrl"
                        value={formData.imageUrl}
                        onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white"
                        placeholder="https://example.com/image.jpg"
                      />
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor="description" className="text-white">Description</Label>
                      <Textarea
                        id="description"
                        value={formData.description}
                        onChange={(e) => handleInputChange('description', e.target.value)}
                        className="bg-slate-700/50 border-slate-600 text-white min-h-[100px]"
                        placeholder="Enter product description"
                      />
                    </div>

                    <div className="md:col-span-2 flex gap-4 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold px-8 py-2"
                      >
                        {isSubmitting ? (
                          <>
                            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Save className="w-4 h-4 mr-2" />
                            Create Product
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        onClick={() => setShowAddForm(false)}
                        variant="outline"
                        className="border-slate-600 text-slate-300 hover:bg-slate-700"
                      >
                        <X className="w-4 h-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Products Grid */}
        <Card className="bg-slate-800/50 border-slate-700 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white flex items-center justify-between">
              <span className="flex items-center">
                <Boxes className="w-5 h-5 mr-2 text-purple-400" />
                Products ({filteredProducts.length})
              </span>
              <Badge variant="outline" className="border-purple-400 text-purple-400">
                Total: {products.length}
              </Badge>
            </CardTitle>
            <CardDescription className="text-slate-400">
              View and manage all your products
            </CardDescription>
          </CardHeader>
          <CardContent>
            {filteredProducts.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {filteredProducts.map((product, index) => (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Card className="bg-slate-700/50 border-slate-600 hover:border-purple-400/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
                      <CardContent className="p-4">
                        {/* Product Image */}
                        <div className="aspect-video bg-slate-600 rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                          {product.variants?.[0]?.attributes?.imageUrl ? (
                            <img
                              src={product.variants[0].attributes.imageUrl}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <ImageIcon className="w-8 h-8 text-slate-400" />
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="space-y-2">
                          <h3 className="font-semibold text-white text-lg group-hover:text-purple-400 transition-colors line-clamp-1">
                            {product.name}
                          </h3>
                          
                          <p className="text-slate-400 text-sm line-clamp-2">
                            {product.description || 'No description available'}
                          </p>

                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-400" />
                              <span className="text-green-400 font-semibold">
                                Rs. {typeof product.price === 'object' ? 
                                  (product.price?.amount || product.variants?.[0]?.price || 0).toLocaleString() : 
                                  (product.price || 0).toLocaleString()}
                              </span>
                            </div>
                            
                            <div className="flex items-center space-x-2">
                              <Package className="w-4 h-4 text-blue-400" />
                              <span className="text-blue-400 text-sm">
                                {typeof product.stock === 'object' ? 
                                  (product.stock?.quantity || product.variants?.[0]?.attributes?.stock || 0) : 
                                  (product.stock || 0)} in stock
                              </span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between pt-2">
                            <div className="flex space-x-2">
                              {(typeof product.category === 'object' ? product.category?.name : product.category) && (
                                <Badge variant="outline" className="border-purple-400/50 text-purple-400 text-xs">
                                  {typeof product.category === 'object' ? product.category?.name : product.category}
                                </Badge>
                              )}
                              {(typeof product.brand === 'object' ? product.brand?.name : product.brand) && (
                                <Badge variant="outline" className="border-pink-400/50 text-pink-400 text-xs">
                                  {typeof product.brand === 'object' ? product.brand?.name : product.brand}
                                </Badge>
                              )}
                            </div>
                          </div>

                          {/* Action Buttons */}
                          <div className="flex space-x-2 pt-3">
                            <Button
                              onClick={() => handleEdit(product)}
                              size="sm"
                              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              <Edit3 className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleDelete(product)}
                              size="sm"
                              variant="destructive"
                              className="flex-1"
                            >
                              <Trash2 className="w-3 h-3 mr-1" />
                              Delete
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <Package className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-slate-300 mb-2">No products found</h3>
                <p className="text-slate-400 mb-6">
                  {searchTerm || selectedCategory !== 'all' 
                    ? 'Try adjusting your search or filters' 
                    : 'Get started by adding your first product'}
                </p>
                {!searchTerm && selectedCategory === 'all' && (
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Your First Product
                  </Button>
                )}
              </motion.div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
