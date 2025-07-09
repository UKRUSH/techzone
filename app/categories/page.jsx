"use client";

import { useState, useMemo, memo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Package,
  Search,
  Filter,
  Star,
  Zap,
  XCircle,
  Box,
  Gamepad2,
  Keyboard,
  Mouse,
  Headphones,
  Wifi,
  Usb,
  Smartphone,
  Loader2
} from "lucide-react";
import { FastLink } from "@/components/navigation/FastNavigation";

// Icon mapping for categories
const categoryIcons = {
  "gpu": Monitor,
  "graphics cards": Monitor,
  "cpu": Cpu,
  "processors": Cpu,
  "memory": MemoryStick,
  "ram": MemoryStick,
  "storage": HardDrive,
  "motherboard": Microchip,
  "motherboards": Microchip,
  "power-supply": Power,
  "power supplies": Power,
  "cooling": Fan,
  "case": Box,
  "cases": Box,
  "gaming-peripherals": Gamepad2,
  "gaming peripherals": Gamepad2,
  "monitors": Monitor,
  "audio": Headphones,
  "networking": Wifi,
  "default": Package
};

// Memoized components for optimized rendering
const MemoizedCard = memo(function MemoizedCard({ children, ...props }) {
  return <Card {...props}>{children}</Card>;
});

