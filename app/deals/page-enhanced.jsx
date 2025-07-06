"use client";

import { useQuery } from "@tanstack/react-query";
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
  Loader2,
  Percent,
  Zap,
  Filter,
  Search,
  Grid,
  List,
  Heart,
  Eye,
  TrendingUp,
  Timer,
  Gift,
  Sparkles,
  DollarSign,
  Package,
  Users,
  ArrowUpRight
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

// Enhanced mock deals data
const mockDeals = [
  {
    id: "deal-1",
    title: "Intel Core i7-13700K",
    description: "High-performance processor for gaming and productivity",
    originalPrice: 449.99,
    discountedPrice: 409.99,
    discountPercentage: 9,
    image: "/api/placeholder/400/400",
    category: "CPU",
    brand: "Intel",
    rating: 4.8,
    reviews: 256,
    stock: 45,
    expiresAt: "2025-07-10T23:59:59.000Z",
    featured: true,
    tags: ["Hot Deal", "Limited Time"],
    savings: 40.00,
    views: 1240,
    sold: 55
  },
  {
    id: "deal-2",
    title: "NVIDIA GeForce RTX 4070",
    description: "Next-gen graphics card for 1440p gaming",
    originalPrice: 649.99,
    discountedPrice: 599.99,
    discountPercentage: 8,
    image: "/api/placeholder/400/400",
    category: "Graphics Cards",
    brand: "NVIDIA",
    rating: 4.7,
    reviews: 189,
    stock: 23,
    expiresAt: "2025-07-08T23:59:59.000Z",
    featured: true,
    tags: ["Flash Sale", "Gaming"],
    savings: 50.00,
    views: 980,
    sold: 27
  },
  {
    id: "deal-3",
    title: "Corsair Vengeance RGB Pro 32GB",
    description: "High-speed DDR4 RAM with RGB lighting",
    originalPrice: 159.99,
    discountedPrice: 129.99,
    discountPercentage: 19,
    image: "/api/placeholder/400/400",
    category: "Memory",
    brand: "Corsair",
    rating: 4.6,
    reviews: 432,
    stock: 67,
    expiresAt: "2025-07-12T23:59:59.000Z",
    featured: false,
    tags: ["RGB", "Performance"],
    savings: 30.00,
    views: 765,
    sold: 33
  },
  {
    id: "deal-4",
    title: "Samsung 980 PRO 1TB SSD",
    description: "High-speed NVMe SSD for gaming and professional use",
    originalPrice: 119.99,
    discountedPrice: 89.99,
    discountPercentage: 25,
    image: "/api/placeholder/400/400",
    category: "Storage",
    brand: "Samsung",
    rating: 4.9,
    reviews: 672,
    stock: 89,
    expiresAt: "2025-07-15T23:59:59.000Z",
    featured: false,
    tags: ["Best Seller", "Fast"],
    savings: 30.00,
    views: 1567,
    sold: 111
  },
  {
    id: "deal-5",
    title: "ASUS ROG Strix Z690-E",
    description: "Premium motherboard with Wi-Fi 6E and RGB",
    originalPrice: 379.99,
    discountedPrice: 329.99,
    discountPercentage: 13,
    image: "/api/placeholder/400/400",
    category: "Motherboards",
    brand: "ASUS",
    rating: 4.7,
    reviews: 198,
    stock: 34,
    expiresAt: "2025-07-09T23:59:59.000Z",
    featured: true,
    tags: ["Premium", "WiFi 6E"],
    savings: 50.00,
    views: 654,
    sold: 16
  },
  {
    id: "deal-6",
    title: "Corsair RM850x 850W PSU",
    description: "Fully modular 80+ Gold certified power supply",
    originalPrice: 149.99,
    discountedPrice: 129.99,
    discountPercentage: 13,
    image: "/api/placeholder/400/400",
    category: "Power Supplies",
    brand: "Corsair",
    rating: 4.8,
    reviews: 345,
    stock: 56,
    expiresAt: "2025-07-11T23:59:59.000Z",
    featured: false,
    tags: ["Modular", "80+ Gold"],
    savings: 20.00,
    views: 432,
    sold: 44
  }
];

// Animation variants
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

const scaleIn = {
  initial: { scale: 0.9, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 0.9, opacity: 0 }
};

