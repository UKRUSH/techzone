"use client";

import { useState, useEffect, useMemo, useCallback, memo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCardOptimized";
import { useProductsFast, useCategoriesFast, useBrandsFast } from "@/lib/hooks/useProductsFast";
import { useDebouncedSearch } from "@/lib/hooks/useSearch";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  SlidersHorizontal,
  Package,
  Loader2,
  Wifi,
  WifiOff
} from "lucide-react";

// Loading skeleton component
const SkeletonCard = memo(function SkeletonCard() {
  return (
    <div className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 rounded-2xl p-6 animate-pulse">
      <div className="w-full h-48 bg-gray-700 rounded-lg mb-4"></div>
      <div className="h-6 bg-gray-700 rounded mb-2"></div>
      <div className="h-4 bg-gray-700 rounded mb-4"></div>
      <div className="h-8 bg-gray-700 rounded"></div>
    </div>
  );
});

// Connection status indicator
const ConnectionStatus = memo(function ConnectionStatus({ isOnline }) {
  if (isOnline === undefined) return null;
  
  return (
    <div className={`fixed top-4 right-4 z-50 flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium ${
      isOnline 
        ? 'bg-green-500/20 text-green-400 border border-green-400/30' 
        : 'bg-yellow-500/20 text-yellow-400 border border-yellow-400/30'
    }`}>
      {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
      {isOnline ? 'Connected' : 'Offline Mode'}
    </div>
  );
});

// Memoized sidebar component for better performance
const ProductsSidebar = memo(function ProductsSidebar({
  selectedCategory,
  setSelectedCategory,
  selectedBrand,
  setSelectedBrand,
  priceRange,
  setPriceRange,
  searchTerm,
  setSearchTerm,
  clearFilters,
  categories = [],
  brands = [],
  isLoading = false
}) {
  return (
    <aside className="w-full md:w-80 space-y-6 backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 rounded-2xl shadow-xl shadow-yellow-400/10 p-6 sticky top-8 self-start">
      
      {/* Search */}
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-yellow-400 font-semibold">
            <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5">
              <Search className="w-5 h-5 text-yellow-400" />
            </div>
            Search Products
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <div className="absolute left-3 top-3 text-yellow-400/70">
              <Search className="h-4 w-4" />
            </div>
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-black/60 border-yellow-400/30 text-white rounded-lg focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400"
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Categories */}
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-yellow-400 font-semibold">
            <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5">
              <Package className="w-5 h-5 text-yellow-400" />
            </div>
            Categories
            {isLoading && <Loader2 className="w-4 h-4 ml-2 animate-spin" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={selectedCategory === "" ? "default" : "ghost"}
            className={`w-full justify-start rounded-lg font-medium transition-all ${
              selectedCategory === "" 
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black" 
                : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
            }`}
            onClick={() => setSelectedCategory("")}
          >
            <Package className="w-4 h-4 mr-2" />
            All Categories
          </Button>
          
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {categories.map((category) => (
              <Button
                key={category.id}
                variant={selectedCategory === category.name ? "default" : "ghost"}
                className={`w-full justify-start rounded-lg font-medium transition-all ${
                  selectedCategory === category.name 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black" 
                    : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
                }`}
                onClick={() => setSelectedCategory(category.name)}
              >
                <Package className="w-4 h-4 mr-2" />
                <span className="truncate">{category.name}</span>
                <span className="ml-auto text-xs opacity-60">
                  {category._count?.products || 0}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Brands */}
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-yellow-400 font-semibold">
            <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5">
              <SlidersHorizontal className="w-5 h-5 text-yellow-400" />
            </div>
            Brands
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <Button
            variant={selectedBrand === "" ? "default" : "ghost"}
            className={`w-full justify-start rounded-lg font-medium transition-all ${
              selectedBrand === "" 
                ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black" 
                : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
            }`}
            onClick={() => setSelectedBrand("")}
          >
            <SlidersHorizontal className="w-4 h-4 mr-2" />
            All Brands
          </Button>
          
          <div className="space-y-1 max-h-48 overflow-y-auto">
            {brands.map((brand) => (
              <Button
                key={brand.id}
                variant={selectedBrand === brand.name ? "default" : "ghost"}
                className={`w-full justify-start rounded-lg font-medium transition-all ${
                  selectedBrand === brand.name 
                    ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black" 
                    : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
                }`}
                onClick={() => setSelectedBrand(brand.name)}
              >
                <div className="w-4 h-4 mr-2 rounded bg-yellow-400/20 flex items-center justify-center text-xs font-bold">
                  {brand.name.charAt(0)}
                </div>
                <span className="truncate">{brand.name}</span>
                <span className="ml-auto text-xs opacity-60">
                  {brand._count?.products || 0}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Price Range */}
      <Card className="bg-transparent border-0 shadow-none">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center text-yellow-400 font-semibold">
            <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5">
              <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none">
                <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2"/>
                <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            Price Range
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-3">
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Min ($)</label>
              <input 
                type="number" 
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                className="w-full py-2 px-3 bg-black/60 border border-yellow-400/30 rounded-md text-white text-sm focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400"
                min="0"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-gray-400 mb-1">Max ($)</label>
              <input 
                type="number" 
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || 10000})}
                className="w-full py-2 px-3 bg-black/60 border border-yellow-400/30 rounded-md text-white text-sm focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400"
                min={priceRange.min}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/60 rounded-lg font-medium py-6"
        onClick={clearFilters}
      >
        <Filter className="w-4 h-4 mr-2" />
        Reset All Filters
      </Button>
    </aside>
  );
});

export default function ProductsPageFast() {
  // State management with optimized defaults
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [isOnline, setIsOnline] = useState(true);

  // Debounced search for better performance
  const { searchTerm, debouncedSearchTerm, isSearching, setSearchTerm } = useDebouncedSearch("", 300);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Memoized filters object
  const filters = useMemo(() => ({
    page: currentPage,
    limit: 12, // Smaller limit for faster loading
    category: selectedCategory,
    brand: selectedBrand,
    search: debouncedSearchTerm,
    ...(priceRange.min > 0 && { minPrice: priceRange.min }),
    ...(priceRange.max < 10000 && { maxPrice: priceRange.max })
  }), [currentPage, selectedCategory, selectedBrand, debouncedSearchTerm, priceRange]);

  // Use fast data fetching hooks with fallbacks
  const {
    data: productsData = {},
    isLoading: isLoadingProducts,
    isFetching: isFetchingProducts,
    error: productsError
  } = useProductsFast(filters);

  const { data: categories = [], isLoading: categoriesLoading } = useCategoriesFast();
  const { data: brands = [], isLoading: brandsLoading } = useBrandsFast();

  const products = productsData.products || [];
  const pagination = productsData.pagination || {};

  // Reset page when filters change
  useEffect(() => {
    if (currentPage !== 1) {
      setCurrentPage(1);
    }
  }, [selectedCategory, selectedBrand, debouncedSearchTerm, priceRange]);

  // Memoized sorted products for client-side sorting
  const sortedProducts = useMemo(() => {
    if (!Array.isArray(products)) return [];
    
    return [...products].sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return (a.variants[0]?.price || 0) - (b.variants[0]?.price || 0);
        case "price-high":
          return (b.variants[0]?.price || 0) - (a.variants[0]?.price || 0);
        case "rating":
          return (b.averageRating || 0) - (a.averageRating || 0);
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        default:
          return a.name.localeCompare(b.name);
      }
    });
  }, [products, sortBy]);

  // Optimized clear filters function
  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange({ min: 0, max: 10000 });
    setSearchTerm("");
    setCurrentPage(1);
  }, [setSearchTerm]);

  // Loading state - show immediately for better UX
  const showLoading = isLoadingProducts && !products.length;
  const showSkeleton = showLoading || (isSearching && !products.length);

  return (
    <>
      <Header />
      <ConnectionStatus isOnline={productsError ? false : isOnline} />
      
      <div className="min-h-screen bg-black relative">
        {/* Simplified background for better performance */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-black"></div>
        
        <div className="container mx-auto px-4 py-8 relative z-10 flex flex-col md:flex-row gap-8">
          
          {/* Sidebar */}
          <ProductsSidebar
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            selectedBrand={selectedBrand}
            setSelectedBrand={setSelectedBrand}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            clearFilters={clearFilters}
            categories={categories}
            brands={brands}
            isLoading={categoriesLoading || brandsLoading}
          />
          
          {/* Main Content */}
          <main className="flex-1">
            
            {/* Header */}
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold text-white mb-4">
                PC Components
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                Build your dream PC with our premium components
              </p>
            </div>
            
            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4 bg-black/60 backdrop-blur-md p-4 rounded-xl border border-yellow-400/20">
              
              <div className="flex flex-wrap items-center gap-4">
                {/* Results count */}
                <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                  {isFetchingProducts && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {pagination?.total || sortedProducts.length} products
                  {!isOnline && <span className="ml-1 text-yellow-300">(offline)</span>}
                </Badge>
                
                {/* Active filters */}
                {(selectedCategory || selectedBrand || debouncedSearchTerm || priceRange.min > 0 || priceRange.max < 10000) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedCategory && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-yellow-400/20 text-yellow-400 cursor-pointer hover:bg-yellow-400/30"
                        onClick={() => setSelectedCategory("")}
                      >
                        <Package className="w-3 h-3 mr-1" />
                        {selectedCategory}
                        <span className="ml-1 hover:bg-yellow-400/40 rounded-full w-4 h-4 flex items-center justify-center">×</span>
                      </Badge>
                    )}
                    
                    {selectedBrand && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-yellow-400/20 text-yellow-400 cursor-pointer hover:bg-yellow-400/30"
                        onClick={() => setSelectedBrand("")}
                      >
                        <SlidersHorizontal className="w-3 h-3 mr-1" />
                        {selectedBrand}
                        <span className="ml-1 hover:bg-yellow-400/40 rounded-full w-4 h-4 flex items-center justify-center">×</span>
                      </Badge>
                    )}
                    
                    {debouncedSearchTerm && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-yellow-400/20 text-yellow-400 cursor-pointer hover:bg-yellow-400/30"
                        onClick={() => setSearchTerm("")}
                      >
                        <Search className="w-3 h-3 mr-1" />
                        "{debouncedSearchTerm}"
                        <span className="ml-1 hover:bg-yellow-400/40 rounded-full w-4 h-4 flex items-center justify-center">×</span>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-black/70 border border-yellow-400/30 text-white rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-yellow-400/40"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>
                
                {/* View Mode */}
                <div className="flex items-center border border-yellow-400/40 rounded-lg overflow-hidden">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-r-none ${viewMode === "grid" ? "bg-yellow-400 text-black" : "text-white hover:text-yellow-400"}`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded-l-none ${viewMode === "list" ? "bg-yellow-400 text-black" : "text-white hover:text-yellow-400"}`}
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            {/* Products Grid/List */}
            {showSkeleton ? (
              <div className={
                viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                  : "space-y-4"
              }>
                {Array.from({ length: 8 }).map((_, index) => (
                  <SkeletonCard key={index} />
                ))}
              </div>
            ) : productsError && !products.length ? (
              <div className="text-center py-20">
                <WifiOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Connection Issue</h3>
                <p className="text-gray-400 mb-4">
                  Unable to connect to our servers. Showing offline catalog.
                </p>
                <Button onClick={() => window.location.reload()} className="bg-yellow-400 text-black">
                  Try Again
                </Button>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-20">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search criteria or clearing filters
                </p>
                <Button onClick={clearFilters} className="bg-yellow-400 text-black">
                  Clear Filters
                </Button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                    : "space-y-4"
                }>
                  {sortedProducts.map((product, index) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      variant={viewMode === "list" ? "compact" : "default"}
                      priority={index < 4} // Prioritize first 4 images
                    />
                  ))}
                </div>
                
                {/* Pagination */}
                {pagination && pagination.totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-4 mt-12">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1 || isFetchingProducts}
                      className="border-yellow-400/30 text-white hover:bg-yellow-400/10"
                    >
                      Previous
                    </Button>
                    
                    <div className="text-yellow-400 font-medium">
                      Page {currentPage} of {pagination.totalPages}
                    </div>
                    
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(pagination.totalPages, currentPage + 1))}
                      disabled={currentPage === pagination.totalPages || isFetchingProducts}
                      className="border-yellow-400/30 text-white hover:bg-yellow-400/10"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
