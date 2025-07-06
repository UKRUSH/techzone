"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Monitor, 
  HardDrive, 
  MemoryStick, 
  ArrowRight,
  Star,
  Zap,
  Shield,
  Truck,
  Package,
  Trophy,
  ShoppingCart
} from "lucide-react";
import { memo, useState, useEffect } from "react";
import { FastLink } from "@/components/navigation/FastNavigation";

// Memoized components for database rendering
const MemoizedCard = memo(function MemoizedCard({ children, ...props }) {
  return <Card {...props}>{children}</Card>;
});

const MemoizedMotion = memo(function MemoizedMotion({ children, ...props }) {
  return <motion.div {...props}>{children}</motion.div>;
});

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch featured products from database
  useEffect(() => {
    fetchFeaturedProducts();
  }, []);

  const fetchFeaturedProducts = async () => {
    try {
      const response = await fetch('/api/products?limit=6');
      if (response.ok) {
        const result = await response.json();
        const productsData = result.data || [];
        // Convert database format to component format
        const formattedProducts = productsData.map(product => ({
          id: product.id,
          name: product.name,
          price: product.variants?.[0]?.price || 0,
          category: product.category?.name || 'Other',
          brand: product.brand?.name || 'Unknown',
          rating: 5
        }));
        setFeaturedProducts(formattedProducts);
      }
    } catch (error) {
      console.error('Error fetching featured products:', error);
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: "Products", value: "5000+", icon: Package },
    { label: "Happy Customers", value: "50K+", icon: Star },
    { label: "Years Experience", value: "10+", icon: Trophy },
    { label: "Fast Shipping", value: "24H", icon: Truck },
  ];

  const featuredCategories = [
    {
      title: "Gaming CPUs",
      description: "High-performance processors for ultimate gaming",
      icon: Cpu,
      href: "/products?category=cpu",
      gradient: "from-blue-600 to-purple-600"
    },
    {
      title: "Graphics Cards",
      description: "Latest GPUs for 4K gaming and content creation",
      icon: Monitor,
      href: "/products?category=gpu",
      gradient: "from-green-600 to-blue-600"
    },
    {
      title: "Storage Solutions",
      description: "Fast SSDs and reliable HDDs for all your needs",
      icon: HardDrive,
      href: "/products?category=storage",
      gradient: "from-yellow-600 to-red-600"
    },
    {
      title: "Memory & RAM",
      description: "High-speed memory modules and kits",
      icon: MemoryStick,
      href: "/products?category=memory",
      gradient: "from-purple-600 to-pink-600"
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Get your components delivered within 24 hours"
    },
    {
      icon: Shield,
      title: "Quality Guarantee",
      description: "All products come with manufacturer warranty"
    },
    {
      icon: Cpu,
      title: "Expert Support",
      description: "Get help from our PC building experts"
    }
  ];

  const categoryColors = {
    gpu: 'from-blue-600 to-purple-600',
    cpu: 'from-red-600 to-orange-600',
    storage: 'from-green-600 to-cyan-600',
    memory: 'from-purple-600 to-pink-600',
    motherboard: 'from-yellow-600 to-red-600',
    'power-supply': 'from-gray-600 to-gray-500'
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      
      {/* Instant Loading Indicator */}
      <div className="fixed top-4 right-4 z-50 bg-green-500/20 text-green-400 border border-green-400/30 px-3 py-2 rounded-lg text-sm font-medium">
        <Zap className="w-4 h-4 inline mr-2" />
        Instant Loading
      </div>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Animated background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-black via-black to-yellow-900/20" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,239,0,0.1),transparent_50%)]" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <MemoizedMotion
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-yellow-200 to-yellow-400 bg-clip-text text-transparent">
                Build Your Dream PC
              </h1>
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                Premium PC components, expert guidance, and lightning-fast delivery.
                Your ultimate tech destination.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                <FastLink href="/products">
                  <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-8 py-4 text-lg">
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                </FastLink>
                
                <FastLink href="/pc-builder">
                  <Button variant="outline" size="lg" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black px-8 py-4 text-lg">
                    Build Custom PC
                  </Button>
                </FastLink>
              </div>
            </MemoizedMotion>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 border-y border-yellow-400/20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => {
              const Icon = stat.icon;
              return (
                <MemoizedMotion
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="text-center"
                >
                  <Icon className="w-8 h-8 mx-auto mb-3 text-yellow-400" />
                  <div className="text-2xl md:text-3xl font-bold text-white mb-1">{stat.value}</div>
                  <div className="text-gray-400 text-sm">{stat.label}</div>
                </MemoizedMotion>
              );
            })}
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-white to-yellow-400 bg-clip-text text-transparent">
              Featured Categories
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Explore our curated selection of high-performance components
            </p>
            <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-400/30">
              ⚡ Instant Access
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredCategories.map((category, index) => {
              const Icon = category.icon;
              return (
                <MemoizedMotion
                  key={category.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{ y: -5 }}
                >
                  <FastLink href={category.href}>
                    <MemoizedCard className="group bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-200 cursor-pointer h-full">
                      <CardHeader className="text-center pb-2">
                        <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br ${category.gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="w-8 h-8 text-white" />
                        </div>
                        <CardTitle className="text-white group-hover:text-yellow-400 transition-colors">
                          {category.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-gray-400 text-center">
                          {category.description}
                        </CardDescription>
                      </CardContent>
                    </MemoizedCard>
                  </FastLink>
                </MemoizedMotion>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-b from-transparent to-yellow-900/10">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Why Choose TechZone?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <MemoizedMotion
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="text-center"
                >
                  <Icon className="w-12 h-12 mx-auto mb-4 text-yellow-400" />
                  <h3 className="text-xl font-semibold mb-2 text-white">{feature.title}</h3>
                  <p className="text-gray-400">{feature.description}</p>
                </MemoizedMotion>
              );
            })}
          </div>
        </div>
      </section>

      {/* Instant Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Featured Products
            </h2>
            <p className="text-gray-400 text-lg">
              Hand-picked components for your next build
            </p>
            <Badge className="mt-2 bg-green-500/20 text-green-400 border-green-400/30">
              ⚡ Instant Loading
            </Badge>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {featuredProducts.slice(0, 3).map((product, index) => (
              <MemoizedMotion
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-200 group h-full">
                  <CardHeader>
                    <div 
                      className={`aspect-square rounded-lg mb-4 flex items-center justify-center relative bg-gradient-to-br ${categoryColors[product.category] || 'from-gray-600 to-gray-500'}`}
                    >
                      <Package className="w-12 h-12 text-white/80" />
                      <div className="absolute top-2 right-2">
                        <Badge className="bg-black/50 text-white border-white/20 text-xs">
                          {product.category.toUpperCase()}
                        </Badge>
                      </div>
                      <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1">
                        <span className="text-yellow-400 font-bold text-sm">${product.price}</span>
                      </div>
                    </div>
                    <CardTitle className="text-white group-hover:text-yellow-400 transition-colors">
                      {product.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <Star 
                          key={i} 
                          className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
                        />
                      ))}
                      <span className="ml-2 text-gray-400 text-sm">({product.rating})</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-2xl font-bold text-yellow-400">${product.price}</span>
                        <div className="text-xs text-gray-500 uppercase">{product.brand}</div>
                      </div>
                      <Button size="sm" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                        <ShoppingCart className="w-4 h-4 mr-1" />
                        Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </MemoizedMotion>
            ))}
          </div>
          
          <div className="text-center">
            <FastLink href="/products">
              <Button size="lg" variant="outline" className="border-yellow-400 text-yellow-400 hover:bg-yellow-400 hover:text-black">
                View All Products
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </FastLink>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 border-t border-yellow-400/20">
        <div className="container mx-auto px-4 text-center">
          <MemoizedMotion
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">
              Ready to Build Your Dream Setup?
            </h2>
            <p className="text-gray-300 text-lg mb-8 max-w-2xl mx-auto">
              Join thousands of satisfied customers who trust TechZone for their PC building needs.
            </p>
            <FastLink href="/products">
              <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold px-12 py-4 text-lg">
                Start Shopping
                <ArrowRight className="ml-2 w-5 h-5" />
              </Button>
            </FastLink>
          </MemoizedMotion>
        </div>
      </section>

      <Footer />
    </div>
  );
}
