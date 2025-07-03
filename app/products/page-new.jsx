"use client";

import { useState, useEffect } from "react";
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
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">PC Components</h1>
          <p className="text-gray-400">
            Build your dream PC with premium components
          </p>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <div className="w-64 space-y-6">
            {/* Search */}
            <Card className="bg-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Search</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-700 text-white"
                  />
                </div>
              </CardContent>
            </Card>

            {/* Categories */}
            <Card className="bg-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Categories</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedCategory === "" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedCategory("")}
                >
                  All Categories
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category.name}
                    variant={selectedCategory === category.name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedCategory(category.name)}
                  >
                    {category.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Brands */}
            <Card className="bg-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-white">Brands</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button
                  variant={selectedBrand === "" ? "default" : "ghost"}
                  className="w-full justify-start"
                  onClick={() => setSelectedBrand("")}
                >
                  All Brands
                </Button>
                {brands.map((brand) => (
                  <Button
                    key={brand.name}
                    variant={selectedBrand === brand.name ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setSelectedBrand(brand.name)}
                  >
                    {brand.name}
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full border-gray-700 text-gray-300 hover:bg-gray-800"
              onClick={clearFilters}
            >
              Clear Filters
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Controls */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <span className="text-gray-400">
                  {sortedProducts.length} products found
                </span>
                {(selectedCategory || selectedBrand || searchTerm) && (
                  <div className="flex items-center space-x-2">
                    {selectedCategory && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedCategory}
                      </Badge>
                    )}
                    {selectedBrand && (
                      <Badge variant="secondary" className="text-xs">
                        {selectedBrand}
                      </Badge>
                    )}
                  </div>
                )}
              </div>

              <div className="flex items-center space-x-4">
                {/* Sort */}
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="bg-gray-800 border border-gray-700 text-white rounded-md px-3 py-2 text-sm"
                >
                  <option value="name">Name A-Z</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Highest Rated</option>
                  <option value="newest">Newest</option>
                </select>

                {/* View Mode */}
                <div className="flex items-center border border-gray-700 rounded-md">
                  <Button
                    variant={viewMode === "grid" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("grid")}
                    className="rounded-r-none"
                  >
                    <Grid3X3 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === "list" ? "default" : "ghost"}
                    size="sm"
                    onClick={() => setViewMode("list")}
                    className="rounded-l-none"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products Grid/List */}
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-primary" />
              </div>
            ) : sortedProducts.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No products found</h3>
                <p className="text-gray-400 mb-4">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={clearFilters}>Clear Filters</Button>
              </div>
            ) : (
              <>
                <div className={
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                    : "space-y-4"
                }>
                  {sortedProducts.map((product) => (
                    <ProductCard 
                      key={product.id} 
                      product={product} 
                      variant={viewMode === "list" ? "compact" : "default"}
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2 mt-8">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Previous
                    </Button>
                    
                    <div className="flex items-center space-x-1">
                      {[...Array(Math.min(5, totalPages))].map((_, i) => {
                        const page = i + 1;
                        return (
                          <Button
                            key={page}
                            variant={currentPage === page ? "default" : "outline"}
                            onClick={() => setCurrentPage(page)}
                            className="w-10 h-10"
                          >
                            {page}
                          </Button>
                        );
                      })}
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className="border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
