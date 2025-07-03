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
  Microchip, 
  Power, 
  Fan,
  ArrowRight,
  Star,
  Zap,
  Shield,
  Truck
} from "lucide-react";
import Link from "next/link";

export default function Home() {
  const categories = [
    { name: "CPUs", icon: Cpu, count: "150+", href: "/category/cpu" },
    { name: "Graphics Cards", icon: Monitor, count: "89+", href: "/category/gpu" },
    { name: "Storage", icon: HardDrive, count: "200+", href: "/category/storage" },
    { name: "RAM", icon: MemoryStick, count: "120+", href: "/category/ram" },
    { name: "Motherboards", icon: Microchip, count: "95+", href: "/category/motherboard" },
    { name: "Power Supplies", icon: Power, count: "75+", href: "/category/psu" },
    { name: "Cooling", icon: Fan, count: "110+", href: "/category/cooling" },
  ];

  const featuredProducts = [
    {
      id: 1,
      name: "AMD Ryzen 9 7900X",
      category: "CPU",
      price: 599.99,
      originalPrice: 699.99,
      rating: 4.8,
      reviews: 1247,
      image: "/api/placeholder/300/300",
      badge: "Best Seller",
      specs: ["12 Cores", "24 Threads", "5.6 GHz Max"]
    },
    {
      id: 2,
      name: "NVIDIA RTX 4080 Super",
      category: "GPU",
      price: 999.99,
      originalPrice: 1199.99,
      rating: 4.9,
      reviews: 892,
      image: "/api/placeholder/300/300",
      badge: "New",
      specs: ["16GB GDDR6X", "Ray Tracing", "DLSS 3"]
    },
    {
      id: 3,
      name: "Samsung 980 PRO 2TB",
      category: "Storage",
      price: 179.99,
      originalPrice: 249.99,
      rating: 4.7,
      reviews: 2156,
      image: "/api/placeholder/300/300",
      badge: "Sale",
      specs: ["PCIe 4.0", "7000MB/s", "5 Year Warranty"]
    }
  ];

  const features = [
    {
      icon: Zap,
      title: "Lightning Fast Delivery",
      description: "Get your components delivered within 24-48 hours"
    },
    {
      icon: Shield,
      title: "Extended Warranty",
      description: "All products come with extended warranty coverage"
    },
    {
      icon: Truck,
      title: "Free Shipping",
      description: "Free shipping on orders over $150"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-800 relative overflow-x-hidden">
      <Header />
      {/* Animated SVG Background for Hero */}
      <div className="absolute top-0 left-0 w-full h-[600px] pointer-events-none z-0">
        <svg width="100%" height="100%" viewBox="0 0 1440 600" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
          <defs>
            <linearGradient id="heroGradient" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#facc15" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.08" />
            </linearGradient>
          </defs>
          <ellipse cx="720" cy="300" rx="900" ry="300" fill="url(#heroGradient)" />
        </svg>
      </div>
      {/* Hero Section */}
      <section className="relative py-24 overflow-hidden z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-transparent to-black/60" />
        <div className="container mx-auto px-4 relative">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <Badge variant="secondary" className="mb-6 bg-yellow-400/20 text-yellow-400 border-yellow-400/30 shadow-lg px-4 py-2 text-base font-semibold tracking-wide animate-pulse">
                <Zap className="w-4 h-4 mr-2 animate-bounce" />
                New Arrivals Weekly
              </Badge>
              <h1 className="text-5xl md:text-7xl font-extrabold mb-8 text-white drop-shadow-lg leading-tight">
                Build Your Dream
                <span className="text-yellow-400 block drop-shadow">Gaming Rig</span>
              </h1>
              <p className="text-2xl text-white/80 mb-10 max-w-2xl mx-auto font-light">
                Discover the latest PC components and hardware from top brands. 
                Build, upgrade, and optimize your system with our premium selection.
              </p>
              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="text-lg px-10 py-5 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-full shadow-xl transition-transform hover:scale-105">
                  <Link href="/products" className="flex items-center">
                    Shop Components
                    <ArrowRight className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-10 py-5 border-yellow-400/40 text-white hover:bg-yellow-400/10 hover:border-yellow-400 rounded-full font-bold shadow-xl transition-transform hover:scale-105">
                  <Link href="/pc-builder" className="flex items-center">
                    Build PC
                    <Cpu className="ml-3 w-6 h-6" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      {/* Categories Grid */}
      <section className="py-20 bg-zinc-900/60 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4 text-white tracking-tight">Shop by Category</h2>
            <p className="text-lg text-zinc-400">Find exactly what you need for your build</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-8">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link href={category.href}>
                  <Card className="hover:shadow-2xl transition-all duration-300 hover:scale-110 group cursor-pointer bg-zinc-800/80 border-0 rounded-2xl">
                    <CardContent className="p-8 text-center flex flex-col items-center">
                      <category.icon className="w-14 h-14 mb-5 text-yellow-400 group-hover:text-yellow-300 transition-colors drop-shadow" />
                      <h3 className="font-semibold text-lg text-white mb-2 tracking-wide group-hover:text-yellow-400 transition-colors">
                        {category.name}
                      </h3>
                      <Badge variant="secondary" className="bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-3 py-1 text-sm font-medium">
                        {category.count} items
                      </Badge>
                    </CardContent>
                  </Card>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Featured Products */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-bold mb-4 text-white tracking-tight">Featured Products</h2>
            <p className="text-lg text-zinc-400">Hand-picked components for enthusiasts</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="hover:shadow-2xl transition-all duration-300 group overflow-hidden rounded-2xl bg-zinc-800/80 border-0">
                  <div className="relative">
                    <div className="bg-zinc-900/60 h-64 flex items-center justify-center">
                      <Monitor className="w-24 h-24 text-zinc-600" />
                    </div>
                    <Badge 
                      className={`absolute top-4 left-4 px-4 py-2 text-base font-semibold shadow ${product.badge === "Sale" ? "bg-red-500/90 text-white" : product.badge === "New" ? "bg-green-500/90 text-white" : "bg-yellow-400/90 text-black"}`}
                    >
                      {product.badge}
                    </Badge>
                  </div>
                  <CardContent className="p-8">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="outline" className="text-yellow-400 border-yellow-400/40 px-3 py-1 text-sm font-medium bg-zinc-900/40">
                        {product.category}
                      </Badge>
                      <div className="flex items-center">
                        <Star className="w-5 h-5 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-base font-semibold text-white">{product.rating}</span>
                        <span className="text-sm text-zinc-400 ml-1">
                          ({product.reviews})
                        </span>
                      </div>
                    </div>
                    <h3 className="font-bold text-xl mb-3 group-hover:text-yellow-400 transition-colors text-white">
                      {product.name}
                    </h3>
                    <div className="space-y-1 mb-5">
                      {product.specs.map((spec, i) => (
                        <div key={i} className="text-sm text-zinc-400">
                          • {spec}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-3xl font-bold text-yellow-400">
                          ${product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-base text-zinc-500 line-through ml-3">
                            ${product.originalPrice}
                          </span>
                        )}
                      </div>
                      <Button className="rounded-full px-6 py-3 font-bold bg-yellow-400 hover:bg-yellow-300 text-black shadow-lg transition-transform hover:scale-105">
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* Features */}
      <section className="py-20 bg-zinc-900/60 backdrop-blur-md">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-10">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
                className="text-center"
              >
                <feature.icon className="w-14 h-14 mx-auto mb-5 text-yellow-400 animate-pulse" />
                <h3 className="text-2xl font-semibold mb-3 text-white tracking-wide">{feature.title}</h3>
                <p className="text-lg text-zinc-400">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-yellow-400/10 via-transparent to-yellow-400/5">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6 text-white tracking-tight">Ready to Build?</h2>
            <p className="text-2xl text-zinc-400 mb-10 max-w-2xl mx-auto font-light">
              Use our PC Builder tool to create your perfect system, or explore our curated component selection.
            </p>
            <div className="flex flex-col sm:flex-row gap-6 justify-center">
              <Button size="lg" className="text-lg px-10 py-5 rounded-full font-bold bg-yellow-400 hover:bg-yellow-300 text-black shadow-xl transition-transform hover:scale-105">
                <Link href="/pc-builder">
                  Start Building
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-10 py-5 rounded-full font-bold border-yellow-400/40 text-white hover:bg-yellow-400/10 hover:border-yellow-400 shadow-xl transition-transform hover:scale-105">
                <Link href="/products">
                  Browse All Products
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
}
