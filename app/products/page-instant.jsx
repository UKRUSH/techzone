"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  Zap,
  Package,
  Star,
  ShoppingCart
} from "lucide-react";

// INSTANT DATA - No loading, no API calls, no delays
const INSTANT_PRODUCTS = [
  { id: 1, name: "RTX 4090 Gaming GPU", price: 1599, category: "gpu", brand: "NVIDIA", inStock: true, rating: 5 },
  { id: 2, name: "Intel i9-13900K", price: 589, category: "cpu", brand: "Intel", inStock: true, rating: 5 },
  { id: 3, name: "Samsung 980 PRO 2TB", price: 299, category: "storage", brand: "Samsung", inStock: true, rating: 4 },
  { id: 4, name: "Corsair DDR5-5600 32GB", price: 399, category: "memory", brand: "Corsair", inStock: true, rating: 5 },
  { id: 5, name: "ASUS ROG Strix X670-E", price: 499, category: "motherboard", brand: "ASUS", inStock: true, rating: 4 },
  { id: 6, name: "Corsair RM850x PSU", price: 159, category: "power-supply", brand: "Corsair", inStock: true, rating: 5 },
  { id: 7, name: "NZXT Kraken X73", price: 199, category: "cooling", brand: "NZXT", inStock: true, rating: 4 },
  { id: 8, name: "Fractal Design Define 7", price: 169, category: "case", brand: "Fractal", inStock: true, rating: 5 },
  { id: 9, name: "AMD Ryzen 9 7950X", price: 699, category: "cpu", brand: "AMD", inStock: true, rating: 5 },
  { id: 10, name: "RTX 4080 Super", price: 999, category: "gpu", brand: "NVIDIA", inStock: true, rating: 4 },
  { id: 11, name: "WD Black SN850X 1TB", price: 149, category: "storage", brand: "Western Digital", inStock: true, rating: 4 },
  { id: 12, name: "G.Skill Trident Z5 RGB", price: 299, category: "memory", brand: "G.Skill", inStock: true, rating: 5 },
  { id: 13, name: "MSI B650 Gaming Plus", price: 179, category: "motherboard", brand: "MSI", inStock: true, rating: 4 },
  { id: 14, name: "EVGA 750W Gold", price: 129, category: "power-supply", brand: "EVGA", inStock: true, rating: 4 },
  { id: 15, name: "Cooler Master H500", price: 119, category: "case", brand: "Cooler Master", inStock: true, rating: 4 },
  { id: 16, name: "Arctic Freezer 34", price: 39, category: "cooling", brand: "Arctic", inStock: true, rating: 4 }
];

const INSTANT_CATEGORIES = [
  { name: "Graphics Cards", slug: "gpu", count: 3 },
  { name: "Processors", slug: "cpu", count: 2 },
  { name: "Storage", slug: "storage", count: 2 },
  { name: "Memory", slug: "memory", count: 2 },
  { name: "Motherboards", slug: "motherboard", count: 2 },
  { name: "Power Supplies", slug: "power-supply", count: 2 },
  { name: "Cooling", slug: "cooling", count: 2 },
  { name: "Cases", slug: "case", count: 2 }
];

const INSTANT_BRANDS = [
  { name: "NVIDIA", count: 2 }, { name: "Intel", count: 1 }, { name: "AMD", count: 1 },
  { name: "Samsung", count: 1 }, { name: "Corsair", count: 2 }, { name: "ASUS", count: 1 },
  { name: "MSI", count: 1 }, { name: "Western Digital", count: 1 }, { name: "G.Skill", count: 1 },
  { name: "NZXT", count: 1 }, { name: "Fractal", count: 1 }, { name: "EVGA", count: 1 }
];

// INSTANT Product Card - Zero loading time
const InstantProductCard = memo(function InstantProductCard({ product }) {
  const categoryColors = {
    gpu: 'from-blue-600 to-purple-600',
    cpu: 'from-red-600 to-orange-600', 
    storage: 'from-green-600 to-cyan-600',
    memory: 'from-purple-600 to-pink-600',
    motherboard: 'from-yellow-600 to-red-600',
    'power-supply': 'from-gray-600 to-gray-500',
    cooling: 'from-cyan-600 to-blue-600',
    case: 'from-slate-600 to-gray-600'
  };

  return (
    <Card className="group bg-gradient-to-b from-black/95 via-black/85 to-black/95 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-150 cursor-pointer h-full">
      <CardHeader className="pb-2">
        <div className={`aspect-square rounded-lg mb-3 flex items-center justify-center relative bg-gradient-to-br ${categoryColors[product.category] || 'from-gray-600 to-gray-500'}`}>
          <Package className="w-12 h-12 text-white/90" />
          <div className="absolute top-2 left-2">
            <Badge className="bg-black/60 text-white border-white/30 text-xs">
              {product.category.toUpperCase()}
            </Badge>
          </div>
          <div className="absolute top-2 right-2">
            <Badge className="bg-green-500/90 text-white border-green-400/30 text-xs">
              IN STOCK
            </Badge>
          </div>
          <div className="absolute bottom-2 right-2 bg-black/80 rounded px-2 py-1">
            <span className="text-yellow-400 font-bold text-sm">${product.price}</span>
          </div>
        </div>
        <CardTitle className="text-white group-hover:text-yellow-400 transition-colors text-lg leading-tight">
          {product.name}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
          ))}
          <span className="ml-2 text-gray-400 text-sm">({product.rating})</span>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-yellow-400">${product.price}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">{product.brand}</div>
          </div>
        </div>
        <Button className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-colors duration-150" size="sm">
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
});

