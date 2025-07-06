"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import SuperFastProductCard from "@/components/SuperFastProductCard";
import { useInstantProducts, useInstantCategories, useInstantBrands } from "@/lib/hooks/useInstantData";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Zap,
  Package,
  Wifi,
  WifiOff
} from "lucide-react";

// Connection status indicator
const ConnectionStatus = memo(function ConnectionStatus({ isOnline }) {
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
      isOnline 
        ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
    }`}>
      {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
      {isOnline ? 'Live Data' : 'Instant Mode'}
    </div>
  );
});

export default function SuperFastProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // INSTANT data hooks - zero loading time
  const { data: allProducts, isOnline } = useInstantProducts();
  const { data: categories } = useInstantCategories();
  const { data: brands } = useInstantBrands();

  // Instant client-side filtering
  const filteredProducts = useMemo(() => {
    let products = allProducts;
    
    // Category filter
    if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory);
    }
    
    // Brand filter
    if (selectedBrand) {
      products = products.filter(p => p.brand === selectedBrand);
    }
    
    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    
    return products;
  }, [allProducts, selectedCategory, selectedBrand, searchQuery]);

  // Instant filter handlers
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategory(category);
  }, []);

  const handleBrandChange = useCallback((brand) => {
    setSelectedBrand(brand);
  }, []);

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <ConnectionStatus isOnline={isOnline} />
      
      <main className="container mx-auto px-4 py-8">
        {/* Header with instant stats */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Products</h1>
              <p className="text-gray-400">
                {filteredProducts.length} of {allProducts.length} products
                <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-400/30">
                  Instant Loading
                </Badge>
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
          {/* Instant Sidebar Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Instant Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400/70 w-4 h-4" />
              <Input
                placeholder="Search instantly..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="pl-10 bg-black/60 border-yellow-400/30 text-white placeholder-yellow-400/50 focus:border-yellow-400"
              />
            </div>

            {/* Clear filters */}
            {(selectedCategory || selectedBrand || searchQuery) && (
              <Button 
                variant="outline" 
                onClick={clearFilters}
                className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
              >
                Clear All Filters
              </Button>
            )}

            {/* Instant Categories */}
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
                  All Categories
                </Button>
                {categories.map((category) => (
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
                      {allProducts.filter(p => p.category === category.slug).length}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Instant Brands */}
            <Card className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-white">Top Brands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {brands.filter(b => b.popular).map((brand) => (
                  <Button
                    key={brand.name}
                    variant={selectedBrand === brand.name ? "default" : "ghost"}
                    className={`w-full justify-between text-sm ${
                      selectedBrand === brand.name 
                        ? "bg-yellow-400 text-black" 
                        : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
                    }`}
                    onClick={() => handleBrandChange(selectedBrand === brand.name ? "" : brand.name)}
                  >
                    {brand.name}
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {allProducts.filter(p => p.brand === brand.name).length}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Instant Products Grid */}
          <div className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-600" />
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">Try adjusting your filters</p>
                <Button onClick={clearFilters} className="bg-yellow-400 text-black">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                {/* Results info */}
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-400">
                    Showing {filteredProducts.length} products
                    {(selectedCategory || selectedBrand || searchQuery) && " (filtered)"}
                  </p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
                    ⚡ Instant Results
                  </Badge>
                </div>

                {/* INSTANT Products Grid - No Loading */}
                <div className={`grid gap-6 ${
                  viewMode === "grid" 
                    ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" 
                    : "grid-cols-1"
                }`}>
                  {filteredProducts.map((product) => (
                    <SuperFastProductCard key={product.id} product={product} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
