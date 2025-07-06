"use client";

import { useState, useMemo, memo } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Tag, 
  Clock, 
  Star,
  ShoppingCart,
  ArrowRight,
  Percent,
  Zap,
  Filter,
  Search,
  Grid,
  List,
  Heart,
  TrendingUp,
  Timer,
  Gift,
  Sparkles,
  DollarSign,
  Package,
  Shield,
  Monitor,
  Cpu,
  MemoryStick,
  HardDrive,
  Microchip,
  Calendar
} from "lucide-react";
import { FastLink } from "@/components/navigation/FastNavigation";

// INSTANT DEALS DATA - Zero loading time
const INSTANT_DEALS = [
  {
    id: 1,
    name: "RTX 4090 Gaming GPU",
    originalPrice: 1999,
    salePrice: 1599,
    discount: 20,
    category: "gpu",
    brand: "NVIDIA",
    rating: 5,
    reviews: 1250,
    timeLeft: "2 days",
    featured: true,
    stock: 15,
    savings: 400
  },
  {
    id: 2,
    name: "Intel i9-13900K Processor",
    originalPrice: 699,
    salePrice: 589,
    discount: 16,
    category: "cpu",
    brand: "Intel",
    rating: 5,
    reviews: 892,
    timeLeft: "1 day",
    featured: true,
    stock: 8,
    savings: 110
  },
  {
    id: 3,
    name: "Samsung 980 PRO 2TB NVMe",
    originalPrice: 399,
    salePrice: 299,
    discount: 25,
    category: "storage",
    brand: "Samsung",
    rating: 4,
    reviews: 675,
    timeLeft: "3 days",
    featured: false,
    stock: 25,
    savings: 100
  },
  {
    id: 4,
    name: "Corsair DDR5-5600 32GB Kit",
    originalPrice: 499,
    salePrice: 399,
    discount: 20,
    category: "memory",
    brand: "Corsair",
    rating: 5,
    reviews: 445,
    timeLeft: "5 hours",
    featured: true,
    stock: 12,
    savings: 100
  },
  {
    id: 5,
    name: "ASUS ROG Strix X670-E",
    originalPrice: 599,
    salePrice: 499,
    discount: 17,
    category: "motherboard",
    brand: "ASUS",
    rating: 4,
    reviews: 325,
    timeLeft: "1 day",
    featured: false,
    stock: 6,
    savings: 100
  },
  {
    id: 6,
    name: "Corsair RM850x 80+ Gold PSU",
    originalPrice: 199,
    salePrice: 159,
    discount: 20,
    category: "power-supply",
    brand: "Corsair",
    rating: 5,
    reviews: 758,
    timeLeft: "2 days",
    featured: false,
    stock: 20,
    savings: 40
  },
  {
    id: 7,
    name: "NZXT Kraken X73 360mm AIO",
    originalPrice: 249,
    salePrice: 199,
    discount: 20,
    category: "cooling",
    brand: "NZXT",
    rating: 4,
    reviews: 423,
    timeLeft: "4 hours",
    featured: true,
    stock: 9,
    savings: 50
  },
  {
    id: 8,
    name: "Fractal Design Define 7",
    originalPrice: 199,
    salePrice: 169,
    discount: 15,
    category: "case",
    brand: "Fractal",
    rating: 5,
    reviews: 267,
    timeLeft: "3 days",
    featured: false,
    stock: 14,
    savings: 30
  }
];

const DEAL_CATEGORIES = [
  { name: "All Deals", slug: "", count: INSTANT_DEALS.length },
  { name: "Graphics Cards", slug: "gpu", count: 1 },
  { name: "Processors", slug: "cpu", count: 1 },
  { name: "Storage", slug: "storage", count: 1 },
  { name: "Memory", slug: "memory", count: 1 },
  { name: "Motherboards", slug: "motherboard", count: 1 },
  { name: "Power Supplies", slug: "power-supply", count: 1 },
  { name: "Cooling", slug: "cooling", count: 1 },
  { name: "Cases", slug: "case", count: 1 }
];