export default function InstantProductsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  // INSTANT filtering - zero delay
  const filteredProducts = useMemo(() => {
    let products = INSTANT_PRODUCTS;
    
    if (selectedCategory) {
      products = products.filter(p => p.category === selectedCategory);
    }
    if (selectedBrand) {
      products = products.filter(p => p.brand === selectedBrand);
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      products = products.filter(p =>
        p.name.toLowerCase().includes(query) ||
        p.brand.toLowerCase().includes(query) ||
        p.category.toLowerCase().includes(query)
      );
    }
    return products;
  }, [selectedCategory, selectedBrand, searchQuery]);

  const handleCategoryChange = useCallback((category) => setSelectedCategory(category), []);
  const handleBrandChange = useCallback((brand) => setSelectedBrand(brand), []);
  const handleSearchChange = useCallback((e) => setSearchQuery(e.target.value), []);
  const clearFilters = useCallback(() => {
    setSelectedCategory("");
    setSelectedBrand("");
    setSearchQuery("");
  }, []);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Instant Status Indicator */}
      <div className="fixed top-4 right-4 z-50 bg-green-500/20 text-green-400 border border-green-400/30 px-3 py-2 rounded-lg text-sm font-medium">
        <Zap className="w-4 h-4 inline mr-2" />
        Instant Loading Active
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Zap className="w-8 h-8 text-yellow-400" />
            <div>
              <h1 className="text-3xl font-bold text-white">Products</h1>
              <p className="text-gray-400">
                {filteredProducts.length} of {INSTANT_PRODUCTS.length} products
                <Badge className="ml-2 bg-green-500/20 text-green-400 border-green-400/30">
                  ⚡ Zero Loading Time
                </Badge>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant={viewMode === "grid" ? "default" : "outline"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "outline"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Instant Sidebar */}
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

            {(selectedCategory || selectedBrand || searchQuery) && (
              <Button variant="outline" onClick={clearFilters} className="w-full border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10">
                Clear All Filters
              </Button>
            )}

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
                  className={`w-full justify-start ${selectedCategory === "" ? "bg-yellow-400 text-black" : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"}`}
                  onClick={() => handleCategoryChange("")}
                >
                  All Categories
                </Button>
                {INSTANT_CATEGORIES.map((category) => (
                  <Button
                    key={category.slug}
                    variant={selectedCategory === category.slug ? "default" : "ghost"}
                    className={`w-full justify-between ${selectedCategory === category.slug ? "bg-yellow-400 text-black" : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"}`}
                    onClick={() => handleCategoryChange(category.slug)}
                  >
                    {category.name}
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {INSTANT_PRODUCTS.filter(p => p.category === category.slug).length}
                    </Badge>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Brands */}
            <Card className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30">
              <CardHeader>
                <CardTitle className="text-white">Top Brands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {INSTANT_BRANDS.slice(0, 8).map((brand) => (
                  <Button
                    key={brand.name}
                    variant={selectedBrand === brand.name ? "default" : "ghost"}
                    className={`w-full justify-between text-sm ${selectedBrand === brand.name ? "bg-yellow-400 text-black" : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"}`}
                    onClick={() => handleBrandChange(selectedBrand === brand.name ? "" : brand.name)}
                  >
                    {brand.name}
                    <Badge variant="secondary" className="bg-gray-700 text-gray-300">
                      {INSTANT_PRODUCTS.filter(p => p.brand === brand.name).length}
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
                <p className="text-gray-400 mb-4">Try different filters</p>
                <Button onClick={clearFilters} className="bg-yellow-400 text-black">Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between mb-6">
                  <p className="text-gray-400">Showing {filteredProducts.length} products</p>
                  <Badge className="bg-green-500/20 text-green-400 border-green-400/30">⚡ Instant Results</Badge>
                </div>
                <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 xl:grid-cols-3" : "grid-cols-1"}`}>
                  {filteredProducts.map((product) => (
                    <InstantProductCard key={product.id} product={product} />
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
