"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { motion } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Zap,
  Package,
  Star,
  ShoppingCart,
  X,
  Eye,
  GitCompare,
  Heart,
  Share2
} from "lucide-react";

// Enhanced Product Card component with 60% Black / 40% Yellow Premium Theme
const DatabaseProductCard = memo(function DatabaseProductCard({ product, onAddToCart, onQuickView, onAddToCompare, isInCompare }) {
  const categoryColors = {
    gpu: 'from-yellow-400 via-amber-500 to-orange-500',
    cpu: 'from-yellow-500 via-yellow-600 to-amber-600', 
    storage: 'from-amber-400 via-yellow-500 to-yellow-600',
    memory: 'from-yellow-300 via-yellow-400 to-amber-500',
    motherboard: 'from-yellow-600 via-amber-600 to-orange-600',
    'power-supply': 'from-gray-700 via-gray-800 to-black',
    cooling: 'from-yellow-400 via-amber-400 to-yellow-500',
    case: 'from-gray-800 via-black to-gray-900'
  };

  return (
    <motion.div
      whileHover={{ y: -8, scale: 1.02 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group relative"
    >
      {/* Premium Golden Glow Effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-amber-500/15 to-yellow-600/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
      
      <Card className="relative bg-gradient-to-br from-black via-gray-900/95 to-black border-2 border-yellow-500/40 hover:border-yellow-400/80 transition-all duration-300 cursor-pointer h-full rounded-3xl overflow-hidden shadow-2xl group-hover:shadow-yellow-400/25">
        {/* Animated Border Glow */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <CardHeader className="relative pb-4 p-6">
          {/* Enhanced Product Image/Icon Section */}
          <div className={`aspect-square rounded-2xl mb-4 flex items-center justify-center relative bg-gradient-to-br ${categoryColors[product.category] || 'from-yellow-400 to-amber-500'} shadow-2xl group-hover:shadow-yellow-400/30 transition-all duration-300`}>
            <Package className="w-16 h-16 text-black/80 group-hover:scale-110 transition-transform duration-300" />
            
            {/* Premium Category Badge */}
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/80 backdrop-blur-sm text-yellow-300 border border-yellow-400/40 text-xs font-bold px-3 py-1 rounded-full">
                {product.category.toUpperCase()}
              </Badge>
            </div>
            
            {/* Stock Status Badge */}
            <div className="absolute top-3 right-3">
              <Badge className="bg-gradient-to-r from-green-500 to-green-600 text-white border border-green-400/50 text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                ✓ IN STOCK
              </Badge>
            </div>
            
            {/* Premium Price Tag */}
            <div className="absolute bottom-3 right-3 bg-gradient-to-r from-black/90 to-gray-900/90 backdrop-blur-sm rounded-xl px-3 py-2 border border-yellow-400/30">
              <span className="text-yellow-400 font-black text-lg">Rs. {product.price}</span>
            </div>
            
            {/* Floating Golden Orbs */}
            <div className="absolute top-1/4 left-1/4 w-3 h-3 bg-yellow-300/60 rounded-full blur-sm animate-pulse"></div>
            <div className="absolute bottom-1/3 right-1/4 w-2 h-2 bg-amber-400/60 rounded-full blur-sm animate-pulse delay-500"></div>
          </div>
          
          {/* Enhanced Product Title */}
          <CardTitle className="text-white group-hover:text-yellow-300 transition-colors duration-300 text-xl font-bold leading-tight line-clamp-2 mb-3">
            {product.name}
          </CardTitle>
          
          {/* Premium Brand Badge */}
          <div className="flex items-center gap-2 mb-4">
            <div className="p-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl border border-yellow-400/30">
              <Star className="w-4 h-4 text-yellow-400" />
            </div>
            <span className="text-yellow-300 font-semibold text-sm tracking-wide">{product.brand}</span>
          </div>
        </CardHeader>
        
        <CardContent className="relative pt-0 p-6 space-y-4">
          {/* Premium Rating System */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`w-5 h-5 transition-colors duration-200 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
              ))}
            </div>
            <span className="text-yellow-300 font-bold text-sm bg-black/50 px-3 py-1 rounded-full border border-yellow-400/30">
              {product.rating}/5
            </span>
          </div>
          
          {/* Enhanced Price and Stock Info */}
          <div className="bg-gradient-to-r from-black/60 to-gray-900/60 rounded-2xl p-4 border border-yellow-500/30">
            <div className="flex items-center justify-between mb-2">
              <div>
                <div className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
                  Rs. {product.price.toLocaleString()}
                </div>
                <div className="text-yellow-300/70 text-sm font-medium">Competitive Pricing</div>
              </div>
              <div className="text-right">
                <div className="text-green-400 font-bold text-lg">{product.stock} units</div>
                <div className="text-green-300/70 text-sm">Available</div>
              </div>
            </div>
          </div>
          
          {/* Premium Action Button */}
          <motion.div 
            whileHover={{ scale: 1.02 }} 
            whileTap={{ scale: 0.98 }}
            className="relative"
          >
            <Button 
              onClick={() => onAddToCart(product)}
              className="w-full h-14 bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500 text-black font-black text-lg rounded-2xl shadow-2xl border-0 transition-all duration-300 relative overflow-hidden group/btn"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
              <div className="relative z-10 flex items-center justify-center gap-3">
                <ShoppingCart className="w-6 h-6" />
                <span>Add to Cart</span>
                <motion.div 
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-black"
                >
                  →
                </motion.div>
              </div>
              
              {/* Animated background sweep */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover/btn:translate-x-[100%] transition-transform duration-700 skew-x-12"></div>
            </Button>
          </motion.div>
          
          {/* Quick Actions */}
          <div className="flex gap-2 pt-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onQuickView(product)}
              className="flex-1 border-yellow-500/40 text-yellow-300 hover:bg-yellow-400/10 hover:border-yellow-400/60 rounded-xl"
            >
              Quick View
            </Button>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => onAddToCompare(product)}
              className={`flex-1 border-yellow-500/40 hover:border-yellow-400/60 rounded-xl transition-colors ${
                isInCompare 
                  ? 'bg-yellow-400/20 text-yellow-400 border-yellow-400/80' 
                  : 'text-yellow-300 hover:bg-yellow-400/10'
              }`}
            >
              {isInCompare ? '✓ Added' : 'Compare'}
            </Button>
          </div>
        </CardContent>
        
        {/* Premium Hover Effect Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-yellow-400/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-3xl"></div>
      </Card>
    </motion.div>
  );
});

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  const [compareProducts, setCompareProducts] = useState([]);
  const [showQuickView, setShowQuickView] = useState(false);
  const [showCompare, setShowCompare] = useState(false);

  // Use global cart from provider
  const { items: cartItems, addToCart: addToCartGlobal, cartItemCount } = useCart();

  // Handle client-side hydration
  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch data from database
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
        const productsData = result.data || [];
        // Convert database format to component format, keeping variants for cart functionality
        const formattedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.variants?.[0]?.price || 0,
          category: product.category?.name || 'Other',
          brand: product.brand?.name || 'Unknown',
          inStock: true,
          rating: 5,
          stock: product.variants?.[0]?.attributes?.stock || 0,
          imageUrl: product.variants?.[0]?.attributes?.imageUrl || '',
          variants: product.variants || [] // Keep the full variants array for cart functionality
        }));
        setProducts(formattedProducts);
      } else {
        console.error('Failed to fetch products from database');
        setProducts([]);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
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
        setCategories(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchBrands = async () => {
    try {
      const response = await fetch('/api/brands');
      if (response.ok) {
        const result = await response.json();
        setBrands(result.data || []);
      }
    } catch (error) {
      console.error('Error fetching brands:', error);
    }
  };

  // Filter products based on search and selections
  const filteredProducts = useMemo(() => {
    let filtered = products;
    
    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedBrand) {
      filtered = filtered.filter(p => p.brand === selectedBrand);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return filtered;
  }, [products, selectedCategory, selectedBrand, searchQuery]);

  const handleCategoryChange = useCallback((category) => setSelectedCategory(category), []);
  const handleBrandChange = useCallback((brand) => setSelectedBrand(brand), []);
  const handleSearchChange = useCallback((e) => setSearchQuery(e.target.value), []);
  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearchQuery("");
  }, []);

  // Cart functionality
  const addToCart = useCallback(async (product) => {
    try {
      // Use the first variant of the product (or create one if needed)
      const variant = product.variants && product.variants.length > 0 
        ? product.variants[0] 
        : null;

      if (!variant) {
        alert(`❌ Error: "${product.name}" has no available variants.`);
        console.error('Product has no variants:', product);
        return;
      }

      console.log('Adding to cart:', {
        productName: product.name,
        variantId: variant.id,
        variant: variant
      });

      const result = await addToCartGlobal(variant.id, 1);
      console.log('Add to cart result:', result);
      
      if (result.success) {
        alert(`✅ "${product.name}" added to cart!`);
      } else {
        alert(`❌ Error: ${result.error || 'Failed to add to cart'}`);
        console.error('Failed to add to cart:', result);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      alert(`❌ Error: Failed to add "${product.name}" to cart.`);
    }
  }, [addToCartGlobal]);

  // Quick View functionality
  const openQuickView = useCallback((product) => {
    setQuickViewProduct(product);
    setShowQuickView(true);
  }, []);

  const closeQuickView = useCallback(() => {
    setShowQuickView(false);
    setQuickViewProduct(null);
  }, []);

  // Compare functionality
  const addToCompare = useCallback((product) => {
    setCompareProducts(prevCompare => {
      if (prevCompare.find(item => item.id === product.id)) {
        alert(`⚠️ "${product.name}" is already in comparison list!\n📊 Current comparison: ${prevCompare.length}/3 products`);
        return prevCompare;
      }
      
      if (prevCompare.length >= 3) {
        alert('❌ You can only compare up to 3 products at a time!\n🗑️ Remove a product to add a new one.');
        return prevCompare;
      }
      
      const newCompare = [...prevCompare, product];
      alert(`✅ Added "${product.name}" to comparison!\n📊 Products in comparison: ${newCompare.length}/3\n💡 Tip: Click the Compare button to view side-by-side comparison`);
      return newCompare;
    });
  }, []);

  const removeFromCompare = useCallback((productId) => {
    setCompareProducts(prevCompare => 
      prevCompare.filter(item => item.id !== productId)
    );
  }, []);

  const openCompare = useCallback(() => {
    if (compareProducts.length === 0) {
      alert('📊 No products in comparison yet!\n💡 Add products to compare by clicking the "Compare" button on product cards.');
      return;
    }
    setShowCompare(true);
  }, [compareProducts]);

  return (
    <>
      <Header />
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-black via-gray-900 to-black">
        {/* Premium 60% Black / 40% Yellow Background Effects */}
        {mounted && (
          <div className="absolute inset-0 overflow-hidden">
            {/* Primary Golden Glow Effects (40% Yellow Theme) */}
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-full blur-3xl animate-pulse"></div>
            <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-r from-yellow-500/20 to-amber-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-yellow-400/10 to-amber-500/10 rounded-full blur-3xl animate-pulse delay-500"></div>
            
            {/* Floating Golden Orbs */}
            <motion.div
              initial={{ x: -100, y: -100 }}
              animate={{ 
                x: [0, 150, 0, -150, 0],
                y: [0, -150, 150, 0, 0]
              }}
              transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
              className="absolute top-20 left-20 w-40 h-40 bg-gradient-to-r from-yellow-400/15 to-amber-500/15 rounded-full blur-2xl"
            ></motion.div>
            
            <motion.div
              initial={{ x: 100, y: 100 }}
              animate={{ 
                x: [0, -200, 0, 200, 0],
                y: [0, 200, -150, 0, 0]
              }}
              transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              className="absolute bottom-20 right-20 w-48 h-48 bg-gradient-to-r from-amber-400/15 to-yellow-500/15 rounded-full blur-2xl"
            ></motion.div>
            
            {/* Animated Golden Grid Pattern */}
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9InJnYmEoMjU1LDIxNSwwLDAuMTIpIiBzdHJva2Utd2lkdGg9IjEiLz48cGF0aCBkPSJNMCAzMGgzMHYzMEgweiIgc3Ryb2tlPSJyZ2JhKDI1NSwyMTUsMCwwLjEyKSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9nPjwvc3ZnPg==')] opacity-20"></div>
            
            {/* Premium Animated Particles */}
            <div className="absolute top-32 right-32 w-4 h-4 rounded-full bg-yellow-400/80 shadow-2xl shadow-yellow-400/50 animate-ping"></div>
            <div className="absolute top-1/3 left-20 w-3 h-3 rounded-full bg-amber-500/80 shadow-2xl shadow-amber-500/50 animate-ping delay-300"></div>
            <div className="absolute bottom-1/3 right-1/4 w-3.5 h-3.5 rounded-full bg-yellow-300/80 shadow-2xl shadow-yellow-300/50 animate-ping delay-700"></div>
            <div className="absolute top-3/4 left-1/3 w-2.5 h-2.5 rounded-full bg-yellow-600/80 shadow-2xl shadow-yellow-600/50 animate-ping delay-1000"></div>
            
            {/* Diagonal Golden Accent Lines */}
            <div className="absolute inset-0 overflow-hidden opacity-10">
              <div className="absolute -left-full -bottom-full w-[200%] h-[200%] bg-gradient-to-br from-yellow-400/30 via-amber-500/15 to-transparent transform rotate-45"></div>
            </div>
          </div>
        )}

        {/* Premium Status Indicator - Removed */}
        
        <div className="container mx-auto px-6 py-12 relative z-10">
          {/* Enhanced Premium Header Section */}
          {mounted ? (
            <motion.div 
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mb-16"
            >
              <div className="bg-gradient-to-r from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border-2 border-yellow-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                {/* Golden Animated Border */}
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 via-transparent to-yellow-400/20 animate-pulse rounded-3xl"></div>
              
              <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                <div className="flex items-center gap-6">
                  <div className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 animate-pulse"></div>
                    <div className="relative p-4 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-2xl shadow-2xl transform group-hover:scale-105 transition-all duration-300">
                      <Package className="w-10 h-10 text-black" />
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h1 className="text-6xl font-black tracking-tight">
                      <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                        Premium
                      </span>
                      <span className="text-white ml-4">Products</span>
                    </h1>
                    
                    <div className="flex items-center gap-4 text-yellow-200">
                      <Zap className="w-6 h-6 text-yellow-400 animate-pulse" />
                      <span className="text-xl font-medium">
                        {mounted ? (loading ? 'Loading elite inventory...' : `${filteredProducts.length} of ${products.length} premium products`) : 'Initializing premium catalog...'}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4">
                      <Badge className="bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-400/40 px-4 py-2 rounded-full text-sm font-bold">
                        💎 Premium Database
                      </Badge>
                      <Badge className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-400/40 px-4 py-2 rounded-full text-sm font-bold">
                        ⚡ Instant Search
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced View Mode Toggles */}
                <div className="flex items-center gap-4">
                  <div className="bg-black/60 backdrop-blur-sm border border-yellow-500/40 rounded-2xl p-2 flex gap-2">
                    <Button 
                      variant={viewMode === "grid" ? "default" : "ghost"}
                      size="lg"
                      onClick={() => setViewMode("grid")}
                      className={`h-12 px-6 rounded-xl font-bold transition-all duration-300 ${
                        viewMode === "grid" 
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30" 
                          : "text-yellow-300 hover:text-yellow-400 hover:bg-yellow-400/10 border border-yellow-500/30"
                      }`}
                    >
                      <Grid3X3 className="w-5 h-5 mr-2" />
                      Grid View
                    </Button>
                    <Button 
                      variant={viewMode === "list" ? "default" : "ghost"}
                      size="lg"
                      onClick={() => setViewMode("list")}
                      className={`h-12 px-6 rounded-xl font-bold transition-all duration-300 ${
                        viewMode === "list" 
                          ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30" 
                          : "text-yellow-300 hover:text-yellow-400 hover:bg-yellow-400/10 border border-yellow-500/30"
                      }`}
                    >
                      <List className="w-5 h-5 mr-2" />
                      List View
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
          ) : (
            <div className="mb-16">
              <div className="bg-gradient-to-r from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border-2 border-yellow-500/40 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
                  <div className="flex items-center gap-6">
                    <div className="p-4 bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-2xl shadow-2xl">
                      <Package className="w-10 h-10 text-black" />
                    </div>
                    
                    <div className="space-y-3">
                      <h1 className="text-6xl font-black tracking-tight">
                        <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 bg-clip-text text-transparent">
                          Premium
                        </span>
                        <span className="text-white ml-4">Products</span>
                      </h1>
                      
                      <div className="flex items-center gap-4 text-yellow-200">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        <span className="text-xl font-medium">
                          {mounted ? (loading ? 'Loading elite inventory...' : `${filteredProducts.length} of ${products.length} premium products`) : 'Initializing premium catalog...'}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <Badge className="bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-400/40 px-4 py-2 rounded-full text-sm font-bold">
                          💎 Premium Database
                        </Badge>
                        <Badge className="bg-gradient-to-r from-yellow-500/20 to-amber-500/20 text-yellow-400 border border-yellow-400/40 px-4 py-2 rounded-full text-sm font-bold">
                          ⚡ Instant Search
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="bg-black/60 backdrop-blur-sm border border-yellow-500/40 rounded-2xl p-2 flex gap-2">
                      <Button 
                        variant={viewMode === "grid" ? "default" : "ghost"}
                        size="lg"
                        onClick={() => setViewMode("grid")}
                        className={`h-12 px-6 rounded-xl font-bold transition-all duration-300 ${
                          viewMode === "grid" 
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30" 
                            : "text-yellow-300 hover:text-yellow-400 hover:bg-yellow-400/10 border border-yellow-500/30"
                        }`}
                      >
                        <Grid3X3 className="w-5 h-5 mr-2" />
                        Grid View
                      </Button>
                      <Button 
                        variant={viewMode === "list" ? "default" : "ghost"}
                        size="lg"
                        onClick={() => setViewMode("list")}
                        className={`h-12 px-6 rounded-xl font-bold transition-all duration-300 ${
                          viewMode === "list" 
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30" 
                            : "text-yellow-300 hover:text-yellow-400 hover:bg-yellow-400/10 border border-yellow-500/30"
                        }`}
                      >
                        <List className="w-5 h-5 mr-2" />
                        List View
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="grid lg:grid-cols-4 gap-10">
            {/* Enhanced Premium Sidebar */}
            {mounted ? (
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="lg:col-span-1 space-y-8"
              >
              {/* Premium Search Section */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <Card className="relative bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 border-2 border-yellow-500/50 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/10 animate-pulse rounded-3xl"></div>
                  
                  <CardHeader className="relative pb-6 border-b border-yellow-500/30">
                    <CardTitle className="text-2xl text-yellow-400 flex items-center gap-3 font-black">
                      <div className="p-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl">
                        <Search className="w-6 h-6 text-yellow-400" />
                      </div>
                      Premium Search
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative p-6">
                    <div className="relative group/input">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-2xl blur opacity-0 group-hover/input:opacity-100 transition-all duration-300"></div>
                      <div className="relative">
                        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400/70 w-6 h-6 z-10" />
                        <Input
                          placeholder="Search premium products..."
                          value={searchQuery}
                          onChange={handleSearchChange}
                          className="relative h-14 pl-14 pr-4 bg-gradient-to-r from-black/80 to-gray-900/80 border-2 border-yellow-500/40 hover:border-yellow-400/70 focus:border-yellow-400 focus:shadow-lg focus:shadow-yellow-400/25 text-white text-lg placeholder-yellow-400/60 rounded-2xl transition-all duration-300 backdrop-blur-sm"
                        />
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-yellow-400/5 to-transparent pointer-events-none"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Clear Filters Button */}
              {(selectedCategory || selectedBrand || searchQuery) && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <Button 
                    onClick={clearFilters} 
                    className="w-full h-14 bg-gradient-to-r from-gray-800/80 to-gray-900/80 hover:from-gray-700/80 hover:to-gray-800/80 text-yellow-300 hover:text-yellow-400 border-2 border-yellow-500/40 hover:border-yellow-400/60 rounded-2xl font-bold text-lg transition-all duration-300 backdrop-blur-sm"
                  >
                    <X className="w-6 h-6 mr-3" />
                    Clear All Filters
                  </Button>
                </motion.div>
              )}

              {/* Enhanced Categories Section */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <Card className="relative bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 border-2 border-yellow-500/50 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
                  <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse"></div>
                  
                  <CardHeader className="relative pb-6 border-b border-yellow-500/30">
                    <CardTitle className="text-2xl text-yellow-400 flex items-center gap-3 font-black">
                      <div className="p-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl">
                        <Filter className="w-6 h-6 text-yellow-400" />
                      </div>
                      Elite Categories
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative p-6 space-y-3">
                    <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                      <Button
                        variant={selectedCategory === "" ? "default" : "ghost"}
                        className={`w-full h-12 justify-start text-lg font-bold rounded-xl transition-all duration-300 ${
                          selectedCategory === "" 
                            ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30" 
                            : "text-white hover:text-yellow-400 hover:bg-yellow-400/10 border border-yellow-500/30 hover:border-yellow-400/50"
                        }`}
                        onClick={() => handleCategoryChange("")}
                      >
                        All Categories
                      </Button>
                    </motion.div>
                    
                    {categories.map((category, index) => (
                      <motion.div 
                        key={category.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={selectedCategory === category.name ? "default" : "ghost"}
                          className={`w-full h-12 justify-between text-lg font-bold rounded-xl transition-all duration-300 ${
                            selectedCategory === category.name 
                              ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30" 
                              : "text-white hover:text-yellow-400 hover:bg-yellow-400/10 border border-yellow-500/30 hover:border-yellow-400/50"
                          }`}
                          onClick={() => handleCategoryChange(category.name)}
                        >
                          <span>{category.name}</span>
                          <Badge className="bg-black/60 text-yellow-300 border border-yellow-400/40 px-3 py-1 rounded-full font-bold">
                            {products.filter(p => p.category === category.name).length}
                          </Badge>
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>

              {/* Enhanced Brands Section */}
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 to-amber-500/20 blur-xl rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500"></div>
                <Card className="relative bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 border-2 border-yellow-500/50 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
                  <div className="absolute -top-10 -left-10 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl animate-pulse delay-500"></div>
                  
                  <CardHeader className="relative pb-6 border-b border-yellow-500/30">
                    <CardTitle className="text-2xl text-yellow-400 flex items-center gap-3 font-black">
                      <div className="p-2 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl">
                        <Star className="w-6 h-6 text-yellow-400" />
                      </div>
                      Premium Brands
                    </CardTitle>
                  </CardHeader>
                  
                  <CardContent className="relative p-6 space-y-3">
                    {brands.slice(0, 8).map((brand, index) => (
                      <motion.div 
                        key={brand.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 + 0.3 }}
                        whileHover={{ scale: 1.02 }} 
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          variant={selectedBrand === brand.name ? "default" : "ghost"}
                          className={`w-full h-12 justify-between text-lg font-bold rounded-xl transition-all duration-300 ${
                            selectedBrand === brand.name 
                              ? "bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-lg shadow-yellow-400/30" 
                              : "text-white hover:text-yellow-400 hover:bg-yellow-400/10 border border-yellow-500/30 hover:border-yellow-400/50"
                          }`}
                          onClick={() => handleBrandChange(selectedBrand === brand.name ? "" : brand.name)}
                        >
                          <span>{brand.name}</span>
                          <Badge className="bg-black/60 text-yellow-300 border border-yellow-400/40 px-3 py-1 rounded-full font-bold">
                            {products.filter(p => p.brand === brand.name).length}
                          </Badge>
                        </Button>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            </motion.div>
            ) : (
              <div className="lg:col-span-1 space-y-8">
                {/* Static fallback for sidebar when not mounted */}
                <div className="bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 border-2 border-yellow-500/50 rounded-3xl shadow-2xl backdrop-blur-xl overflow-hidden">
                  <div className="p-6">
                    <h3 className="text-xl text-yellow-400 font-bold mb-4">Loading Filters...</h3>
                    <div className="space-y-3">
                      <div className="h-12 bg-gray-800/50 rounded-xl animate-pulse"></div>
                      <div className="h-12 bg-gray-800/50 rounded-xl animate-pulse"></div>
                      <div className="h-12 bg-gray-800/50 rounded-xl animate-pulse"></div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Enhanced Premium Products Grid */}
            {mounted ? (
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="lg:col-span-3"
              >
              {!mounted || loading ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32 max-w-2xl mx-auto"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-amber-500/30 blur-3xl rounded-full animate-pulse"></div>
                    <div className="relative bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 backdrop-blur-xl border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl">
                      <div className="relative mb-8">
                        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full blur opacity-75 animate-pulse"></div>
                        <div className="relative w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                          <Package className="h-12 w-12 animate-spin text-black" />
                        </div>
                      </div>
                      <h3 className="text-4xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-4">
                        Loading Premium Products
                      </h3>
                      <p className="text-yellow-200 text-xl mb-8 flex items-center gap-3 justify-center">
                        <Zap className="w-6 h-6 text-yellow-400" />
                        Fetching elite inventory from database
                      </p>
                    </div>
                  </div>
                </motion.div>
              ) : filteredProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-32 max-w-2xl mx-auto"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 blur-3xl rounded-full"></div>
                    <div className="relative bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 backdrop-blur-xl border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl">
                      <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-full flex items-center justify-center mb-8 border-2 border-yellow-400/40">
                        <Package className="h-12 w-12 text-yellow-400" />
                      </div>
                      <h3 className="text-4xl font-black text-white mb-4">No Premium Products Found</h3>
                      <p className="text-yellow-200 text-xl mb-8">Try adjusting your search filters or explore different categories</p>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Button 
                          onClick={clearFilters} 
                          className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-amber-500 hover:from-yellow-500 hover:via-amber-500 hover:to-orange-500 text-black font-black text-xl px-12 py-4 rounded-2xl shadow-2xl border-0 transition-all duration-300"
                        >
                          <X className="w-6 h-6 mr-3" />
                          Clear All Filters
                        </Button>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <>
                  {/* Enhanced Results Header */}
                  <motion.div 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                  >
                    <div className="bg-gradient-to-r from-black/80 via-gray-900/90 to-black/80 backdrop-blur-xl border-2 border-yellow-500/40 rounded-2xl p-6 shadow-xl">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-xl">
                            <Package className="w-6 h-6 text-yellow-400" />
                          </div>
                          <div>
                            <p className="text-yellow-100 text-2xl font-bold">
                              Showing <span className="text-yellow-400 font-black">{filteredProducts.length}</span> premium products
                            </p>
                            <p className="text-yellow-300/70">Elite inventory curated for professionals</p>
                          </div>
                        </div>
                        <Badge className="bg-gradient-to-r from-green-500/20 to-green-600/20 text-green-400 border border-green-400/50 px-6 py-3 rounded-full text-lg font-bold">
                          ⚡ Instant Results
                        </Badge>
                      </div>
                    </div>
                  </motion.div>
                  
                  {/* Premium Products Grid */}
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className={`grid gap-8 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}
                  >
                    {filteredProducts.map((product, index) => (
                      <motion.div
                        key={product.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                      >
                        <DatabaseProductCard 
                          product={product} 
                          onAddToCart={addToCart}
                          onQuickView={openQuickView}
                          onAddToCompare={addToCompare}
                          isInCompare={compareProducts.some(item => item.id === product.id)}
                        />
                      </motion.div>
                    ))}
                  </motion.div>
                </>
              )}
            </motion.div>
            ) : (
              <div className="lg:col-span-3">
                <div className="text-center py-32">
                  <div className="bg-gradient-to-br from-black/90 via-gray-900/95 to-black/90 backdrop-blur-xl border-2 border-yellow-500/50 rounded-3xl p-12 shadow-2xl max-w-2xl mx-auto">
                    <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400 to-amber-500 rounded-full flex items-center justify-center mb-8">
                      <Package className="h-12 w-12 text-black" />
                    </div>
                    <h3 className="text-4xl font-black text-white mb-4">Loading Premium Products</h3>
                    <p className="text-yellow-200 text-xl">Initializing premium catalog...</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
      
      {/* Simplified Quick View Modal */}
      <Dialog open={showQuickView} onOpenChange={setShowQuickView}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden bg-black/95 backdrop-blur-2xl border-0 text-white rounded-3xl shadow-2xl p-0">
          <DialogHeader className="sr-only">
            <DialogTitle>Product Quick View</DialogTitle>
          </DialogHeader>
          
          {/* Background Effects */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(251,191,36,0.1),transparent_50%)]"></div>
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent"></div>
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent"></div>
          </div>
          
          {/* Close Button */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowQuickView(false)}
            className="absolute top-6 right-6 z-50 w-10 h-10 bg-red-500/20 backdrop-blur-sm border border-red-400/40 rounded-full flex items-center justify-center text-red-400 hover:text-red-300 transition-all duration-300"
          >
            <X className="w-5 h-5" />
          </motion.button>
          
          {quickViewProduct && (
            <div className="relative z-10 p-8">
              {/* Compact Header */}
              <div className="text-center mb-8">
                <h1 className="text-3xl font-black bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent mb-2">
                  Quick Preview
                </h1>
              </div>
              
              {/* Main Content - Single Row Layout */}
              <div className="grid md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="relative">
                  <div className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-amber-500 rounded-2xl aspect-square flex items-center justify-center border-2 border-yellow-300/50 shadow-2xl">
                    <Package className="w-32 h-32 text-black/80" />
                    
                    {/* Price Badge */}
                    <div className="absolute top-4 right-4 bg-black/90 backdrop-blur-sm rounded-xl px-4 py-2 border border-yellow-400/50">
                      <span className="text-yellow-400 font-black text-xl">Rs. {quickViewProduct.price.toLocaleString()}</span>
                    </div>
                    
                    {/* Stock Badge */}
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-green-500/20 text-green-400 border border-green-400/50 px-3 py-1 rounded-full">
                        {quickViewProduct.stock} in stock
                      </Badge>
                    </div>
                  </div>
                </div>
                
                {/* Essential Details */}
                <div className="space-y-6">
                  {/* Product Name & Brand */}
                  <div>
                    <h2 className="text-2xl font-bold text-white mb-2 line-clamp-2">
                      {quickViewProduct.name}
                    </h2>
                    <div className="flex items-center gap-2">
                      <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 px-3 py-1 rounded-full">
                        {quickViewProduct.brand}
                      </Badge>
                      <Badge className="bg-purple-500/20 text-purple-400 border border-purple-400/40 px-3 py-1 rounded-full">
                        {quickViewProduct.category}
                      </Badge>
                    </div>
                  </div>
                  
                  {/* Rating */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className={`w-5 h-5 ${i < quickViewProduct.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                      ))}
                    </div>
                    <span className="text-yellow-300 font-bold">{quickViewProduct.rating}/5</span>
                  </div>
                  
                  {/* Key Info */}
                  <div className="bg-gradient-to-r from-gray-900/60 to-black/60 rounded-xl p-4 border border-yellow-500/30 space-y-3">
                    <div className="flex justify-between">
                      <span className="text-yellow-300">Price:</span>
                      <span className="text-white font-bold">Rs. {quickViewProduct.price.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-yellow-300">Availability:</span>
                      <span className="text-green-400 font-semibold">{quickViewProduct.stock} units</span>
                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="space-y-3">
                    <Button 
                      onClick={() => {
                        addToCart(quickViewProduct);
                        setShowQuickView(false);
                      }}
                      className="w-full h-12 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-orange-500 text-black font-bold rounded-xl transition-all duration-300"
                    >
                      <ShoppingCart className="w-5 h-5 mr-2" />
                      Add to Cart
                    </Button>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <Button 
                        variant="outline"
                        onClick={() => {
                          addToCompare(quickViewProduct);
                          setShowQuickView(false);
                        }}
                        className="border-yellow-500/40 text-yellow-300 hover:bg-yellow-400/10 rounded-xl"
                      >
                        <GitCompare className="w-4 h-4 mr-2" />
                        Compare
                      </Button>
                      <Button 
                        variant="outline"
                        onClick={() => alert('💝 Wishlist feature coming soon!')}
                        className="border-pink-500/40 text-pink-300 hover:bg-pink-400/10 rounded-xl"
                      >
                        <Heart className="w-4 h-4 mr-2" />
                        Wishlist
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Compare Modal */}
      <Dialog open={showCompare} onOpenChange={setShowCompare}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-black via-gray-900 to-black border-2 border-yellow-500/50 text-white rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-bold bg-gradient-to-r from-yellow-400 to-amber-500 bg-clip-text text-transparent">
              Product Comparison ({compareProducts.length}/3)
            </DialogTitle>
          </DialogHeader>
          
          {compareProducts.length > 0 ? (
            <div className="p-6">
              {/* Compare Actions */}
              <div className="flex items-center justify-between mb-6">
                <Badge className="bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 px-4 py-2 rounded-full text-lg font-bold">
                  {compareProducts.length} Products Selected
                </Badge>
                <Button 
                  variant="outline"
                  onClick={() => setCompareProducts([])}
                  className="border-red-500/40 text-red-300 hover:bg-red-400/10"
                >
                  Clear All
                </Button>
              </div>
              
              {/* Comparison Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {compareProducts.map((product) => (
                  <div key={product.id} className="bg-gradient-to-br from-gray-900/80 to-black/80 border border-yellow-500/30 rounded-2xl p-6 relative">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFromCompare(product.id)}
                      className="absolute top-2 right-2 text-red-400 hover:text-red-300 hover:bg-red-400/10"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                    
                    <div className="bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl aspect-square flex items-center justify-center mb-4">
                      <Package className="w-16 h-16 text-black" />
                    </div>
                    
                    <h4 className="text-lg font-bold text-white mb-4 line-clamp-2">{product.name}</h4>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-yellow-300">Brand:</span>
                        <span className="text-white font-semibold">{product.brand}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-300">Category:</span>
                        <span className="text-white font-semibold">{product.category}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-300">Price:</span>
                        <span className="text-yellow-400 font-bold">Rs. {product.price.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-yellow-300">Stock:</span>
                        <span className="text-green-400 font-semibold">{product.stock} units</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-yellow-300">Rating:</span>
                        <div className="flex items-center gap-1">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className={`w-3 h-3 ${i < product.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'}`} />
                          ))}
                          <span className="text-white text-xs ml-1">{product.rating}/5</span>
                        </div>
                      </div>
                    </div>
                    
                    <Button 
                      onClick={() => addToCart(product)}
                      className="w-full mt-4 bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-orange-500 text-black font-bold rounded-xl"
                    >
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="w-24 h-24 mx-auto bg-gradient-to-r from-yellow-400/20 to-amber-500/20 rounded-full flex items-center justify-center mb-6">
                <GitCompare className="w-12 h-12 text-yellow-400" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">No Products to Compare</h3>
              <p className="text-yellow-200 mb-6">Add some products to start comparing their features and specifications.</p>
              <Button 
                onClick={() => setShowCompare(false)}
                className="bg-gradient-to-r from-yellow-400 to-amber-500 text-black font-bold px-8 py-2 rounded-xl"
              >
                Continue Shopping
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Fixed Compare Button */}
      {compareProducts.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <Button
            onClick={openCompare}
            className="bg-gradient-to-r from-yellow-400 to-amber-500 hover:from-yellow-500 hover:to-orange-500 text-black font-bold px-6 py-3 rounded-full shadow-2xl shadow-yellow-400/50 border-2 border-yellow-300"
          >
            <GitCompare className="w-5 h-5 mr-2" />
            Compare ({compareProducts.length})
          </Button>
        </motion.div>
      )}

      {/* Fixed Cart Button */}
      {cartItemCount > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-6 left-6 z-50"
        >
          <Button
            onClick={() => {
              // Navigate to cart page
              window.location.href = '/cart';
            }}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-bold px-6 py-3 rounded-full shadow-2xl shadow-green-400/50 border-2 border-green-400"
          >
            <ShoppingCart className="w-5 h-5 mr-2" />
            Cart ({cartItemCount})
          </Button>
        </motion.div>
      )}
    </>
  );
}