// INSTANT Deal Card Component
const InstantDealCard = memo(function InstantDealCard({ deal }) {
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

  const isUrgent = deal.timeLeft.includes('hour') || (deal.timeLeft.includes('day') && parseInt(deal.timeLeft) === 1);

  return (
    <Card className={`group bg-gradient-to-b from-black/95 via-black/85 to-black/95 border-red-400/40 hover:border-red-400/70 transition-all duration-200 cursor-pointer h-full ${deal.featured ? 'ring-2 ring-yellow-400/30' : ''}`}>
      <CardHeader className="pb-2">
        {deal.featured && (
          <div className="absolute -top-3 left-4 z-10">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-400 text-black font-bold text-xs px-3 py-1">
              <Sparkles className="w-3 h-3 mr-1" />
              FEATURED DEAL
            </Badge>
          </div>
        )}
        
        <div className={`aspect-square rounded-lg mb-3 flex items-center justify-center relative bg-gradient-to-br ${categoryColors[deal.category] || 'from-gray-600 to-gray-500'} overflow-hidden`}>
          <Package className="w-16 h-16 text-white/90" />
          
          {/* Discount Badge */}
          <div className="absolute top-2 left-2">
            <Badge className="bg-red-500 text-white border-red-400/30 font-bold">
              -{deal.discount}%
            </Badge>
          </div>
          
          {/* Stock Badge */}
          <div className="absolute top-2 right-2">
            <Badge className={`text-white font-medium ${deal.stock < 10 ? 'bg-red-500/90 border-red-400/30' : 'bg-green-500/90 border-green-400/30'}`}>
              {deal.stock < 10 ? `Only ${deal.stock} left!` : 'In Stock'}
            </Badge>
          </div>
          
          {/* Timer Badge */}
          <div className="absolute bottom-2 left-2">
            <Badge className={`font-bold ${isUrgent ? 'bg-red-500 text-white animate-pulse' : 'bg-orange-500 text-white'}`}>
              <Timer className="w-3 h-3 mr-1" />
              {deal.timeLeft}
            </Badge>
          </div>
          
          {/* Price Badge */}
          <div className="absolute bottom-2 right-2 bg-black/90 rounded px-2 py-1">
            <span className="text-red-400 font-bold text-lg">${deal.salePrice}</span>
          </div>
        </div>
        
        <CardTitle className="text-white group-hover:text-red-400 transition-colors text-lg leading-tight line-clamp-2">
          {deal.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={`w-4 h-4 ${i < deal.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} />
          ))}
          <span className="ml-2 text-gray-400 text-sm">({deal.reviews})</span>
        </div>
        
        <div className="space-y-3 mb-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold text-red-400">${deal.salePrice}</span>
                <span className="text-lg text-gray-500 line-through">${deal.originalPrice}</span>
              </div>
              <div className="text-green-400 font-semibold text-sm">
                You save ${deal.savings}!
              </div>
            </div>
          </div>
          
          <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
            {deal.brand} • {deal.category.replace('-', ' ').toUpperCase()}
          </div>
        </div>
        
        <div className="space-y-2">
          <Button className="w-full bg-red-500 hover:bg-red-400 text-white font-semibold transition-colors duration-150" size="sm">
            <ShoppingCart className="w-4 h-4 mr-2" />
            Add to Cart
          </Button>
          
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800">
              <Heart className="w-4 h-4 mr-1" />
              Save
            </Button>
            <FastLink href={`/products/${deal.id}`}>
              <Button variant="outline" size="sm" className="flex-1 border-gray-600 text-gray-400 hover:text-white hover:bg-gray-800">
                View Details
              </Button>
            </FastLink>
          </div>
        </div>
      </CardContent>
    </Card>
  );
});

export default function InstantDealsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("discount"); // discount, price, time
  const [viewMode, setViewMode] = useState("grid");

  // INSTANT filtering and sorting - zero delay
  const filteredAndSortedDeals = useMemo(() => {
    let deals = [...INSTANT_DEALS];
    
    // Filter by category
    if (selectedCategory) {
      deals = deals.filter(deal => deal.category === selectedCategory);
    }
    
    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      deals = deals.filter(deal =>
        deal.name.toLowerCase().includes(query) ||
        deal.brand.toLowerCase().includes(query) ||
        deal.category.toLowerCase().includes(query)
      );
    }
    
    // Sort
    deals.sort((a, b) => {
      switch (sortBy) {
        case "discount":
          return b.discount - a.discount;
        case "price":
          return a.salePrice - b.salePrice;
        case "time":
          // Simple time sorting (urgent first)
          const aUrgent = a.timeLeft.includes('hour') || (a.timeLeft.includes('day') && parseInt(a.timeLeft) === 1);
          const bUrgent = b.timeLeft.includes('hour') || (b.timeLeft.includes('day') && parseInt(b.timeLeft) === 1);
          if (aUrgent && !bUrgent) return -1;
          if (!aUrgent && bUrgent) return 1;
          return 0;
        default:
          return 0;
      }
    });
    
    return deals;
  }, [selectedCategory, searchQuery, sortBy]);

  const featuredDeals = INSTANT_DEALS.filter(deal => deal.featured);
  const totalSavings = filteredAndSortedDeals.reduce((sum, deal) => sum + deal.savings, 0);

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Instant Status Indicator */}
      <div className="fixed top-4 right-4 z-50 bg-green-500/20 text-green-400 border border-green-400/30 px-3 py-2 rounded-lg text-sm font-medium">
        <Zap className="w-4 h-4 inline mr-2" />
        Instant Deals Loading
      </div>
      
      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <Tag className="w-12 h-12 text-red-400" />
              <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-orange-400 to-yellow-400 bg-clip-text text-transparent">
                Hot Deals
              </h1>
            </div>
            <p className="text-xl text-gray-300 mb-6">
              Limited time offers on premium PC components
            </p>
            <div className="flex items-center justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-gray-400">Total Savings Available:</span>
                <span className="text-green-400 font-bold">${totalSavings.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2">
                <Package className="w-5 h-5 text-blue-400" />
                <span className="text-gray-400">Active Deals:</span>
                <span className="text-blue-400 font-bold">{INSTANT_DEALS.length}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Featured Deals Section */}
        {featuredDeals.length > 0 && (
          <section className="mb-12">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-yellow-400" />
              <h2 className="text-2xl font-bold text-white">Featured Deals</h2>
              <Badge className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30">
                Limited Time
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredDeals.map((deal) => (
                <InstantDealCard key={`featured-${deal.id}`} deal={deal} />
              ))}
            </div>
          </section>
        )}

        {/* Filters and Controls */}
        <div className="bg-gradient-to-r from-black/60 via-black/40 to-black/60 border border-red-400/30 rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-red-400/70 w-4 h-4" />
              <Input
                placeholder="Search deals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-black/60 border-red-400/30 text-white placeholder-red-400/50 focus:border-red-400"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-black/60 border border-red-400/30 text-white rounded-md px-3 py-2 focus:border-red-400 focus:outline-none"
            >
              {DEAL_CATEGORIES.map((category) => (
                <option key={category.slug} value={category.slug} className="bg-black">
                  {category.name} ({category.count})
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-black/60 border border-red-400/30 text-white rounded-md px-3 py-2 focus:border-red-400 focus:outline-none"
            >
              <option value="discount" className="bg-black">Highest Discount</option>
              <option value="price" className="bg-black">Lowest Price</option>
              <option value="time" className="bg-black">Ending Soon</option>
            </select>

            {/* View Mode */}
            <div className="flex gap-2">
              <Button 
                variant={viewMode === "grid" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("grid")}
                className="flex-1"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button 
                variant={viewMode === "list" ? "default" : "outline"} 
                size="sm" 
                onClick={() => setViewMode("list")}
                className="flex-1"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-gray-400">
              Showing {filteredAndSortedDeals.length} deals
              {selectedCategory && ` in ${DEAL_CATEGORIES.find(c => c.slug === selectedCategory)?.name}`}
            </p>
            {filteredAndSortedDeals.length > 0 && (
              <p className="text-green-400 text-sm font-medium">
                Total savings: ${filteredAndSortedDeals.reduce((sum, deal) => sum + deal.savings, 0).toLocaleString()}
              </p>
            )}
          </div>
          <Badge className="bg-green-500/20 text-green-400 border-green-400/30">
            ⚡ Instant Results
          </Badge>
        </div>

        {/* Deals Grid */}
        {filteredAndSortedDeals.length === 0 ? (
          <div className="text-center py-12">
            <Tag className="w-16 h-16 mx-auto mb-4 text-gray-600" />
            <h3 className="text-xl font-semibold text-white mb-2">No deals found</h3>
            <p className="text-gray-400 mb-4">Try different filters or check back later</p>
            <Button 
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("");
              }}
              className="bg-red-400 text-black"
            >
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filteredAndSortedDeals.map((deal) => (
              <InstantDealCard key={deal.id} deal={deal} />
            ))}
          </div>
        )}
      </main>
      
      <Footer />
    </div>
  );
}
