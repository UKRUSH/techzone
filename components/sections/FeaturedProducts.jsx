"use client";

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Star, ArrowRight, Package } from "lucide-react";
import { FastLink } from "@/components/navigation/FastNavigation";
import { useInstantFeaturedProducts } from "@/lib/hooks/useInstantData";

const FeaturedProducts = memo(function FeaturedProducts() {
  // INSTANT featured products - zero loading time
  const { data: featuredProducts } = useInstantFeaturedProducts();

  return (
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
          {featuredProducts.map((product, index) => {
            // Dynamic gradient based on category
            const gradientStyle = {
              background: `linear-gradient(135deg, ${
                product.category === 'gpu' ? '#3b82f6, #8b5cf6' : 
                product.category === 'cpu' ? '#ef4444, #f97316' :
                product.category === 'storage' ? '#10b981, #06b6d4' :
                product.category === 'memory' ? '#8b5cf6, #ec4899' :
                '#6b7280, #4b5563'
              })`,
            };

            return (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-200 group h-full">
                  <CardHeader>
                    <div 
                      className="aspect-square rounded-lg mb-4 flex items-center justify-center relative"
                      style={gradientStyle}
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
                        Add to Cart
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
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
  );
});

export default FeaturedProducts;
