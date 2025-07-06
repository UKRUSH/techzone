"use client";

import { memo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, ShoppingCart, Package } from "lucide-react";

// Super-fast product card with zero loading time
const SuperFastProductCard = memo(function SuperFastProductCard({ product }) {
  // Instant placeholder image with CSS gradient
  const placeholderStyle = {
    background: `linear-gradient(135deg, 
      ${product.category === 'gpu' ? '#3b82f6, #8b5cf6' : 
        product.category === 'cpu' ? '#ef4444, #f97316' :
        product.category === 'storage' ? '#10b981, #06b6d4' :
        product.category === 'memory' ? '#8b5cf6, #ec4899' :
        product.category === 'motherboard' ? '#f59e0b, #ef4444' :
        '#6b7280, #4b5563'})`,
  };

  return (
    <Card className="group bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/30 hover:border-yellow-400/60 transition-all duration-150 cursor-pointer h-full">
      <CardHeader className="pb-2">
        {/* Instant visual placeholder - no image loading delay */}
        <div 
          className="aspect-square rounded-lg mb-3 flex items-center justify-center relative overflow-hidden"
          style={placeholderStyle}
        >
          <Package className="w-12 h-12 text-white/80" />
          
          {/* Category badge */}
          <div className="absolute top-2 left-2">
            <Badge variant="secondary" className="bg-black/50 text-white border-white/20 text-xs">
              {product.category.toUpperCase()}
            </Badge>
          </div>
          
          {/* Stock badge */}
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-green-500/80 text-white border-green-400/30 text-xs">
              In Stock
            </Badge>
          </div>
          
          {/* Price overlay for quick scanning */}
          <div className="absolute bottom-2 right-2 bg-black/70 rounded px-2 py-1">
            <span className="text-yellow-400 font-bold text-sm">${product.price}</span>
          </div>
        </div>
        
        <CardTitle className="text-white group-hover:text-yellow-400 transition-colors text-lg leading-tight">
          {product.name}
        </CardTitle>
      </CardHeader>
      
      <CardContent className="pt-0">
        {/* Instant rating display */}
        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star 
              key={i} 
              className={`w-4 h-4 ${i < product.rating ? 'text-yellow-400 fill-current' : 'text-gray-600'}`} 
            />
          ))}
          <span className="ml-2 text-gray-400 text-sm">({product.rating})</span>
        </div>
        
        {/* Brand and price info */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="text-2xl font-bold text-yellow-400">${product.price}</div>
            <div className="text-xs text-gray-500 uppercase tracking-wide font-medium">
              {product.brand}
            </div>
          </div>
        </div>

        {/* Instant action button */}
        <Button 
          className="w-full bg-yellow-400 hover:bg-yellow-300 text-black font-semibold transition-colors duration-150"
          size="sm"
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          Add to Cart
        </Button>
      </CardContent>
    </Card>
  );
});

export default SuperFastProductCard;
