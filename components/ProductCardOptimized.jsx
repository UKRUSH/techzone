"use client";

import { useState, memo, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  ShoppingCart, 
  Star, 
  Package,
  Zap,
  Shield
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import { useInView } from "react-intersection-observer";

// Memoized ProductCard for better performance
const ProductCard = memo(function ProductCard({ product, variant = "default", priority = false }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  // Intersection observer for lazy loading
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    rootMargin: '100px 0px' // Start loading 100px before element comes into view
  });

  // Get the primary variant for pricing
  const primaryVariant = product.variants?.[0];
  const price = primaryVariant?.price || product.price || 0;
  const compareAtPrice = primaryVariant?.compareAtPrice || product.originalPrice;

  // Calculate discount percentage
  const discountPercentage = compareAtPrice 
    ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100)
    : 0;

  // Get primary image
  const primaryImage = product.images?.[0]?.url || product.image || "/placeholder-product.jpg";

  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await addToCart({
        productId: product.id,
        variantId: primaryVariant?.id,
        quantity: 1
      });
      
      toast({
        title: "Added to cart",
        description: `${product.name} has been added to your cart.`,
        variant: "success"
      });
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast({
        title: "Error",
        description: "Failed to add item to cart. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  }, [session, router, addToCart, product.id, product.name, primaryVariant?.id]);

  const handleWishlist = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    setIsWishlisted(!isWishlisted);
    
    toast({
      title: isWishlisted ? "Removed from wishlist" : "Added to wishlist",
      description: `${product.name} has been ${isWishlisted ? 'removed from' : 'added to'} your wishlist.`,
      variant: "success"
    });
  }, [session, router, isWishlisted, product.name]);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  };

  const CardWrapper = variant === "simple" ? "div" : Card;

  return (
    <div ref={ref} className={`group relative ${variant === "simple" ? "bg-transparent" : ""}`}>
      <CardWrapper className={`
        relative overflow-hidden transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl
        ${variant === "simple" 
          ? "bg-transparent border-0 shadow-none" 
          : "bg-gradient-to-br from-black/90 via-zinc-900 to-black/95 border-yellow-400/20 hover:border-yellow-400/40"
        }
        backdrop-blur-sm
      `}>
        
        {/* Product Link */}
        <Link href={`/products/${product.id}`} className="block">
          
          {/* Image Container with Lazy Loading */}
          <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-zinc-800 to-zinc-900">
            
            {/* Discount Badge */}
            {discountPercentage > 0 && (
              <Badge className="absolute top-3 left-3 z-10 bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
                -{discountPercentage}%
              </Badge>
            )}
            
            {/* Wishlist Button */}
            <Button
              size="icon"
              variant="ghost"
              className="absolute top-3 right-3 z-10 bg-black/50 hover:bg-black/70 text-white border-0 backdrop-blur-sm"
              onClick={handleWishlist}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            
            {/* Image with lazy loading */}
            {(inView || priority) && (
              <div className="relative w-full h-full">
                {!imageLoaded && (
                  <div className="absolute inset-0 bg-gradient-to-br from-zinc-700 to-zinc-800 animate-pulse flex items-center justify-center">
                    <Package className="w-12 h-12 text-zinc-500" />
                  </div>
                )}
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                    imageLoaded ? 'opacity-100' : 'opacity-0'
                  }`}
                  priority={priority}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  onLoad={() => setImageLoaded(true)}
                  onError={() => setImageLoaded(true)}
                />
              </div>
            )}
            
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            
            {/* Quick Action Buttons */}
            <div className="absolute bottom-4 left-4 right-4 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                onClick={handleAddToCart}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 border-0 shadow-lg font-semibold"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                    Adding...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <ShoppingCart className="w-4 h-4" />
                    Add to Cart
                  </div>
                )}
              </Button>
            </div>
          </div>
          
          {/* Product Details */}
          <CardContent className={`p-4 ${variant === "simple" ? "px-0" : ""}`}>
            
            {/* Brand */}
            {product.brand && (
              <Badge variant="outline" className="mb-2 text-xs border-yellow-400/30 text-yellow-400">
                {product.brand.name}
              </Badge>
            )}
            
            {/* Product Name */}
            <h3 className="font-semibold text-white mb-2 line-clamp-2 group-hover:text-yellow-400 transition-colors">
              {product.name}
            </h3>
            
            {/* Category */}
            {product.category && (
              <p className="text-xs text-zinc-400 mb-2">
                {product.category.name}
              </p>
            )}
            
            {/* Rating (if available) */}
            {product.averageRating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs text-zinc-400">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}
            
            {/* Description (if variant is not simple) */}
            {variant !== "simple" && product.description && (
              <p className="text-sm text-zinc-400 line-clamp-2 mb-3">
                {product.description}
              </p>
            )}
            
            {/* Price */}
            <div className="flex items-center gap-2 mb-3">
              <span className="text-lg font-bold text-yellow-400">
                {formatPrice(price)}
              </span>
              {compareAtPrice && (
                <span className="text-sm text-zinc-500 line-through">
                  {formatPrice(compareAtPrice)}
                </span>
              )}
            </div>
            
            {/* Key Features */}
            {product.features && (
              <div className="flex flex-wrap gap-1">
                {product.features.slice(0, 2).map((feature, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="text-xs bg-zinc-800 text-zinc-300 border-0"
                  >
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
            
          </CardContent>
          
        </Link>
        
        {/* Footer Actions (for non-simple variant) */}
        {variant !== "simple" && (
          <CardFooter className="p-4 pt-0 flex gap-2">
            <Button
              onClick={handleAddToCart}
              disabled={isLoading}
              className="flex-1 bg-gradient-to-r from-yellow-400 to-yellow-500 text-black hover:from-yellow-500 hover:to-yellow-600 border-0 shadow-lg font-semibold"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  Adding...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </div>
              )}
            </Button>
          </CardFooter>
        )}
        
      </CardWrapper>
    </div>
  );
});

ProductCard.displayName = 'ProductCard';

export default ProductCard;
