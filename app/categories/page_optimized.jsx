"use client";

import { useQuery } from "@tanstack/react-query";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
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
  Loader2
} from "lucide-react";
import Link from "next/link";

// Icon mapping for categories
const categoryIcons = {
  "cpu": Cpu,
  "graphics cards": Monitor,
  "gpu": Monitor,
  "memory": MemoryStick,
  "ram": MemoryStick,
  "storage": HardDrive,
  "motherboards": Microchip,
  "motherboard": Microchip,
  "power supplies": Power,
  "psu": Power,
  "cooling": Fan,
};

// Fetch function for React Query
const fetchCategories = async () => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export default function CategoriesPage() {
  // Use React Query for optimized data fetching
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: fetchCategories,
    // Cache for 5 minutes
    staleTime: 5 * 60 * 1000,
  });

  // Get appropriate icon for category
  const getCategoryIcon = (categoryName) => {
    const iconKey = categoryName.toLowerCase();
    const IconComponent = categoryIcons[iconKey] || Package;
    return IconComponent;
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-primary mb-4">Product Categories</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Explore our comprehensive selection of PC components and hardware. 
              Find everything you need to build your dream computer.
            </p>
          </div>

          {/* Categories Grid */}
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading categories...</span>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-500 mb-4">Failed to load categories</p>
              <Button onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category, index) => {
                const IconComponent = getCategoryIcon(category.name);
                
                return (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Link href={`/products?category=${category.slug || category.name.toLowerCase()}`}>
                      <Card className="group hover:shadow-lg transition-all duration-300 cursor-pointer border-border hover:border-primary/50 bg-card">
                        <CardHeader className="text-center pb-4">
                          <div className="mx-auto mb-4 p-3 rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                          <CardTitle className="text-xl text-primary group-hover:text-primary/80 transition-colors">
                            {category.name}
                          </CardTitle>
                          {category.description && (
                            <CardDescription className="text-sm text-muted-foreground">
                              {category.description}
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent className="text-center">
                          <div className="flex items-center justify-between">
                            <Badge variant="secondary" className="bg-muted">
                              {category.productCount || category._count?.products || 0} Products
                            </Badge>
                            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  </motion.div>
                );
              })}
            </div>
          )}

          {/* Call to Action */}
          <div className="mt-16 text-center">
            <Card className="bg-card border-border">
              <CardContent className="py-12">
                <h3 className="text-2xl font-bold text-primary mb-4">
                  Need Help Choosing Components?
                </h3>
                <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                  Our PC Builder tool can help you select compatible components 
                  and create the perfect build for your needs and budget.
                </p>
                <Link href="/pc-builder">
                  <Button size="lg" className="bg-primary hover:bg-primary/90">
                    Try PC Builder
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
