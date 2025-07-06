"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { GlobalLoader } from "@/components/ui/loading";
import { useQuery } from "@tanstack/react-query";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  SlidersHorizontal,
  Package,
  Star,
  ShoppingCart,
  Zap
} from "lucide-react";

// Ultra-fast product card with minimal re-renders
const FastProductCard = memo(function FastProductCard({ product }) {
  return (
    <Card className="group bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-200 cursor-pointer">
      <CardHeader className="pb-2">
        <div className="aspect-square bg-gray-800 rounded-lg mb-3 flex items-center justify-center relative overflow-hidden">
          <Package className="w-12 h-12 text-gray-600" />
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 border-green-400/30">
              In Stock
            </Badge>
          </div>
        </div>
        <CardTitle className="text-white group-hover:text-yellow-400 transition-colors text-lg">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
            />
          ))}
          <span className="ml-2 text-gray-400 text-sm">{product.rating}/5</span>
        </div>
        
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-yellow-400">${product.price}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">{product.brand}</div>
          </div>
        </div>

        <Button 
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
});

// Loading skeleton for instant feedback
const ProductSkeleton = memo(function ProductSkeleton() {
  return (
    <div className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 rounded-xl p-6 animate-pulse">
      <div className="aspect-square bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-700 rounded mb-4"></div>
      <div className="h-8 bg-gray-700 rounded"></div>
    </div>
  );
});

export default function UltraFastProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // Ultra-fast data fetching with instant fallback
  const { data, isLoading, error, isSuccess } = useQuery({
    queryKey: ['ultra-fast-products', selectedCategory],
    queryFn: async () => {
      const url = selectedCategory 
        ? `/api/products/fast?category=${selectedCategory}&limit=12`
        : '/api/products/fast?limit=12';
      
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
    retry: false, // Fail fast for instant feedback
  });

  // Instant search filtering (client-side for speed)
  const filteredProducts = useMemo(() => {
    if (!data?.products) return [];
    
    if (!searchQuery) return data.products;
    
    return data.products.filter(product =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data?.products, searchQuery]);

  // Instant category change
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
    setSearchQuery(""); // Clear search when changing category
  }, []);

  // Show immediate skeleton on first load
  if (isLoading && !data) {
    return (
      <div className="min-h-screen bg-black text-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center gap-2 mb-6">
            <Zap className="w-6 h-6 text-yellow-400" />
            <h1 className="text-3xl font-bold text-white">Products</h1>
            <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
              Loading...
            </Badge>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header with instant feedback */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Products</h1>
              <p className="text-gray-400">
                {filteredProducts.length} products available
                {data?.cached && (
                  <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-400/30">
                    Instant Load
                  </Badge>
                )}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === "grid" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("grid")}
              className="border-yellow-400/30"
            >
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === "list" ? "default" : "outline"}
              size="sm"
              onClick={() => setViewMode("list")}
              className="border-yellow-400/30"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400/70 w-4 h-4" />
              <Input
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/60 border-yellow-400/30 text-white placeholder-yellow-400/50 focus:border-yellow-400"
              />
            </div>

            {/* Categories */}
            <Card className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Filter className="w-5 h-5 mr-2 text-yellow-400" />
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "" ? "default" : "ghost"}
                  className={`w-full justify-start ${
                    selectedCategory === "" 
                      ? "bg-yellow-400 text-black" 
                      : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
                  }`}
                  onClick={() => handleCategoryChange("")}
                >
                  All Products
                </Button>
                {data?.categories?.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "default" : "ghost"}
                    className={`w-full justify-between ${
                      selectedCategory === category.slug 
                        ? "bg-yellow-400 text-black" 
                        : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
                    }`}
                    onClick={() => handleCategoryChange(category.slug)}
                  >
                    {category.name}
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {category.count}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Brands */}
            {data?.brands && (
              <Card className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30">
                <CardHeader>
                  <CardTitle className="text-white">Top Brands</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {data.brands.slice(0, 6).map((brand) => (
                    <div key={brand.name} className="flex items-center justify-between text-sm">
                      <span className="text-gray-300">{brand.name}</span>
                      <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                        {brand.count}
                      </Badge>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {error && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">Connection Issue</h3>
                <p className="text-gray-400 mb-4">Using cached data for faster browsing</p>
              </div>
            )}

            {filteredProducts.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400">Try adjusting your filters or search terms</p>
              </div>
            )}

            <div className={`grid gap-6 ${
              viewMode === "grid" 
                ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                : "grid-cols-1"
            }`}>
              {filteredProducts.map((product) => (
                <FastProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Load More */}
            {filteredProducts.length > 0 && (
              <div className="text-center mt-12">
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8"
                >
                  Load More Products
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
