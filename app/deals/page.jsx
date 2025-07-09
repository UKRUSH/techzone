"use client";

import { useState, useEffect } from "react";
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
  Heart,
  TrendingUp,
  Timer,
  Gift,
  Sparkles,
  DollarSign,
  Package,
  Shield,
  Loader2,
  XCircle
} from "lucide-react";
import { FastLink } from "@/components/navigation/FastNavigation";

export default function DealsPage() {
  const [deals, setDeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");

  useEffect(() => {
    fetchDeals();
  }, []);

  const fetchDeals = async () => {
    try {
      const response = await fetch('/api/products?onSale=true', {
        cache: 'no-store'
      });
      
      if (response.ok) {
        const result = await response.json();
        if (result.success) {
          setDeals(result.data || []);
        } else {
          setError('Failed to load deals');
        }
      } else {
        setError('Server error occurred');
      }
    } catch (error) {
      console.error('Deals fetch failed:', error);
      setError('Failed to connect to server');
    } finally {
      setLoading(false);
    }
  };

  // Filter deals based on search and category
  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === "all" || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories for filter
  const categories = ["all", ...new Set(deals.map(deal => 
    typeof deal.category === 'object' ? deal.category?.name || deal.category?.slug : deal.category
  ).filter(Boolean))];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 pt-32">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto mb-4" />
            <p className="text-white/70">Loading deals...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 pt-32">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <XCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
            <h2 className="text-red-400 text-lg font-semibold mb-2">Error Loading Deals</h2>
            <p className="text-white/70 mb-4">{error}</p>
            <Button
              onClick={fetchDeals}
              className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium"
            >
              Try Again
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-950 to-zinc-900 pt-32">
      
      {/* Hero Section */}
      <section className="pt-8 pb-16 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center bg-yellow-500/10 px-4 py-2 rounded-full mb-6 border border-yellow-500/30">
              <Percent className="w-5 h-5 text-yellow-400 mr-2" />
              <span className="text-yellow-400 font-semibold">Special Offers</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-6">
              Amazing Deals
            </h1>
            
            <p className="text-xl text-white/80 max-w-2xl mx-auto leading-relaxed">
              Discover incredible discounts on top-quality tech products. Limited time offers you don't want to miss!
            </p>
          </motion.div>

          {/* Search and Filter */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-col md:flex-row gap-4 mb-8"
          >
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-white/50" />
              <Input
                placeholder="Search deals..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-black/50 border-yellow-500/30 text-white placeholder:text-white/50"
              />
            </div>
            
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 bg-black/50 border border-yellow-500/30 rounded-md text-white"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === "all" ? "All Categories" : 
                    typeof category === 'string' ? 
                      category.charAt(0).toUpperCase() + category.slice(1) :
                      (category?.name || category?.slug || 'Unknown Category')
                  }
                </option>
              ))}
            </select>
          </motion.div>

          {/* Deals Grid */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          >
            {filteredDeals.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Package className="h-16 w-16 text-white/30 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white/70 mb-2">No deals found</h3>
                <p className="text-white/50">Try adjusting your search or filters</p>
              </div>
            ) : (
              filteredDeals.map((deal, index) => (
                <motion.div
                  key={deal.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.05 }}
                  whileHover={{ y: -8, scale: 1.02 }}
                  className="h-full"
                >
                  <Card className="group h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-yellow-500/30 hover:border-yellow-500/60 overflow-hidden relative bg-gradient-to-b from-black to-zinc-950">
                    {/* Sale Badge */}
                    {deal.onSale && (
                      <div className="absolute top-4 left-4 z-10">
                        <Badge className="bg-red-500 text-white font-bold px-2 py-1">
                          SALE
                        </Badge>
                      </div>
                    )}

                    {/* Product Image */}
                    <div className="relative overflow-hidden">
                      {deal.image ? (
                        <img
                          src={deal.image}
                          alt={deal.name}
                          className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-48 bg-gradient-to-br from-yellow-500/20 to-black flex items-center justify-center">
                          <Package className="h-16 w-16 text-yellow-400/50" />
                        </div>
                      )}
                    </div>

                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-yellow-400 transition-colors">
                        {deal.name}
                      </h3>
                      
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <span className="text-2xl font-bold text-yellow-400">
                            Rs. {deal.price?.toLocaleString()}
                          </span>
                          {deal.originalPrice && deal.originalPrice > deal.price && (
                            <div className="flex items-center gap-2">
                              <span className="text-sm text-white/60 line-through">
                                Rs. {deal.originalPrice.toLocaleString()}
                              </span>
                              <Badge variant="destructive" className="text-xs">
                                {Math.round(((deal.originalPrice - deal.price) / deal.originalPrice) * 100)}% OFF
                              </Badge>
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="text-sm text-white/70">
                            {deal.rating || 4.5} ({deal.reviews || 0} reviews)
                          </span>
                        </div>
                        
                        <FastLink href={`/products/${deal.id}`}>
                          <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black font-medium">
                            <ShoppingCart className="h-4 w-4 mr-1" />
                            Buy Now
                          </Button>
                        </FastLink>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