export default function DealsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeView, setActiveView] = useState("grid");
  const [activeFilter, setActiveFilter] = useState("all");
  const [sortBy, setSortBy] = useState("discount");

  // Fetch deals data
  const { data: deals = mockDeals, isLoading, error } = useQuery({
    queryKey: ["deals"],
    queryFn: async () => {
      try {
        const response = await fetch("/api/deals");
        if (!response.ok) throw new Error("Failed to fetch deals");
        const data = await response.json();
        return data.deals || mockDeals;
      } catch (error) {
        console.log("Using mock data:", error.message);
        return mockDeals;
      }
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Filter and sort deals
  const filteredDeals = deals
    .filter(deal => {
      const matchesSearch = deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           deal.brand.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = activeFilter === "all" || 
                           (activeFilter === "featured" && deal.featured) ||
                           (activeFilter === "high-discount" && deal.discountPercentage >= 15) ||
                           (activeFilter === "ending-soon" && getTimeRemainingHours(deal.expiresAt) <= 24);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "discount":
          return b.discountPercentage - a.discountPercentage;
        case "price-low":
          return a.discountedPrice - b.discountedPrice;
        case "price-high":
          return b.discountedPrice - a.discountedPrice;
        case "rating":
          return b.rating - a.rating;
        case "ending-soon":
          return new Date(a.expiresAt) - new Date(b.expiresAt);
        default:
          return 0;
      }
    });

  // Stats calculation
  const stats = [
    {
      title: "Active Deals",
      value: deals.length.toString(),
      icon: Tag,
      bg: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "Total Savings",
      value: `$${deals.reduce((sum, deal) => sum + deal.savings, 0).toFixed(0)}`,
      icon: DollarSign,
      bg: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400"
    },
    {
      title: "Items on Sale",
      value: deals.reduce((sum, deal) => sum + deal.stock, 0).toString(),
      icon: Package,
      bg: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Happy Customers",
      value: deals.reduce((sum, deal) => sum + deal.sold, 0).toString(),
      icon: Users,
      bg: "from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-400"
    }
  ];

  const getTimeRemaining = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const difference = expiry - now;

    if (difference <= 0) return "Expired";

    const days = Math.floor(difference / (1000 * 60 * 60 * 24));
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

    if (days > 0) return `${days}d ${hours}h`;
    if (hours > 0) return `${hours}h ${minutes}m`;
    return `${minutes}m`;
  };

  const getTimeRemainingHours = (expiresAt) => {
    const now = new Date();
    const expiry = new Date(expiresAt);
    const difference = expiry - now;
    return Math.floor(difference / (1000 * 60 * 60));
  };

  const getUrgencyColor = (expiresAt) => {
    const hours = getTimeRemainingHours(expiresAt);
    if (hours <= 6) return "text-red-400";
    if (hours <= 24) return "text-orange-400";
    return "text-green-400";
  };

  if (isLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="flex items-center gap-2 text-yellow-500">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="text-lg">Loading amazing deals...</span>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-400 mb-2">Failed to load deals</h2>
            <p className="text-gray-400">Please try again later</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen bg-black relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-yellow-500/5 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-40 w-80 h-80 rounded-full bg-red-500/5 blur-3xl animate-pulse-slower"></div>
        <div className="absolute bottom-20 right-20 w-60 h-60 rounded-full bg-green-500/5 blur-3xl animate-pulse-slow"></div>

        <div className="container mx-auto px-4 py-8">
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-yellow-500/20">
                <Percent className="h-8 w-8 text-yellow-400" />
              </div>
              <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-500 to-orange-600">
                Flash Deals
              </h1>
              <div className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-yellow-500/20">
                <Zap className="h-8 w-8 text-red-400" />
              </div>
            </div>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Discover incredible savings on premium tech products. Limited time offers with up to 50% off!
            </p>
            <div className="flex items-center justify-center gap-2 mt-4">
              <Timer className="h-5 w-5 text-red-400" />
              <span className="text-red-400 font-semibold">Limited Time Only!</span>
            </div>
          </motion.div>

          {/* Stats Cards */}
          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
            variants={staggerContainer}
            initial="initial"
            animate="animate"
          >
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={fadeIn}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800 hover:border-yellow-500/30 hover:shadow-lg transition-all duration-300">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-gray-300">
                      {stat.title}
                    </CardTitle>
                    <div className={`p-2 rounded-full bg-gradient-to-br ${stat.bg}`}>
                      <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-gray-400 flex items-center mt-1">
                      <TrendingUp className="h-3 w-3 mr-1 text-green-400" />
                      Live updates
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>

          {/* Search and Filters */}
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search deals..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-yellow-500"
                    />
                  </div>
                  
                  {/* Filters */}
                  <div className="flex gap-2 flex-wrap">
                    <select
                      value={activeFilter}
                      onChange={(e) => setActiveFilter(e.target.value)}
                      className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-md focus:border-yellow-500"
                    >
                      <option value="all">All Deals</option>
                      <option value="featured">Featured</option>
                      <option value="high-discount">High Discount</option>
                      <option value="ending-soon">Ending Soon</option>
                    </select>
                    
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 bg-zinc-800 border border-zinc-700 text-white rounded-md focus:border-yellow-500"
                    >
                      <option value="discount">Highest Discount</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="rating">Highest Rated</option>
                      <option value="ending-soon">Ending Soon</option>
                    </select>
                  </div>
                  
                  {/* View Toggle */}
                  <div className="flex gap-2">
                    <Button
                      variant={activeView === "grid" ? "default" : "outline"}
                      onClick={() => setActiveView("grid")}
                      className={activeView === "grid" ? "bg-yellow-500 text-black" : "border-zinc-700 text-gray-300 hover:bg-zinc-800"}
                    >
                      <Grid className="h-4 w-4" />
                    </Button>
                    <Button
                      variant={activeView === "list" ? "default" : "outline"}
                      onClick={() => setActiveView("list")}
                      className={activeView === "list" ? "bg-yellow-500 text-black" : "border-zinc-700 text-gray-300 hover:bg-zinc-800"}
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Deals Grid/List */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-gradient-to-br from-zinc-900 to-black border-zinc-800">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Gift className="h-6 w-6 text-yellow-500" />
                  Hot Deals ({filteredDeals.length})
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Limited time offers - grab them before they're gone!
                </CardDescription>
              </CardHeader>
              <CardContent>
                {activeView === "grid" ? (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                    variants={staggerContainer}
                    initial="initial"
                    animate="animate"
                  >
                    {filteredDeals.map((deal, index) => (
                      <motion.div
                        key={deal.id}
                        variants={scaleIn}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                        className="h-full"
                      >
                        <Card className="h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 border border-zinc-700/50 hover:border-red-500/50 overflow-hidden group relative">
                          {/* Animated gradient overlay */}
                          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 via-transparent to-yellow-600/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          {/* Featured badge */}
                          {deal.featured && (
                            <div className="absolute top-3 left-3 z-10">
                              <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-semibold">
                                <Sparkles className="h-3 w-3 mr-1" />
                                Featured
                              </Badge>
                            </div>
                          )}
                          
                          {/* Discount badge */}
                          <div className="absolute top-3 right-3 z-10">
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold text-lg px-3 py-1">
                              -{deal.discountPercentage}%
                            </Badge>
                          </div>
                          
                          {/* Image */}
                          <div className="relative h-48 bg-zinc-800/50 group-hover:bg-zinc-700/50 transition-colors duration-300">
                            <Image
                              src={deal.image}
                              alt={deal.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                          </div>
                          
                          <CardHeader className="pb-2 relative z-10">
                            <div className="flex items-center justify-between mb-2">
                              <Badge className="bg-yellow-500/10 text-yellow-400 border-yellow-500/20">
                                {deal.category.toUpperCase()}
                              </Badge>
                              <Badge className="bg-blue-500/10 text-blue-400 border-blue-500/20">
                                {deal.brand.toUpperCase()}
                              </Badge>
                            </div>
                            <CardTitle className="text-white group-hover:text-yellow-400 transition-colors duration-300 text-lg font-bold">
                              {deal.title}
                            </CardTitle>
                            <CardDescription className="text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                              {deal.description}
                            </CardDescription>
                          </CardHeader>
                          
                          <CardContent className="pb-6 relative z-10">
                            {/* Pricing */}
                            <div className="mb-4">
                              <div className="flex items-center gap-3 mb-2">
                                <span className="text-2xl font-bold text-white">
                                  ${deal.discountedPrice}
                                </span>
                                <span className="text-lg text-gray-400 line-through">
                                  ${deal.originalPrice}
                                </span>
                              </div>
                              <div className="text-green-400 font-semibold">
                                Save ${deal.savings.toFixed(2)}
                              </div>
                            </div>
                            
                            {/* Rating and Reviews */}
                            <div className="flex items-center gap-2 mb-4">
                              <div className="flex items-center">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-4 w-4 ${
                                      i < Math.floor(deal.rating)
                                        ? "text-yellow-400 fill-current"
                                        : "text-gray-600"
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="text-white font-medium">{deal.rating}</span>
                              <span className="text-gray-400">({deal.reviews} reviews)</span>
                            </div>
                            
                            {/* Stats */}
                            <div className="grid grid-cols-2 gap-3 mb-4">
                              <div className="p-2 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <Eye className="h-3 w-3" />
                                  Views
                                </div>
                                <div className="text-white font-semibold">{deal.views}</div>
                              </div>
                              <div className="p-2 bg-zinc-800/30 rounded-lg border border-zinc-700/30">
                                <div className="flex items-center gap-1 text-xs text-gray-400">
                                  <ShoppingCart className="h-3 w-3" />
                                  Sold
                                </div>
                                <div className="text-white font-semibold">{deal.sold}</div>
                              </div>
                            </div>
                            
                            {/* Time and Stock */}
                            <div className="flex items-center justify-between text-sm mb-4">
                              <div className={`flex items-center gap-1 ${getUrgencyColor(deal.expiresAt)}`}>
                                <Clock className="h-3 w-3" />
                                {getTimeRemaining(deal.expiresAt)}
                              </div>
                              <div className="text-gray-400">{deal.stock} left</div>
                            </div>
                            
                            {/* Tags */}
                            <div className="flex gap-1 mb-4 flex-wrap">
                              {deal.tags.map((tag, tagIndex) => (
                                <Badge key={tagIndex} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            
                            {/* Action Buttons */}
                            <div className="flex gap-2">
                              <Link href={`/products/${deal.id}`} className="flex-1">
                                <Button className="w-full bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-medium shadow-lg">
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Add to Cart
                                </Button>
                              </Link>
                              <Button variant="outline" size="icon" className="border-zinc-700 text-gray-300 hover:bg-zinc-800">
                                <Heart className="h-4 w-4" />
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {filteredDeals.map((deal, index) => (
                      <motion.div
                        key={deal.id}
                        variants={fadeIn}
                        transition={{ duration: 0.3, delay: index * 0.02 }}
                        whileHover={{ scale: 1.01 }}
                        className="group"
                      >
                        <Card className="bg-gradient-to-r from-zinc-900 to-zinc-800 border-zinc-700 hover:border-red-500/50 transition-all duration-300">
                          <CardContent className="p-6">
                            <div className="flex gap-6">
                              {/* Image */}
                              <div className="relative w-32 h-32 bg-zinc-800 rounded-lg overflow-hidden flex-shrink-0">
                                <Image
                                  src={deal.image}
                                  alt={deal.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                                />
                                <div className="absolute top-2 right-2">
                                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                                    -{deal.discountPercentage}%
                                  </Badge>
                                </div>
                              </div>
                              
                              {/* Content */}
                              <div className="flex-1">
                                <div className="flex items-start justify-between mb-2">
                                  <div>
                                    <h3 className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors">
                                      {deal.title}
                                    </h3>
                                    <p className="text-gray-400 mt-1">{deal.description}</p>
                                  </div>
                                  <div className="text-right">
                                    <div className="text-2xl font-bold text-white">${deal.discountedPrice}</div>
                                    <div className="text-gray-400 line-through">${deal.originalPrice}</div>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-4 mb-3">
                                  <Badge className="bg-yellow-500/10 text-yellow-400">
                                    {deal.category.toUpperCase()}
                                  </Badge>
                                  <Badge className="bg-blue-500/10 text-blue-400">
                                    {deal.brand.toUpperCase()}
                                  </Badge>
                                  <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                                    <span className="text-white">{deal.rating}</span>
                                    <span className="text-gray-400">({deal.reviews})</span>
                                  </div>
                                </div>
                                
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-4 text-sm">
                                    <div className={`flex items-center gap-1 ${getUrgencyColor(deal.expiresAt)}`}>
                                      <Clock className="h-3 w-3" />
                                      {getTimeRemaining(deal.expiresAt)}
                                    </div>
                                    <div className="text-gray-400">{deal.stock} left</div>
                                    <div className="text-green-400">Save ${deal.savings}</div>
                                  </div>
                                  
                                  <div className="flex gap-2">
                                    <Button variant="outline" size="icon" className="border-zinc-700">
                                      <Heart className="h-4 w-4" />
                                    </Button>
                                    <Link href={`/products/${deal.id}`}>
                                      <Button className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600">
                                        <ShoppingCart className="h-4 w-4 mr-2" />
                                        Add to Cart
                                      </Button>
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Call to Action */}
          <motion.div 
            className="mt-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <Card className="bg-gradient-to-r from-red-500/10 via-yellow-500/10 to-orange-500/10 border-red-500/20 hover:border-red-500/40 transition-colors duration-300">
              <CardContent className="py-12 text-center">
                <div className="flex justify-center items-center gap-3 mb-6">
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-yellow-400">
                    Don't Miss Out on Future Deals!
                  </h3>
                  <Sparkles className="h-8 w-8 text-yellow-400" />
                </div>
                <p className="text-gray-300 mb-8 max-w-2xl mx-auto text-lg">
                  Subscribe to our newsletter to get notified about flash sales, 
                  exclusive discounts, and new product launches before anyone else.
                </p>
                <div className="flex gap-4 justify-center items-center max-w-md mx-auto">
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    className="bg-zinc-800 border-zinc-700 text-white placeholder-gray-400 focus:border-yellow-500"
                  />
                  <Button className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-medium px-8">
                    Subscribe
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
