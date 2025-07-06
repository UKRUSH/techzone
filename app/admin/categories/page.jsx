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
  Tags,
  Package,
  Eye,
  Hash,
  Layers,
  Archive,
  Zap
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

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    slug: "",
    isActive: true
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/categories');
      if (response.ok) {
        const result = await response.json();
        const categoriesData = result.success ? result.data : result.categories || result;
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      } else {
        console.warn("Failed to fetch categories");
        setCategories([]);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
      setCategories([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCategories();
        setShowCreateDialog(false);
        setFormData({ name: "", description: "", slug: "", isActive: true });
        alert('Category created successfully');
      } else {
        const errorData = await response.json();
        alert('Failed to create category: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating category:', error);
      alert('Failed to create category');
    }
  };

  const handleEditCategory = async (e) => {
    e.preventDefault();
    
    try {
      const response = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        fetchCategories();
        setShowEditDialog(false);
        setFormData({ name: "", description: "", slug: "", isActive: true });
        alert('Category updated successfully');
      } else {
        const errorData = await response.json();
        alert('Failed to update category: ' + (errorData.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating category:', error);
      alert('Failed to update category');
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        const response = await fetch(`/api/categories/${categoryId}`, {
          method: 'DELETE'
        });

        if (response.ok) {
          fetchCategories();
          alert('Category deleted successfully');
        } else {
          const errorData = await response.json();
          alert('Failed to delete category: ' + (errorData.error || 'Unknown error'));
        }
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Failed to delete category');
      }
    }
  };

  const openCreateDialog = () => {
    setFormData({ name: "", description: "", slug: "", isActive: true });
    setShowCreateDialog(true);
  };

  const openEditDialog = (category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      slug: category.slug || "",
      isActive: category.isActive !== false
    });
    setShowEditDialog(true);
  };

  const generateSlug = (name) => {
    return name.toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  };

  const stats = [
    {
      title: "Total Categories",
      value: categories.length.toString(),
      icon: Tags,
      bg: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Active Categories",
      value: categories.filter(c => c.isActive !== false).length.toString(),
      icon: Zap,
      bg: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400"
    },
    {
      title: "With Products",
      value: categories.filter(c => c._count?.products > 0).length.toString(),
      icon: Package,
      bg: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Total Products",
      value: categories.reduce((sum, c) => sum + (c._count?.products || 0), 0).toString(),
      icon: Layers,
      bg: "from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-yellow-500">Loading categories...</div>
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
                Categories Management
              </h1>
              <p className="text-white/70 mt-2">Organize your products into categories</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <Button 
                onClick={openCreateDialog}
                className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Category
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

        {/* Search */}
        <Card className="bg-black/90 border-yellow-400/20 mb-6">
          <CardContent className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-yellow-400/50" />
              <Input
                placeholder="Search categories..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-yellow-400/5 border-yellow-400/20 text-white placeholder-yellow-400/30"
              />
            </div>
          </CardContent>
        </Card>

        {/* Categories Grid */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredCategories.map((category, index) => (
            <motion.div key={category.id} variants={fadeIn}>
              <Card className="bg-black/90 border border-yellow-400/20 hover:border-yellow-400/40 transition-all group relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                
                <CardHeader className="relative z-10">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-lg bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center">
                        <Tags className="w-6 h-6 text-yellow-400" />
                      </div>
                      <div>
                        <CardTitle className="text-white group-hover:text-yellow-400 transition-colors">
                          {category.name}
                        </CardTitle>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge className={
                            category.isActive !== false 
                              ? 'bg-green-400/20 text-green-400 border-green-400/30' 
                              : 'bg-gray-400/20 text-gray-400 border-gray-400/30'
                          }>
                            {category.isActive !== false ? 'Active' : 'Inactive'}
                          </Badge>
                          <span className="text-xs text-white/60">
                            {category._count?.products || 0} products
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="relative z-10">
                  {category.description && (
                    <p className="text-white/70 text-sm mb-4">{category.description}</p>
                  )}
                  
                  {category.slug && (
                    <div className="flex items-center gap-2 mb-4">
                      <Hash className="w-4 h-4 text-yellow-400/70" />
                      <span className="text-yellow-400/70 text-sm font-mono">{category.slug}</span>
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-4 border-t border-yellow-400/10">
                    <div className="flex items-center gap-2 text-xs text-white/60">
                      <Package className="w-3 h-3" />
                      {category._count?.products || 0} products
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => openEditDialog(category)}
                        className="text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteCategory(category.id)}
                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <Tags className="w-12 h-12 text-yellow-400/50 mx-auto mb-4" />
            <p className="text-white/60">No categories found</p>
          </div>
        )}

        {/* Create Category Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="bg-black border-yellow-400/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">Create New Category</DialogTitle>
              <DialogDescription className="text-white/60">
                Add a new product category to organize your inventory
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateCategory} className="space-y-4">
              <div>
                <Label htmlFor="name" className="text-yellow-400">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData, 
                      name,
                      slug: generateSlug(name)
                    });
                  }}
                  className="bg-yellow-400/5 border-yellow-400/20 text-white"
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="slug" className="text-yellow-400">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="bg-yellow-400/5 border-yellow-400/20 text-white"
                  placeholder="category-slug"
                />
              </div>
              
              <div>
                <Label htmlFor="description" className="text-yellow-400">Description</Label>
                <Input
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-yellow-400/5 border-yellow-400/20 text-white"
                  placeholder="Category description (optional)"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-yellow-400 border-yellow-400/20 rounded focus:ring-yellow-400/40"
                />
                <Label htmlFor="isActive" className="text-white">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowCreateDialog(false)}
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
                >
                  Create Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
          <DialogContent className="bg-black border-yellow-400/20 text-white">
            <DialogHeader>
              <DialogTitle className="text-yellow-400">Edit Category</DialogTitle>
              <DialogDescription className="text-white/60">
                Update category information
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleEditCategory} className="space-y-4">
              <div>
                <Label htmlFor="edit-name" className="text-yellow-400">Category Name</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => {
                    const name = e.target.value;
                    setFormData({
                      ...formData, 
                      name,
                      slug: generateSlug(name)
                    });
                  }}
                  className="bg-yellow-400/5 border-yellow-400/20 text-white"
                  placeholder="Enter category name"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="edit-slug" className="text-yellow-400">Slug</Label>
                <Input
                  id="edit-slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({...formData, slug: e.target.value})}
                  className="bg-yellow-400/5 border-yellow-400/20 text-white"
                  placeholder="category-slug"
                />
              </div>
              
              <div>
                <Label htmlFor="edit-description" className="text-yellow-400">Description</Label>
                <Input
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({...formData, description: e.target.value})}
                  className="bg-yellow-400/5 border-yellow-400/20 text-white"
                  placeholder="Category description (optional)"
                />
              </div>
              
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="edit-isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData({...formData, isActive: e.target.checked})}
                  className="w-4 h-4 text-yellow-400 border-yellow-400/20 rounded focus:ring-yellow-400/40"
                />
                <Label htmlFor="edit-isActive" className="text-white">Active</Label>
              </div>
              
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button"
                  variant="outline" 
                  onClick={() => setShowEditDialog(false)}
                  className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit"
                  className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
                >
                  Update Category
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
