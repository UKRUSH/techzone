"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ProductCard from "@/components/ProductCard";
import { 
  Search, 
  Filter, 
  Grid3X3, 
  List, 
  ChevronDown,
  SlidersHorizontal,
  Package,
  Loader2
} from "lucide-react";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 0, max: 10000 });
  const [sortBy, setSortBy] = useState("name");
  const [viewMode, setViewMode] = useState("grid");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch products from API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
        ...(selectedCategory && { category: selectedCategory }),
        ...(selectedBrand && { brand: selectedBrand }),
        ...(priceRange.min > 0 && { minPrice: priceRange.min.toString() }),
        ...(priceRange.max < 10000 && { maxPrice: priceRange.max.toString() })
      });

      const response = await fetch(`/api/products?${params}`);
      const data = await response.json();
      
      if (response.ok) {
        setProducts(data.products || []);
        setTotalPages(data.pagination?.pages || 1);
      } else {
        console.error("Error fetching products:", data.error);
        // Set mock data as fallback
        setProducts(mockProducts);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      // Set mock data as fallback
      setProducts(mockProducts);
    } finally {
      setLoading(false);
    }
  };

  // Mock products data as fallback
  const mockProducts = [
    {
      id: "1",
      name: "AMD Ryzen 9 7900X",
      category: { name: "CPU" },
      brand: { name: "AMD" },
      variants: [{ price: 599.99, compareAtPrice: 699.99 }],
      averageRating: 4.8,
      reviewCount: 247,
      totalStock: 45,
      images: [{ url: "/api/placeholder/400/400" }],
      features: ["12 Cores", "24 Threads", "5.6 GHz Max Boost"],
      createdAt: new Date()
    },
    {
      id: "2",
      name: "NVIDIA RTX 4080 Super",
      category: { name: "GPU" },
      brand: { name: "NVIDIA" },
      variants: [{ price: 999.99, compareAtPrice: 1199.99 }],
      averageRating: 4.9,
      reviewCount: 189,
      totalStock: 23,
      images: [{ url: "/api/placeholder/400/400" }],
      features: ["16GB GDDR6X", "Ray Tracing"],
      createdAt: new Date()
    },
    {
      id: "3",
      name: "Samsung 980 PRO 2TB",
      category: { name: "Storage" },
      brand: { name: "Samsung" },
      variants: [{ price: 179.99, compareAtPrice: 249.99 }],
      averageRating: 4.7,
      reviewCount: 456,
      totalStock: 67,
      images: [{ url: "/api/placeholder/400/400" }],
      features: ["2TB Capacity", "PCIe 4.0"],
      createdAt: new Date()
    },
    {
      id: "4",
      name: "Corsair Vengeance LPX 32GB",
      category: { name: "RAM" },
      brand: { name: "Corsair" },
      variants: [{ price: 129.99, compareAtPrice: 149.99 }],
      averageRating: 4.6,
      reviewCount: 312,
      totalStock: 89,
      images: [{ url: "/api/placeholder/400/400" }],
      features: ["32GB Kit", "DDR4-3200"],
      createdAt: new Date()
    }
  ];

  // Fetch categories and brands
  const fetchFilters = async () => {
    try {
      const [categoriesRes, brandsRes] = await Promise.all([
        fetch('/api/categories'),
        fetch('/api/brands')
      ]);
      
      if (categoriesRes.ok) {
        const categoriesData = await categoriesRes.json();
        setCategories(categoriesData);
      } else {
        // Mock categories as fallback
        setCategories([
          { name: "CPU" },
          { name: "GPU" },
          { name: "RAM" },
          { name: "Storage" },
          { name: "Motherboard" },
          { name: "PSU" }
        ]);
      }
      
      if (brandsRes.ok) {
        const brandsData = await brandsRes.json();
        setBrands(brandsData);
      } else {
        // Mock brands as fallback
        setBrands([
          { name: "AMD" },
          { name: "Intel" },
          { name: "NVIDIA" },
          { name: "Samsung" },
          { name: "Corsair" },
          { name: "ASUS" }
        ]);
      }
    } catch (error) {
      console.error("Error fetching filters:", error);
      // Set mock data as fallback
      setCategories([
        { name: "CPU" },
        { name: "GPU" },
        { name: "RAM" },
        { name: "Storage" }
      ]);
      setBrands([
        { name: "AMD" },
        { name: "NVIDIA" },
        { name: "Samsung" },
        { name: "Corsair" }
      ]);
    }
  };

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [currentPage, selectedCategory, selectedBrand, priceRange]);

  // Filter products by search term (client-side for now)
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.brand?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a, b) => {
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

  const clearFilters = () => {
    setSelectedCategory("");
    setSelectedBrand("");
    setPriceRange({ min: 0, max: 10000 });
    setSearchTerm("");
    setCurrentPage(1);
  };

  return (
    <>
      <Header />
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced background with advanced patterns and animations */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-yellow-950/20 z-0"></div>
        
        {/* Dynamic animated wave patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTI4OCA0NDYuNUMtMjEuOCAzMDcuMSAxMzYuNiA0MTMuMSAyNDMuNyAzMzUuNkM0MTIuMyAyMTcuMiA1NDMuMSA0MTEuMyA3MTkuMiAzMDNDODY0LjcgMjE2LjUgOTI3LjEgMzYwLjggMTEzMC43IDI0OEMxMzk3LjMgOTguNiAxNDMwLjIgMzc2LjQgMTYyMC44IDI2MC4xQzE3ODMuMSAxNjEuNSAxODc3LjEgMzU3LjMgMjAxMC40IDI3Ny42IiBzdHJva2U9IiNGRkQzMDAiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==')] bg-no-repeat bg-cover animate-pulse-slower"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTM5NyAxOTkuMUMtMTMwLjggMzM4LjUgMjcuNiAyMzIuNSAxMzQuNyAzMDkuOUMzMDMuMyA0MjguMyA0MzQuMSAyMzQuMiA2MTAuMiAzNDIuNUM3NTUuNyA0MjkgODE4LjEgMjg0LjcgMTAyMS43IDM5Ny41QzEyODguMyA1NDYuOSAxMzIxLjIgMjY5LjEgMTUxMS44IDM4NS40QzE2NzQuMSA0ODQgMTc2OC4xIDI4OC4yIDE5MDEuNCAzNjcuOSIgc3Ryb2tlPSIjRkZEMzAwIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=')] bg-no-repeat bg-cover animate-pulse-slow"></div>
        </div>
        
        {/* Animated yellow orbs with advanced glow effects */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-yellow-500/20 to-amber-600/5 blur-3xl animate-pulse-slower"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-bl from-yellow-300/20 to-yellow-500/5 blur-3xl animate-pulse-slow"></div>
        
        {/* Advanced glow focal points */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-400/15 via-yellow-300/10 to-yellow-500/5 blur-3xl animate-pulse-slower"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-l from-yellow-400/15 via-yellow-300/10 to-yellow-500/5 blur-3xl animate-pulse-slow"></div>
        
        {/* Black overlay with improved depth effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-1"></div>
        
        {/* Enhanced grid pattern overlay with subtle animation */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9InJnYmEoMjU1LDIxNSwwLDAuMDgpIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTAgMzBoMzB2MzBIMHoiIHN0cm9rZT0icmdiYSgyNTUsMjE1LDAsMC4wOCkiIHN0cm9rZS13aWR0aD0iLjUiLz48L2c+PC9zdmc+')] opacity-30 z-1 animate-pulse-slower"></div>
        
        {/* Diagonal yellow streaks */}
        <div className="absolute inset-0 overflow-hidden z-1 opacity-10">
          <div className="absolute -left-full -bottom-full w-[200%] h-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,rgba(255,215,0,0.1)_40px,rgba(255,215,0,0.1)_80px)] transform rotate-45"></div>
        </div>
        
        {/* Advanced animated glowing dots with interactive effects */}
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-400/40 animate-ping-slow z-2"></div>
        <div className="absolute top-1/2 left-32 w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/40 animate-ping-slower z-2"></div>
        <div className="absolute bottom-40 right-1/3 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 shadow-lg shadow-yellow-300/40 animate-ping-slow z-2"></div>
        <div className="absolute top-2/3 left-1/4 w-2 h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-400/40 animate-ping-slow z-2"></div>
        <div className="absolute top-1/4 left-2/3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/40 animate-ping-slower z-2"></div>
        
        <div className="container mx-auto px-4 py-12 relative z-10 flex flex-col md:flex-row gap-10">
          {/* Enhanced Sidebar Filters */}
          <aside className="w-full md:w-80 space-y-7 backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 rounded-2xl shadow-xl shadow-yellow-400/10 p-7 sticky top-8 self-start">
            {/* Pulsing corner accent */}
            <div className="absolute top-0 left-0 w-24 h-24">
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/30 to-transparent rounded-tl-2xl"></div>
              <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-yellow-400/80 animate-pulse-slow"></div>
            </div>
            
            {/* Enhanced Search with advanced styling */}
            <Card className="bg-transparent border-0 shadow-none">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center text-yellow-400 font-semibold tracking-wide">
                  <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5">
                    <Search className="w-5 h-5 text-yellow-400" />
                  </div>
                  Search Products
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative group">
                  <div className="absolute left-3 top-3 text-yellow-400/70 transition-colors group-hover:text-yellow-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-black/60 border-yellow-400/30 text-white rounded-lg focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all shadow-inner shadow-yellow-400/5"
                  />
                  {/* Focus ring effect */}
                  <div className="absolute inset-0 -z-10 rounded-lg border border-yellow-400/0 group-focus-within:border-yellow-400/40 opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                  
                  {/* Animated corner accent */}
                  <div className="absolute bottom-0 right-0 w-8 h-8 opacity-0 group-focus-within:opacity-100 transition-opacity">
                    <div className="absolute bottom-0 right-0 w-full h-full bg-gradient-to-tl from-yellow-400/30 to-transparent rounded-br-lg"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
            {/* Enhanced Categories with improved UI */}
            <Card className="bg-transparent border-0 shadow-none relative">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/5 to-transparent rounded-xl opacity-40"></div>
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg flex items-center text-yellow-400 font-semibold tracking-wide">
                  <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5 relative">
                    <Package className="w-5 h-5 text-yellow-400" />
                    {/* Glowing effect */}
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm animate-pulse-slow"></div>
                  </div>
                  Categories
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 relative z-10">
                {/* Yellow accent line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
                
                <Button
                  variant={selectedCategory === "" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-lg font-medium transition-all duration-300 ${
                    selectedCategory === "" 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-md shadow-yellow-400/30" 
                      : "text-white hover:text-yellow-400 hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400/20"
                  }`}
                  onClick={() => setSelectedCategory("")}
                >
                  <Package className="w-4 h-4 mr-2 opacity-80" />
                  All Categories
                  {selectedCategory === "" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/10 to-yellow-400/0 rounded-lg animate-shimmer-slow"></div>
                  )}
                </Button>
                
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {/* Custom styling for scrollbar */}
                  <style jsx global>{`
                    .custom-scrollbar::-webkit-scrollbar {
                      width: 5px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-track {
                      background: rgba(0,0,0,0.1);
                      border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb {
                      background: rgba(255,204,0,0.2);
                      border-radius: 10px;
                    }
                    .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                      background: rgba(255,204,0,0.4);
                    }
                  `}</style>
                  
                  {categories.map((category, index) => (
                    <Button
                      key={category.name}
                      variant={selectedCategory === category.name ? "default" : "ghost"}
                      className={`w-full justify-start rounded-lg font-medium transition-all duration-300 ${
                        selectedCategory === category.name 
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-md shadow-yellow-400/30" 
                          : "text-white hover:text-yellow-400 hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400/20"
                      }`}
                      onClick={() => setSelectedCategory(category.name)}
                    >
                      {/* Icon mapping would be better here, using package as fallback */}
                      <Package className="w-4 h-4 mr-2 opacity-80" />
                      <span className="truncate">{category.name}</span>
                      
                      {selectedCategory === category.name && (
                        <>
                          <div className="absolute inset-0 border border-yellow-300 rounded-lg animate-pulse-slow opacity-30"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/10 to-yellow-400/0 rounded-lg animate-shimmer-slow"></div>
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Enhanced Brands with improved UI */}
            <Card className="bg-transparent border-0 shadow-none relative">
              <div className="absolute inset-0 bg-gradient-to-l from-yellow-400/5 to-transparent rounded-xl opacity-40"></div>
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg flex items-center text-yellow-400 font-semibold tracking-wide">
                  <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5 relative">
                    <SlidersHorizontal className="w-5 h-5 text-yellow-400" />
                    {/* Glowing effect */}
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm animate-pulse-slow"></div>
                  </div>
                  Brands
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2.5 relative z-10">
                {/* Yellow accent line */}
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-2/3 h-px bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent"></div>
                
                <Button
                  variant={selectedBrand === "" ? "default" : "ghost"}
                  className={`w-full justify-start rounded-lg font-medium transition-all duration-300 ${
                    selectedBrand === "" 
                      ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-md shadow-yellow-400/30" 
                      : "text-white hover:text-yellow-400 hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400/20"
                  }`}
                  onClick={() => setSelectedBrand("")}
                >
                  <svg className="w-4 h-4 mr-2 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M6 8H4V16H6V8Z" fill="currentColor" />
                    <path d="M9 5H7V19H9V5Z" fill="currentColor" />
                    <path d="M12 8H10V16H12V8Z" fill="currentColor" />
                    <path d="M15 3H13V21H15V3Z" fill="currentColor" />
                    <path d="M18 8H16V16H18V8Z" fill="currentColor" />
                    <path d="M21 5H19V19H21V5Z" fill="currentColor" />
                  </svg>
                  All Brands
                  {selectedBrand === "" && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/10 to-yellow-400/0 rounded-lg animate-shimmer-slow"></div>
                  )}
                </Button>
                
                <div className="space-y-1.5 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {brands.map((brand, idx) => (
                    <Button
                      key={brand.name}
                      variant={selectedBrand === brand.name ? "default" : "ghost"}
                      className={`w-full justify-start rounded-lg font-medium transition-all duration-300 ${
                        selectedBrand === brand.name 
                          ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-md shadow-yellow-400/30" 
                          : "text-white hover:text-yellow-400 hover:bg-yellow-400/10 border border-transparent hover:border-yellow-400/20"
                      }`}
                      onClick={() => setSelectedBrand(brand.name)}
                      style={{
                        transform: selectedBrand === brand.name ? 'scale(1.03)' : 'scale(1)',
                        transitionDelay: `${idx * 50}ms`
                      }}
                    >
                      {/* Logo placeholder - in a real app, you might use actual brand logos */}
                      <div className="w-4 h-4 mr-2 rounded-sm bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 flex items-center justify-center text-[10px] font-bold">
                        {brand.name.charAt(0)}
                      </div>
                      <span className="truncate">{brand.name}</span>
                      
                      {selectedBrand === brand.name && (
                        <>
                          <div className="absolute inset-0 border border-yellow-300 rounded-lg animate-pulse-slow opacity-30"></div>
                          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/10 to-yellow-400/0 rounded-lg animate-shimmer-slow"></div>
                        </>
                      )}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            {/* Price Range Filter - Adding this new filter */}
            <Card className="bg-transparent border-0 shadow-none relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent rounded-xl opacity-40"></div>
              <CardHeader className="pb-3 relative z-10">
                <CardTitle className="text-lg flex items-center text-yellow-400 font-semibold tracking-wide">
                  <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5 relative">
                    <svg className="w-5 h-5 text-yellow-400" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.58 20 4 16.42 4 12C4 7.58 7.58 4 12 4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20Z" fill="currentColor"/>
                      <path d="M12 17C12.5523 17 13 16.5523 13 16C13 15.4477 12.5523 15 12 15C11.4477 15 11 15.4477 11 16C11 16.5523 11.4477 17 12 17Z" fill="currentColor"/>
                      <path d="M13 7H11V14H13V7Z" fill="currentColor"/>
                    </svg>
                    {/* Glowing effect */}
                    <div className="absolute inset-0 rounded-full bg-yellow-400/20 blur-sm animate-pulse-slow"></div>
                  </div>
                  Price Range
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4 relative z-10">
                {/* Range slider visualization */}
                <div className="mt-2 mb-6 px-2">
                  <div className="h-2 bg-yellow-400/20 rounded-full relative">
                    <div 
                      className="absolute top-0 left-0 h-2 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full"
                      style={{ 
                        width: `${((priceRange.max - priceRange.min) / 10000) * 100}%`,
                        left: `${(priceRange.min / 10000) * 100}%` 
                      }}
                    ></div>
                    {/* Slider handles */}
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/30 transform -translate-x-1/2"
                      style={{ left: `${(priceRange.min / 10000) * 100}%` }}
                    ></div>
                    <div 
                      className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-yellow-400 rounded-full shadow-lg shadow-yellow-400/30 transform -translate-x-1/2"
                      style={{ left: `${(priceRange.max / 10000) * 100}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Price range input fields */}
                <div className="flex space-x-3">
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Min ($)</label>
                    <input 
                      type="number" 
                      value={priceRange.min}
                      onChange={(e) => setPriceRange({...priceRange, min: parseInt(e.target.value) || 0})}
                      className="w-full py-1.5 px-2 bg-black/60 border border-yellow-400/30 rounded-md text-white text-sm focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400"
                      min="0"
                      max={priceRange.max}
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm text-gray-400 mb-1">Max ($)</label>
                    <input 
                      type="number" 
                      value={priceRange.max}
                      onChange={(e) => setPriceRange({...priceRange, max: parseInt(e.target.value) || priceRange.min})}
                      className="w-full py-1.5 px-2 bg-black/60 border border-yellow-400/30 rounded-md text-white text-sm focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400"
                      min={priceRange.min}
                      max="10000"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Enhanced Clear Filters Button */}
            <Button
              variant="outline"
              className="w-full border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400/60 rounded-lg font-medium transition-all duration-300 py-6 group relative overflow-hidden"
              onClick={clearFilters}
            >
              {/* Animated shine effect */}
              <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              
              <span className="relative flex items-center justify-center">
                <Filter className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" />
                Reset All Filters
              </span>
            </Button>
            
            {/* Bottom decorative element */}
            <div className="absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-yellow-400/10 to-transparent rounded-b-2xl"></div>
          </aside>
          {/* Main Content */}
          <main className="flex-1">
            {/* Enhanced Hero Section with advanced animations and design */}
            <div className="mb-20 text-center relative overflow-hidden">
              {/* Animated hero background elements */}
              <div className="absolute inset-0 -z-10">
                {/* Dynamic radial glow effect */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[140%] h-60 bg-gradient-to-r from-yellow-400/5 via-yellow-500/15 to-yellow-400/5 rounded-full blur-3xl animate-pulse-slow"></div>
                
                {/* Radial gradient overlay */}
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_30%,rgba(0,0,0,0.9)_100%)]"></div>
                
                {/* Animated particle trails */}
                <div className="absolute w-full h-full overflow-hidden opacity-20">
                  <div className="absolute h-px w-1/4 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent top-[20%] left-[-100%] animate-[slideRight_15s_linear_infinite]"></div>
                  <div className="absolute h-px w-1/4 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent top-[80%] left-[-100%] animate-[slideRight_20s_linear_infinite_3s]"></div>
                  <div className="absolute h-px w-1/5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent top-[40%] left-[-100%] animate-[slideRight_12s_linear_infinite_1s]"></div>
                  <div className="absolute h-px w-1/5 bg-gradient-to-r from-transparent via-yellow-400/60 to-transparent top-[60%] left-[-100%] animate-[slideRight_18s_linear_infinite_2s]"></div>
                </div>
                
                {/* Circuit-like pattern overlay */}
                <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4MCIgaGVpZ2h0PSI4MCIgdmlld0JveD0iMCAwIDgwIDgwIj48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9InJnYmEoMjU1LCAyMTUsIDAsIDAuMDgpIiBzdHJva2Utd2lkdGg9IjAuNSIgZD0iTTAgMGgzMHYzMEgwek01MCAwaDMwdjMwSDUwek0wIDUwaDMwdjMwSDB6TTUwIDUwaDMwdjMwSDUwek0xNSAwdjMwTTAgMTVoMzBNNjUgMHYzME01MCAxNWgzME0xNSA1MHYzME0wIDY1aDMwTTY1IDUwdjMwTTUwIDY1aDMwIi8+PC9zdmc+')] opacity-30"></div>
              </div>
              
              <div className="relative">
                {/* Enhanced badge with 3D lighting effect */}
                <div className="inline-block relative mb-6 transform hover:scale-105 transition-transform duration-300">
                  <Badge 
                    variant="outline" 
                    className="py-2 px-8 bg-gradient-to-r from-black via-yellow-900/20 to-black border-yellow-500/60 text-yellow-400 rounded-full shadow-xl"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 rounded-full animate-pulse-slow"></div>
                    <Package className="w-4 h-4 mr-2 text-yellow-300 animate-pulse-slow" /> 
                    <span className="relative z-10 font-semibold tracking-wider">PREMIUM HARDWARE</span>
                  </Badge>
                  {/* Animated border glow */}
                  <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400/0 via-yellow-400/40 to-yellow-400/0 rounded-full blur-sm animate-shimmer-slow"></div>
                </div>
                
                {/* Enhanced text with 3D appearance */}
                <div className="relative">
                  {/* Text shadow layers for 3D effect */}
                  <h1 className="opacity-10 blur-md text-6xl sm:text-7xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 absolute top-1 left-1/2 transform -translate-x-1/2">
                    PC COMPONENTS
                  </h1>
                  <h1 className="opacity-20 blur-sm text-6xl sm:text-7xl font-black mb-4 tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-yellow-500 absolute top-0.5 left-1/2 transform -translate-x-1/2">
                    PC COMPONENTS
                  </h1>
                  <h1 className="text-6xl sm:text-7xl font-black mb-8 tracking-tight bg-clip-text text-transparent bg-gradient-to-br from-yellow-300 via-yellow-500 to-yellow-600 drop-shadow-lg relative">
                    PC COMPONENTS
                  </h1>
                </div>
                
                {/* Enhanced animated divider */}
                <div className="relative h-2.5 w-40 mx-auto mb-10">
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-300 to-yellow-600 rounded-full shadow-lg shadow-yellow-500/30"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-yellow-400/80 to-yellow-400/0 rounded-full blur-md animate-shimmer-slow"></div>
                  {/* Pulsing dot accents */}
                  <div className="absolute -left-1 -top-1 w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse-slow"></div>
                  <div className="absolute -right-1 -top-1 w-4 h-4 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/50 animate-pulse-slow delay-500"></div>
                </div>
                
                {/* Enhanced description with animated reveal */}
                <div className="overflow-hidden">
                  <p className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed animate-fade-in-slow">
                    Build your dream PC with our premium components. Use our advanced filters to find 
                    exactly what you need for your perfect high-performance setup.
                    <span className="block mt-3 text-yellow-400/80 font-medium">Upgrade your experience. Elevate your performance.</span>
                  </p>
                </div>
              </div>
              
              {/* Animated corner accents */}
              <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-yellow-400/40 rounded-tl-xl"></div>
              <div className="absolute top-0 right-0 w-16 h-16 border-t-2 border-r-2 border-yellow-400/40 rounded-tr-xl"></div>
              <div className="absolute bottom-0 left-0 w-16 h-16 border-b-2 border-l-2 border-yellow-400/40 rounded-bl-xl"></div>
              <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-yellow-400/40 rounded-br-xl"></div>
            </div>
            
            {/* Enhanced Controls with advanced styling */}
            <div className="flex flex-col md:flex-row items-center justify-between mb-10 gap-4 bg-gradient-to-r from-black/80 to-black/60 backdrop-blur-md p-5 rounded-xl border border-yellow-400/20 shadow-lg relative overflow-hidden">
              {/* Background effects */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Animated light scan effect */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-transparent via-yellow-400/40 to-transparent -skew-x-12 -translate-x-full animate-[scan_8s_linear_infinite]"></div>
                </div>
                
                {/* Corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16">
                  <div className="absolute top-0 left-0 w-full h-full border-t-2 border-l-2 border-yellow-400/30 rounded-tl-lg"></div>
                </div>
                <div className="absolute bottom-0 right-0 w-16 h-16">
                  <div className="absolute bottom-0 right-0 w-full h-full border-b-2 border-r-2 border-yellow-400/30 rounded-br-lg"></div>
                </div>
              </div>
              
              <div className="flex flex-wrap items-center gap-2 md:gap-4 relative z-10">
                {/* Enhanced results badge */}
                <Badge className="py-2 px-4 bg-gradient-to-r from-yellow-400/30 to-yellow-500/20 text-yellow-400 border-yellow-400/30 font-medium text-sm shadow-sm">
                  <div className="w-2 h-2 rounded-full bg-yellow-400 mr-2 animate-pulse"></div>
                  {sortedProducts.length} products found
                </Badge>
                
                {/* Active filter badges with enhanced styling */}
                {(selectedCategory || selectedBrand || searchTerm || (priceRange.min > 0 || priceRange.max < 10000)) && (
                  <div className="flex flex-wrap items-center gap-2">
                    {selectedCategory && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-3.5 py-2 flex items-center gap-1.5 font-medium animate-fade-in rounded-lg shadow-sm hover:bg-yellow-400/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedCategory("")}
                      >
                        <Package className="w-3 h-3" />
                        {selectedCategory}
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-yellow-400/20 hover:bg-yellow-400/40 transition-colors ml-1">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7M1 7L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                      </Badge>
                    )}
                    
                    {selectedBrand && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-3.5 py-2 flex items-center gap-1.5 font-medium animate-fade-in rounded-lg shadow-sm hover:bg-yellow-400/30 transition-colors cursor-pointer"
                        onClick={() => setSelectedBrand("")}
                      >
                        <SlidersHorizontal className="w-3 h-3" />
                        {selectedBrand}
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-yellow-400/20 hover:bg-yellow-400/40 transition-colors ml-1">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7M1 7L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                      </Badge>
                    )}
                    
                    {(priceRange.min > 0 || priceRange.max < 10000) && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-3.5 py-2 flex items-center gap-1.5 font-medium animate-fade-in rounded-lg shadow-sm hover:bg-yellow-400/30 transition-colors cursor-pointer"
                        onClick={() => setPriceRange({ min: 0, max: 10000 })}
                      >
                        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 6V18M18 12H6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z" stroke="currentColor" strokeWidth="2" />
                        </svg>
                        ${priceRange.min} - ${priceRange.max}
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-yellow-400/20 hover:bg-yellow-400/40 transition-colors ml-1">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7M1 7L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                      </Badge>
                    )}
                    
                    {searchTerm && (
                      <Badge 
                        variant="secondary" 
                        className="text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-3.5 py-2 flex items-center gap-1.5 font-medium animate-fade-in rounded-lg shadow-sm hover:bg-yellow-400/30 transition-colors cursor-pointer"
                        onClick={() => setSearchTerm("")}
                      >
                        <Search className="w-3 h-3" />
                        "{searchTerm}"
                        <span className="w-3.5 h-3.5 rounded-full flex items-center justify-center bg-yellow-400/20 hover:bg-yellow-400/40 transition-colors ml-1">
                          <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M1 1L7 7M1 7L7 1" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>
                        </span>
                      </Badge>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex items-center gap-4 relative z-10">
                {/* Enhanced Sort dropdown */}
                <div className="relative group">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none bg-gradient-to-r from-black/70 to-black/60 border border-yellow-400/30 text-white rounded-lg pl-8 pr-10 py-2.5 text-sm font-medium focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400/60 transition-all hover:border-yellow-400/50 cursor-pointer shadow-sm"
                  >
                    <option value="name">Name A-Z</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                  </select>
                  
                  {/* Custom dropdown icon */}
                  <div className="absolute left-2.5 top-1/2 transform -translate-y-1/2">
                    <svg className="w-4 h-4 text-yellow-400 opacity-80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M3 7H21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M6 12H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                      <path d="M9 17H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </div>
                  
                  <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-yellow-400 pointer-events-none group-hover:text-yellow-300 transition-colors" />
                  
                  {/* Focus highlight effect */}
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-yellow-400 group-focus-within:w-[calc(100%-12px)] transition-all duration-300"></div>
                </div>
                
                {/* Enhanced View Mode Toggle */}
                <div className="flex items-center border border-yellow-400/40 rounded-lg overflow-hidden shadow-md bg-gradient-to-r from-black/70 to-black/60">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className={`rounded-r-none px-4 py-2.5 transition-all duration-300 relative overflow-hidden ${
                      viewMode === "grid"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 font-medium"
                        : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
                    }`}
                  >
                    <Grid3X3 className="w-4 h-4" />
                    {viewMode === "grid" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 transform -skew-x-12 -translate-x-full animate-[shimmer_2s_linear_infinite]"></div>
                    )}
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className={`rounded-l-none px-4 py-2.5 transition-all duration-300 relative overflow-hidden ${
                      viewMode === "list"
                        ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 font-medium"
                        : "text-white hover:text-yellow-400 hover:bg-yellow-400/10"
                    }`}
                  >
                    <List className="w-4 h-4" />
                    {viewMode === "list" && (
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 transform -skew-x-12 -translate-x-full animate-[shimmer_2s_linear_infinite]"></div>
                    )}
                  </Button>
                </div>
              </div>
            </div>
            {/* Enhanced Products Grid/List with advanced animations */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                {/* Enhanced loading animation with circuit pattern */}
                <div className="relative mb-10">
                  {/* Circuit board-like pattern background */}
                  <div className="absolute -inset-12 rounded-full opacity-30">
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiB2aWV3Qm94PSIwIDAgMTAwIDEwMCI+PHBhdGggZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDI1NSwgMjE1LCAwLCAwLjMpIiBzdHJva2Utd2lkdGg9IjAuNSIgZD0iTTEwIDEwSDkwVjkwSDEwek01MCAxMHY4ME0xMCA1MGg4ME0zMCAxMHY4ME0xMCAzMGg4ME03MCAxMHY4ME0xMCA3MGg4MCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNTAiIHI9IjMiIGZpbGw9InJnYmEoMjU1LCAyMTUsIDAsIDAuMykiLz48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSIzIiBmaWxsPSJyZ2JhKDI1NSwgMjE1LCAwLCAwLjMpIi8+PGNpcmNsZSBjeD0iNzAiIGN5PSI3MCIgcj0iMyIgZmlsbD0icmdiYSgyNTUsIDIxNSwgMCwgMC4zKSIvPjxjaXJjbGUgY3g9IjMwIiBjeT0iNzAiIHI9IjMiIGZpbGw9InJnYmEoMjU1LCAyMTUsIDAsIDAuMykiLz48Y2lyY2xlIGN4PSI3MCIgY3k9IjMwIiByPSIzIiBmaWxsPSJyZ2JhKDI1NSwgMjE1LCAwLCAwLjMpIi8+PC9zdmc+')]"></div>
                  </div>
                  
                  {/* Multiple concentric animated rings */}
                  <div className="absolute inset-0 rounded-full border-4 border-yellow-400/10 animate-ping-slow"></div>
                  <div className="absolute -inset-4 rounded-full border-4 border-yellow-400/5 animate-ping-slower"></div>
                  <div className="absolute -inset-8 rounded-full border-4 border-yellow-400/5 animate-pulse-slow opacity-30"></div>
                  
                  {/* Enhanced spinning loader with gradient */}
                  <div className="relative z-10 w-20 h-20 flex items-center justify-center">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-yellow-400/20 to-yellow-600/20 animate-pulse-slow"></div>
                    <svg className="w-20 h-20 animate-spin" viewBox="0 0 50 50">
                      <circle cx="25" cy="25" r="20" fill="none" stroke="rgba(255, 215, 0, 0.1)" strokeWidth="4" />
                      <circle cx="25" cy="25" r="20" fill="none" stroke="#ffd700" strokeWidth="4" strokeDasharray="60, 125" strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center">
                        <Loader2 className="w-6 h-6 text-yellow-400" />
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Enhanced loading text with typewriter effect */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 inline-block">
                    Loading premium components...
                  </h3>
                  <p className="text-gray-400 animate-pulse">Finding the best hardware for your setup</p>
                  
                  {/* Loading progress bar */}
                  <div className="w-48 h-1 bg-yellow-400/20 rounded-full mt-4 mx-auto overflow-hidden">
                    <div className="h-full w-1/3 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-full animate-[loadingProgress_1.5s_ease-in-out_infinite_alternate]"></div>
                  </div>
                </div>
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-32 max-w-xl mx-auto">
                {/* Enhanced empty state with advanced styling */}
                <div className="relative">
                  <div className="absolute inset-0 -z-10">
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-yellow-400/5 blur-3xl"></div>
                  </div>
                  
                  <div className="bg-gradient-to-b from-yellow-400/20 to-yellow-400/5 w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-10 shadow-inner shadow-yellow-400/10 border border-yellow-400/30 relative">
                    <Package className="w-12 h-12 text-yellow-400/80" />
                    {/* Animated orbit effect */}
                    <div className="absolute inset-0 border-2 border-dashed border-yellow-400/20 rounded-full animate-spin-slow"></div>
                    <div className="absolute top-0 -right-1 w-3 h-3 rounded-full bg-yellow-400/60 shadow-lg shadow-yellow-400/30 animate-pulse-slow"></div>
                  </div>
                  
                  <h3 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 to-yellow-500 mb-4">No products found</h3>
                  <p className="text-lg text-gray-300 mb-8 max-w-md mx-auto">
                    We couldn't find any products matching your current filters. Try adjusting your search criteria or clearing all filters.
                  </p>
                  
                  <Button 
                    onClick={clearFilters} 
                    className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black rounded-lg font-semibold px-10 py-6 shadow-lg shadow-yellow-400/20 relative overflow-hidden group"
                  >
                    {/* Animated shine effect */}
                    <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                    
                    <span className="relative flex items-center">
                      <Filter className="w-5 h-5 mr-3" />
                      Reset All Filters
                    </span>
                  </Button>
                </div>
              </div>
            ) : (
              <>
                {/* Enhanced product grid with animation effects */}
                <div 
                  className={
                    viewMode === "grid" 
                      ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
                      : "space-y-6"
                  }
                  style={{
                    perspective: '1000px'
                  }}
                >
                  {sortedProducts.map((product, index) => (
                    <div 
                      key={product.id}
                      className="transform transition-all duration-500"
                      style={{ 
                        opacity: 0,
                        transform: 'translateY(20px) scale(0.95)',
                        animation: `fadeInUp 0.6s ease-out ${index * 0.08}s forwards`
                      }}
                    >
                      <style jsx>{`
                        @keyframes fadeInUp {
                          from {
                            opacity: 0;
                            transform: translateY(20px) scale(0.95);
                          }
                          to {
                            opacity: 1;
                            transform: translateY(0) scale(1);
                          }
                        }
                      `}</style>
                      
                      <ProductCard 
                        product={product} 
                        variant={viewMode === "list" ? "compact" : "default"}
                      />
                    </div>
                  ))}
                </div>
                
                {/* Enhanced Pagination with advanced styling */}
                {totalPages > 1 && (
                  <div className="flex flex-col items-center justify-center space-y-4 mt-16 pt-10 relative">
                    {/* Decorative pagination background */}
                    <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent"></div>
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-8 h-8">
                      <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/30 to-yellow-500/30 rounded-full animate-pulse-slow"></div>
                      <div className="absolute inset-1 bg-black rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 rounded-full bg-yellow-400 animate-pulse"></div>
                      </div>
                    </div>
                    
                    {/* Page info */}
                    <div className="text-yellow-400/80 text-sm font-medium">
                      Page {currentPage} of {totalPages}
                    </div>
                    
                    <div className="flex justify-center items-center space-x-3">
                      {/* Previous button with enhanced styling */}
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                        disabled={currentPage === 1}
                        className="border-yellow-400/30 text-white hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/70 disabled:opacity-50 disabled:pointer-events-none rounded-xl font-medium px-6 py-3 transition-all group"
                      >
                        <div className="flex items-center">
                          <div className="relative mr-2 w-5 h-5 flex items-center justify-center">
                            <ChevronDown className="w-5 h-5 rotate-90 transform group-hover:-translate-x-1 transition-transform" />
                          </div>
                          Previous
                        </div>
                        
                        {/* Button shine effect */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      </Button>
                      
                      {/* Page numbers with enhanced styling */}
                      <div className="flex items-center space-x-2">
                        {[...Array(Math.min(5, totalPages))].map((_, i) => {
                          const page = i + 1;
                          const isCurrentPage = currentPage === page;
                          
                          return (
                            <Button
                              key={page}
                              variant={isCurrentPage ? "default" : "outline"}
                              onClick={() => setCurrentPage(page)}
                              className={`w-12 h-12 rounded-xl font-bold transition-all duration-300 relative overflow-hidden ${
                                isCurrentPage
                                  ? "bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-300 hover:to-yellow-400 shadow-lg shadow-yellow-400/20 scale-110"
                                  : "border-yellow-400/30 text-white hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/70"
                              }`}
                            >
                              {page}
                              
                              {/* Current page indicator dot */}
                              {isCurrentPage && (
                                <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-black rounded-full"></div>
                              )}
                              
                              {/* Animated glow effect for current page */}
                              {isCurrentPage && (
                                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 transform -skew-x-12 -translate-x-full animate-[shimmer_2s_linear_infinite]"></div>
                              )}
                            </Button>
                          );
                        })}
                      </div>
                      
                      {/* Next button with enhanced styling */}
                      <Button
                        variant="outline"
                        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                        disabled={currentPage === totalPages}
                        className="border-yellow-400/30 text-white hover:bg-yellow-400/10 hover:text-yellow-400 hover:border-yellow-400/70 disabled:opacity-50 disabled:pointer-events-none rounded-xl font-medium px-6 py-3 transition-all group"
                      >
                        <div className="flex items-center">
                          Next
                          <div className="relative ml-2 w-5 h-5 flex items-center justify-center">
                            <ChevronDown className="w-5 h-5 -rotate-90 transform group-hover:translate-x-1 transition-transform" />
                          </div>
                        </div>
                        
                        {/* Button shine effect */}
                        <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400/0 via-yellow-400/10 to-yellow-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
                      </Button>
                    </div>
                    
                    {/* Jump to page */}
                    {totalPages > 5 && (
                      <div className="flex items-center space-x-4 pt-2">
                        <span className="text-sm text-gray-400">Jump to page:</span>
                        <div className="relative w-16">
                          <input 
                            type="number" 
                            min="1"
                            max={totalPages}
                            value={currentPage}
                            onChange={(e) => {
                              const value = parseInt(e.target.value);
                              if (value >= 1 && value <= totalPages) {
                                setCurrentPage(value);
                              }
                            }}
                            className="w-full py-1 px-2 bg-black/60 border border-yellow-400/30 rounded-md text-white text-sm text-center focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Back to top button */}
                <div className="flex justify-center mt-16">
                  <Button
                    variant="ghost"
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="text-gray-400 hover:text-yellow-400 hover:bg-yellow-400/5 rounded-full w-12 h-12 flex items-center justify-center group transition-all duration-300"
                  >
                    <svg 
                      width="24" 
                      height="24" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      className="transform rotate-180 group-hover:-translate-y-1 transition-transform"
                    >
                      <path 
                        d="M12 5V19M12 19L19 12M12 19L5 12" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        strokeLinecap="round" 
                        strokeLinejoin="round"
                      />
                    </svg>
                  </Button>
                </div>
              </>
            )}
          </main>
        </div>
      </div>
      <Footer />
    </>
  );
}
