"use client";

import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  Tag, 
  Clock, 
  Star,
  ShoppingCart,
  ArrowRight,
  Loader2,
  Percent,
  Zap
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// Mock deals data for fast loading
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
    tags: ["Hot Deal", "Limited Time"]
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
    tags: ["Flash Sale", "Best Seller"]
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
    tags: ["Great Value"]
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
    stock: 134,
    expiresAt: "2025-07-15T23:59:59.000Z",
    featured: false,
    tags: ["Super Saver"]
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
    stock: 28,
    expiresAt: "2025-07-09T23:59:59.000Z",
    featured: false,
    tags: ["Premium"]
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
    stock: 89,
    expiresAt: "2025-07-14T23:59:59.000Z",
    featured: false,
    tags: ["Reliable"]
  }
];

// Fetch function for React Query
const fetchDeals = async () => {
  try {
    const response = await fetch('/api/deals');
    if (!response.ok) {
      throw new Error('Failed to fetch deals');
    }
    return response.json();
  } catch (error) {
    // Return mock data if API fails
    return mockDeals;
  }
};

// Helper function to calculate time remaining
const getTimeRemaining = (expiresAt) => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry - now;
  
  if (diff <= 0) return "Expired";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  if (days > 0) return `${days}d ${hours}h left`;
  return `${hours}h left`;
};

export default function DealsPage() {
  // Use React Query for optimized data fetching
  const { data: deals = [], isLoading, error } = useQuery({
    queryKey: ['deals'],
    queryFn: fetchDeals,
    // Cache for 2 minutes (deals change more frequently)
    staleTime: 2 * 60 * 1000,
  });

  // Separate featured and regular deals
  const featuredDeals = deals.filter(deal => deal.featured);
  const regularDeals = deals.filter(deal => !deal.featured);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-4xl font-bold text-primary mb-4 flex items-center justify-center gap-3">
                <Tag className="h-10 w-10 text-yellow-500" />
                Special Deals & Offers
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Discover amazing discounts on top PC components. Limited time offers - grab them before they're gone!
              </p>
            </motion.div>
          </div>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading deals...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">Failed to load deals</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <>
              {/* Featured Deals */}
              {featuredDeals.length > 0 && (
                <div className="mb-16">
                  <div className="flex items-center gap-3 mb-8">
                    <Zap className="h-6 w-6 text-yellow-500" />
                    <h2 className="text-2xl font-bold text-primary">Featured Deals</h2>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {featuredDeals.map((deal, index) => (
                      <motion.div
                        key={deal.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: index * 0.1 }}
                      >
                        <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-yellow-500/50 bg-gradient-to-br from-yellow-50/5 to-orange-50/5">
                          <CardHeader className="pb-4">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-2">
                                  {deal.tags.map((tag, i) => (
                                    <Badge key={i} variant="secondary" className="bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                                      {tag}
                                    </Badge>
                                  ))}
                                </div>
                                <CardTitle className="text-xl text-primary group-hover:text-primary/80 transition-colors">
                                  {deal.title}
                                </CardTitle>
                                <CardDescription className="text-sm text-muted-foreground mt-2">
                                  {deal.description}
                                </CardDescription>
                              </div>
                              <div className="relative w-24 h-24 ml-4">
                                <Image
                                  src={deal.image}
                                  alt={deal.title}
                                  fill
                                  className="object-cover rounded-md"
                                />
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="text-2xl font-bold text-primary">${deal.discountedPrice}</span>
                                  <span className="text-lg text-muted-foreground line-through">${deal.originalPrice}</span>
                                  <Badge variant="destructive" className="bg-red-500">
                                    -{deal.discountPercentage}%
                                  </Badge>
                                </div>
                                <div className="text-right">
                                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    {deal.rating} ({deal.reviews})
                                  </div>
                                </div>
                              </div>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                  <Clock className="h-4 w-4" />
                                  {getTimeRemaining(deal.expiresAt)}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  {deal.stock} in stock
                                </div>
                              </div>
                              
                              <Link href={`/products/${deal.id}`}>
                                <Button className="w-full bg-yellow-600 hover:bg-yellow-700">
                                  <ShoppingCart className="h-4 w-4 mr-2" />
                                  Add to Cart
                                </Button>
                              </Link>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}

              {/* Regular Deals */}
              <div>
                <div className="flex items-center gap-3 mb-8">
                  <Percent className="h-6 w-6 text-primary" />
                  <h2 className="text-2xl font-bold text-primary">All Deals</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {regularDeals.map((deal, index) => (
                    <motion.div
                      key={deal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                    >
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/50 bg-card">
                        <CardHeader className="pb-4">
                          <div className="relative w-full h-48 mb-4">
                            <Image
                              src={deal.image}
                              alt={deal.title}
                              fill
                              className="object-cover rounded-md"
                            />
                            <div className="absolute top-2 right-2">
                              <Badge variant="destructive" className="bg-red-500">
                                -{deal.discountPercentage}%
                              </Badge>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              {deal.tags.map((tag, i) => (
                                <Badge key={i} variant="outline" className="text-xs">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                            <CardTitle className="text-lg text-primary group-hover:text-primary/80 transition-colors line-clamp-2">
                              {deal.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-muted-foreground line-clamp-2">
                              {deal.description}
                            </CardDescription>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-primary">${deal.discountedPrice}</span>
                                <span className="text-sm text-muted-foreground line-through">${deal.originalPrice}</span>
                              </div>
                              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                {deal.rating}
                              </div>
                            </div>
                            
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {getTimeRemaining(deal.expiresAt)}
                              </div>
                              <div>{deal.stock} left</div>
                            </div>
                            
                            <Link href={`/products/${deal.id}`}>
                              <Button className="w-full" variant="outline">
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Add to Cart
                              </Button>
                            </Link>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-gradient-to-r from-primary/10 to-yellow-500/10 border-primary/20">
              <CardContent className="py-12">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Don't Miss Out on Future Deals!
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Subscribe to our newsletter to get notified about flash sales, 
                  exclusive discounts, and new product launches.
                </p>
                <div className="flex gap-4 justify-center items-center max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-md border border-border bg-background text-foreground"
                  />
                  <Button className="bg-primary hover:bg-primary/90">
                    Subscribe
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
