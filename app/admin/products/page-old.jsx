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
  ImageIcon
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
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        alert('Please enter a product name');
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

      // Save directly to MongoDB database
      console.log('� Saving product to MongoDB database...');
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
        fetchProducts(); // Refresh products list
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
      name: product.name,
      description: product.description || '',
      price: product.price?.toString() || '',
      category: product.category,
      brand: product.brand,
      stock: product.stock?.toString() || '',
      imageUrl: product.imageUrl || ''
    });
    setShowEditForm(true);
    setShowAddForm(false);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        alert('Please enter a product name');
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

      // Update product in MongoDB database
      const response = await fetch('/api/products', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id: editingProduct.id,
          name: formData.name.trim(),
          description: formData.description.trim(),
          price: parseFloat(formData.price) || 0,
          category: formData.category,
          brand: formData.brand,
          stock: parseInt(formData.stock) || 0,
          imageUrl: formData.imageUrl.trim()
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
        setShowEditForm(false);
        setEditingProduct(null);
        fetchProducts(); // Refresh products list
        alert('Product updated successfully!');
        console.log('✅ Product updated:', result.data);
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
      // Delete product from MongoDB database
      const response = await fetch(`/api/products?id=${product.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        const result = await response.json();
        fetchProducts(); // Refresh products list
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

  const cancelEdit = () => {
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
    <div className="p-6 bg-black min-h-screen">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-yellow-500">Products Dashboard</h1>
        <p className="text-gray-400 mt-2">Manage your product inventory</p>
      </div>

      {/* Add/Edit Product Button */}
      <div className="mb-6">
        <Button 
          onClick={() => {
            if (showEditForm) {
              cancelEdit();
            } else {
              setShowAddForm(!showAddForm);
              setShowEditForm(false);
            }
          }}
          className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium mr-4"
        >
          {showEditForm ? 'Cancel Edit' : showAddForm ? 'Cancel' : '+ Add New Product'}
        </Button>
        {showEditForm && (
          <span className="text-yellow-400 font-medium">
            Editing: {editingProduct?.name}
          </span>
        )}
      </div>

      {/* Add Product Form */}
      {showAddForm && (
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Add New Product</CardTitle>
            <CardDescription className="text-gray-400">
              Create a new product in your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-white">Product Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price" className="text-white">Price ($)</Label>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="category" className="text-white">Category</Label>
                  <select
                    id="category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="brand" className="text-white">Brand</Label>
                  <select
                    id="brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  >
                    <option value="" disabled>Select brand</option>
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
                    placeholder="0"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-white">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {isSubmitting ? 'Creating...' : 'Create Product'}
                </Button>
                <Button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Product Form */}
      {showEditForm && (
        <Card className="bg-zinc-900 border-zinc-800 mb-6">
          <CardHeader>
            <CardTitle className="text-white">Edit Product</CardTitle>
            <CardDescription className="text-gray-400">
              Update product information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name" className="text-white">Product Name</Label>
                  <Input
                    id="edit-name"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Enter product name"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price" className="text-white">Price ($)</Label>
                  <Input
                    id="edit-price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', e.target.value)}
                    placeholder="0.00"
                    className="bg-zinc-800 border-zinc-700 text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-white">Description</Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter product description"
                  className="bg-zinc-800 border-zinc-700 text-white"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-category" className="text-white">Category</Label>
                  <select
                    id="edit-category"
                    value={formData.category}
                    onChange={(e) => handleInputChange('category', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="" disabled>Select category</option>
                    {categories.map((category) => (
                      <option key={category.id} value={category.name}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-brand" className="text-white">Brand</Label>
                  <select
                    id="edit-brand"
                    value={formData.brand}
                    onChange={(e) => handleInputChange('brand', e.target.value)}
                    className="bg-zinc-800 border-zinc-700 text-white h-10 w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="" disabled>Select brand</option>
                    {brands.map((brand) => (
                      <option key={brand.id} value={brand.name}>
                        {brand.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="edit-stock" className="text-white">Stock Quantity</Label>
                  <Input
                    id="edit-stock"
                    type="number"
                    value={formData.stock}
                    onChange={(e) => handleInputChange('stock', e.target.value)}
                    placeholder="0"
                    className="bg-zinc-800 border-zinc-700 text-white"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-imageUrl" className="text-white">Image URL</Label>
                <Input
                  id="edit-imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => handleInputChange('imageUrl', e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="bg-zinc-800 border-zinc-700 text-white"
                />
              </div>

              <div className="flex gap-4">
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isSubmitting ? 'Updating...' : 'Update Product'}
                </Button>
                <Button 
                  type="button" 
                  onClick={cancelEdit}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Products ({products.length})</CardTitle>
          <CardDescription className="text-gray-400">
            Product inventory management
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {products.length > 0 ? (
              products.slice(0, 10).map((product) => (
                <div key={product.id} className="p-4 bg-zinc-800 rounded-lg border border-zinc-700">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-white font-medium">{product.name}</h3>
                      <p className="text-gray-400 text-sm">{product.description}</p>
                      <div className="flex gap-4 mt-2">
                        <p className="text-yellow-400 font-medium">
                          ${typeof product.price === 'object' ? (product.price?.amount || product.variants?.[0]?.price || 0) : (product.price || 0)}
                        </p>
                        <p className="text-blue-400 text-sm">
                          Stock: {typeof product.stock === 'object' ? (product.stock?.quantity || product.variants?.[0]?.attributes?.stock || 0) : (product.stock || 0)}
                        </p>
                        <p className="text-purple-400 text-sm">
                          {typeof product.category === 'object' ? product.category?.name : product.category} | {typeof product.brand === 'object' ? product.brand?.name : product.brand}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-col gap-2 ml-4">
                      <span className="inline-block px-2 py-1 text-xs bg-blue-500/20 text-blue-400 rounded text-center">
                        In Stock
                      </span>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs px-3 py-1 h-auto"
                        >
                          Edit
                        </Button>
                        <Button
                          onClick={() => handleDelete(product)}
                          className="bg-red-600 hover:bg-red-700 text-white text-xs px-3 py-1 h-auto"
                        >
                          Delete
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-400">No products found</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