const MemoizedMotion = memo(function MemoizedMotion({ children, ...props }) {
  return <motion.div {...props}>{children}</motion.div>;
});

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch categories from database
  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const response = await fetch('/api/categories');
        if (response.ok) {
          const data = await response.json();
          setCategories(data.data || []);
        } else {
          throw new Error('Failed to fetch categories');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Get appropriate icon for category
  const getCategoryIcon = (categorySlug) => {
    const IconComponent = categoryIcons[categorySlug] || categoryIcons.default;
    return IconComponent;
  };
  
  // Filter categories based on search term
  const filteredCategories = useMemo(() => 
    categories.filter(category => 
      category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (category.description && category.description.toLowerCase().includes(searchTerm.toLowerCase()))
    ), [categories, searchTerm]
  );
  
  // Featured categories
  const featuredCategories = useMemo(() => 
    categories.filter(category => category.featured), [categories]
  );

  if (loading) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center pt-32">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
            <p className="text-muted-foreground">Loading categories...</p>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <div className="min-h-screen flex items-center justify-center pt-32">
          <div className="flex flex-col items-center gap-4">
            <XCircle className="h-8 w-8 text-red-500" />
            <p className="text-red-500">Error loading categories: {error}</p>
            <Button onClick={() => window.location.reload()}>
              Try Again
            </Button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="min-h-screen relative overflow-hidden pt-32">{/* Added pt-32 for header space */}
        {/* Database Status Indicator */}
        <div className="fixed top-4 right-4 z-50 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
            <span className="text-green-400 text-sm font-medium">Database Connected</span>
          </div>
        </div>

        {/* Main background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-yellow-950/20 z-0"></div>
        
        {/* Yellow accent elements */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-yellow-500/15 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-yellow-600/15 blur-3xl animate-pulse-slower"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-yellow-400/15 blur-3xl animate-pulse-slow"></div>
        
        {/* Additional yellow glow effects */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-yellow-500/10 blur-3xl"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-yellow-500/10 blur-3xl"></div>
        
        {/* Black overlay to add depth */}
        <div className="absolute inset-0 bg-black/40 z-1"></div>
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9InJnYmEoMjU1LDIxNSwwLDAuMDYpIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTAgMzBoMzB2MzBIMHoiIHN0cm9rZT0icmdiYSgyNTUsMjE1LDAsMC4wNikiIHN0cm9rZS13aWR0aD0iLjUiLz48L2c+PC9zdmc+')] opacity-30 z-1"></div>
        
        {/* Diagonal yellow accent lines */}
        <div className="absolute inset-0 overflow-hidden z-1 opacity-10">
          <div className="absolute -left-full -bottom-full w-[200%] h-[200%] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-yellow-400/20 via-yellow-500/5 to-transparent transform rotate-45"></div>
        </div>
        
        {/* Animated glowing dots */}
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-yellow-400/80 shadow-lg shadow-yellow-400/40 animate-ping-slow z-2"></div>
        <div className="absolute top-1/2 left-32 w-2 h-2 rounded-full bg-yellow-500/80 shadow-lg shadow-yellow-500/40 animate-ping-slower z-2"></div>
        <div className="absolute bottom-40 right-1/3 w-2.5 h-2.5 rounded-full bg-yellow-300/80 shadow-lg shadow-yellow-300/40 animate-ping-slow z-2"></div>
        <div className="absolute top-2/3 left-1/4 w-2 h-2 rounded-full bg-yellow-600/80 shadow-lg shadow-yellow-600/40 animate-ping-slow z-2"></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Hero Section with enhanced styling */}
          <MemoizedMotion 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="mb-20 text-center relative"
          >
            {/* Decorative hero background elements */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[120%] h-40 bg-yellow-400/10 rounded-full blur-3xl"></div>
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_50%,rgba(0,0,0,0.8)_100%)]"></div>
            </div>
            
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="inline-block relative"
            >
              <Badge 
                variant="outline" 
                className="mb-4 py-1.5 px-6 bg-gradient-to-r from-black to-yellow-900/40 border-yellow-500/60 text-yellow-400 rounded-full shadow-lg"
              >
                <Star className="w-3.5 h-3.5 mr-1.5 text-yellow-300 animate-pulse-slow" /> Premium PC Components
              </Badge>
              <div className="absolute -inset-0.5 bg-gradient-to-r from-yellow-400/0 via-yellow-400/40 to-yellow-400/0 rounded-full blur-sm animate-shimmer-slow"></div>
            </motion.div>
            
            <h1 className="text-6xl sm:text-7xl font-extrabold mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-lg">
              Product Categories
            </h1>
            
            {/* Enhanced divider with animated glow */}
            <div className="relative h-2 w-32 mx-auto mb-8">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/30"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/80 to-yellow-400/0 rounded-full blur-md animate-shimmer-slow"></div>
            </div>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.3 }}
              className="text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
            >
              Explore our comprehensive selection of high-quality PC components and hardware.
              Find everything you need to build your dream computer setup with our carefully 
              curated collection.
            </motion.p>
            
            {/* Enhanced Search Bar */}
            <motion.div 
              className="relative max-w-md mx-auto mb-10"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-yellow-500" />
              </div>
              <input 
                type="text" 
                placeholder="Search categories..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-2 border-yellow-500/30 bg-zinc-900/80 focus:border-yellow-500/60 focus:ring-2 focus:ring-yellow-500/20 focus:outline-none transition-all shadow-md placeholder:text-gray-400 text-white"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-muted-foreground hover:text-yellow-500 transition-colors"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              )}
            </motion.div>
            
            {/* Quick Access Featured Categories with enhanced styling */}
            {featuredCategories.length > 0 && !searchTerm && (
              <motion.div 
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-wrap justify-center gap-3 mt-6 relative"
              >
                {/* Decorative background for the popular section */}
                <div className="absolute -inset-3 bg-yellow-500/5 rounded-xl -z-10 blur-sm"></div>
                
                <div className="flex items-center bg-yellow-500/10 px-3 py-1 rounded-full mr-2 border border-yellow-500/30">
                  <Star className="w-3 h-3 text-yellow-400 mr-1" />
                  <span className="text-sm text-yellow-500 font-bold">Popular:</span>
                </div>
                
                {featuredCategories.map((category, idx) => {
                  const IconComponent = getCategoryIcon(category.slug);
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ duration: 0.3, delay: 0.6 + (idx * 0.1) }}
                      whileHover={{ y: -2, scale: 1.05, transition: { duration: 0.2 } }}
                    >
                      <FastLink href={`/products?category=${category.slug}`}>
                        <Badge variant="outline" className="bg-zinc-900/70 hover:bg-yellow-500/10 cursor-pointer transition-all duration-300 px-4 py-2 text-sm border-yellow-500/30 shadow-sm hover:shadow-md hover:text-yellow-400">
                          <IconComponent className="w-3.5 h-3.5 mr-2 text-yellow-500" />
                          {category.name}
                        </Badge>
                      </FastLink>
                    </motion.div>
                  );
                })}
                <motion.div
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 + (featuredCategories.length * 0.1) }}
                  whileHover={{ y: -2, scale: 1.05, transition: { duration: 0.2 } }}
                >
                  <a href="#all-categories">
                    <Badge variant="outline" className="bg-yellow-500/10 hover:bg-yellow-500/20 cursor-pointer transition-all duration-300 px-4 py-2 text-sm border-yellow-500/40 shadow-sm hover:shadow-md">
                      <Filter className="w-3.5 h-3.5 mr-2 text-yellow-500" /> View All
                    </Badge>
                  </a>
                </motion.div>
              </motion.div>
            )}
          </MemoizedMotion>

          {/* Categories Grid with instant rendering */}
          <div id="all-categories" className="mb-10 flex justify-between items-center">
            <motion.h2 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-sm"
            >
              {searchTerm ? `Search Results: "${searchTerm}"` : "All Categories"}
            </motion.h2>
            <motion.div 
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              className="flex items-center gap-2"
            >
              {searchTerm && (
                <Button 
                  variant="outline"
                  onClick={() => setSearchTerm("")} 
                  className="text-sm border-yellow-500/30 hover:bg-yellow-500/5 text-yellow-500/90"
                >
                  <XCircle className="w-4 h-4 mr-2" />
                  Clear Search
                </Button>
              )}
            </motion.div>
          </div>

          {/* Instant categories display */}
          {filteredCategories.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 max-w-md mx-auto"
            >
              <div className="bg-yellow-500/10 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-12 w-12 text-yellow-500/70" />
              </div>
              <p className="text-2xl font-medium mb-3 text-yellow-500">No categories found</p>
              <p className="text-gray-300 mb-8">Try searching with different keywords</p>
              <Button onClick={() => setSearchTerm("")} variant="outline" size="lg" className="border-yellow-500/30 hover:border-yellow-500/50 text-yellow-500/90">
                View All Categories
              </Button>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredCategories.map((category, index) => {
                const IconComponent = getCategoryIcon(category.slug);
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.05 }}
                    whileHover={{ y: -8, scale: 1.02, transition: { duration: 0.2 } }}
                    className="h-full"
                  >
                    <FastLink href={`/products?category=${category.slug}`} className="h-full">
                      <MemoizedCard className="group h-full hover:shadow-2xl transition-all duration-300 cursor-pointer border-yellow-500/30 hover:border-yellow-500/60 overflow-hidden relative">
                        {/* Black and yellow gradient background */}
                        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-yellow-950/30 -z-10"></div>
                        
                        {/* Yellow corner accent */}
                        <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
                        
                        {/* Animated top border */}
                        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-yellow-400 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
                        
                        <CardHeader className="text-center pb-4 pt-8 relative">
                          <div className="mx-auto mb-6 p-5 rounded-full bg-gradient-to-br from-yellow-500/30 to-black/80 group-hover:from-yellow-500/50 group-hover:to-yellow-700/30 transition-all transform group-hover:scale-110 shadow-lg">
                            <IconComponent className="h-10 w-10 text-yellow-400 group-hover:text-yellow-300 transition-colors duration-500 drop-shadow-lg" />
                          </div>
                          
                          {/* Yellow glow behind title */}
                          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-16 bg-yellow-500/10 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          
                          <CardTitle className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 to-yellow-500 group-hover:from-yellow-300 group-hover:to-yellow-400 transition-all duration-500">
                            {category.name}
                          </CardTitle>
                          {category.description && (
                            <CardDescription className="text-sm text-yellow-100/70 mt-3">
                              {category.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="text-center pb-8">
                          <div className="flex items-center justify-between mt-4">
                            <Badge variant="outline" className="bg-black/80 border-yellow-500/40 font-medium text-yellow-400 px-3 py-1 shadow-inner shadow-yellow-500/10">
                              {category.productCount || 0} Products
                            </Badge>
                            <div className="bg-gradient-to-r from-yellow-500/20 to-yellow-600/30 p-2 rounded-full group-hover:from-yellow-500/30 group-hover:to-yellow-600/50 transition-colors shadow-lg">
                              <ArrowRight className="h-4 w-4 text-yellow-400 group-hover:text-yellow-300 group-hover:translate-x-1 transition-all" />
                            </div>
                          </div>
                        </CardContent>
                      </MemoizedCard>
                    </FastLink>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Enhanced Call to Action */}
          <motion.div 
            className="mt-24 mb-8 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            <MemoizedCard className="border-yellow-500/40 hover:border-yellow-500/70 hover:shadow-2xl hover:shadow-yellow-500/20 transition-all duration-500 relative overflow-hidden">
              {/* Enhanced background with yellow and black */}
              <div className="absolute inset-0 bg-gradient-to-br from-black via-zinc-900 to-yellow-950 -z-10"></div>
              
              {/* Animated background elements */}
              <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-yellow-400/10 blur-3xl animate-pulse-slow"></div>
              <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-yellow-500/15 blur-3xl animate-pulse-slower"></div>
              
              {/* Diagonal striped pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_20px,rgba(255,215,0,0.1)_20px,rgba(255,215,0,0.1)_40px)]"></div>
              </div>
              
              <CardContent className="py-20 px-8 relative">
                {/* Glowing icon wrapper */}
                <div className="relative mx-auto mb-10">
                  <div className="absolute -inset-4 rounded-full bg-yellow-400/20 blur-xl animate-pulse-slow"></div>
                  <div className="bg-gradient-to-br from-yellow-400/30 to-yellow-700/30 w-28 h-28 flex items-center justify-center rounded-full mx-auto shadow-2xl shadow-yellow-500/20 relative">
                    <Zap className="h-12 w-12 text-yellow-300 drop-shadow-lg" />
                  </div>
                </div>
                
                <h3 className="text-4xl sm:text-5xl font-extrabold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 drop-shadow-lg">
                  Need Help Choosing Components?
                </h3>
                
                {/* Subtle divider */}
                <div className="w-24 h-1 bg-gradient-to-r from-yellow-400/50 to-yellow-600/50 mx-auto mb-8 rounded-full"></div>
                
                <p className="text-xl text-yellow-100/80 mb-12 max-w-2xl mx-auto leading-relaxed">
                  Our PC Builder tool can help you select compatible components 
                  and create the perfect build for your needs and budget.
                  Start building your dream PC today!
                </p>
                
                <FastLink href="/pc-builder">
                  <Button size="lg" className="bg-gradient-to-r from-yellow-400 to-yellow-600 hover:from-yellow-500 hover:to-yellow-700 px-12 py-7 text-xl font-bold shadow-xl hover:shadow-2xl hover:shadow-yellow-500/30 transition-all group text-black relative overflow-hidden">
                    {/* Button shine effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    <span className="relative flex items-center">
                      Try PC Builder
                      <ArrowRight className="ml-3 h-6 w-6 group-hover:translate-x-2 transition-transform duration-300" />
                    </span>
                  </Button>
                </FastLink>
                
                {/* Yellow corner accents */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-500/10 rounded-bl-full blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-32 h-32 bg-yellow-500/10 rounded-tr-full blur-xl"></div>
              </CardContent>
            </MemoizedCard>
          </motion.div>
        </div>
      </div>
    </>
  );
}
