"use client";

import { useState } from "react";
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

export default function ProductCard({ product, variant = "default" }) {
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

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

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const variantId = primaryVariant?.id || product.id;
      if (!variantId) {
        console.error('No variant ID available');
        toast.error('Unable to add product to cart');
        return;
      }

      const result = await addToCart(variantId, 1);
      
      if (result.success) {
        toast.success('Product added to cart successfully!');
      } else {
        toast.error(result.error || 'Failed to add product to cart');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleWishlist = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    try {
      setIsWishlisted(!isWishlisted);
      // You would implement wishlist API call here
      console.log("Toggle wishlist:", product.id);
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setIsWishlisted(isWishlisted); // Revert on error
    }
  };

  if (variant === "compact") {
    return (
      <Link href={`/products/${product.id}`}>
        <Card className="group cursor-pointer bg-black/90 border-yellow-400/20 hover:border-yellow-400/60 hover:shadow-lg hover:shadow-yellow-400/10 transition-all duration-300 h-full">
          <CardContent className="p-4">
            <div className="flex items-center space-x-4">
              <div className="relative w-16 h-16 flex-shrink-0">
                <Image
                  src={primaryImage}
                  alt={product.name}
                  fill
                  className="object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-white truncate group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-400 truncate">{product.brand?.name}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-lg font-bold text-primary">
                    ${price.toFixed(2)}
                  </span>
                  {compareAtPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/products/${product.id}`}>
      <Card className="group cursor-pointer bg-black/80 border-yellow-400/20 hover:border-yellow-400/60 hover:shadow-xl hover:shadow-yellow-400/20 transition-all duration-300 hover:scale-105 h-full overflow-hidden relative">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-yellow-950/30 -z-10 opacity-70"></div>
        
        {/* Yellow corner accent */}
        <div className="absolute -top-10 -right-10 w-20 h-20 bg-yellow-400/20 rounded-full blur-xl"></div>
        
        {/* Animated top border */}
        <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-yellow-400 to-yellow-600 transform scale-x-0 group-hover:scale-x-100 transition-transform origin-left duration-500"></div>
        
        <div className="relative">
          <div className="aspect-square overflow-hidden">
            <Image
              src={primaryImage}
              alt={product.name}
              width={400}
              height={400}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            
            {/* Image overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </div>
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {discountPercentage > 0 && (
              <Badge className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black font-semibold px-2.5 py-1 shadow-md shadow-black/30 animate-pulse-slow">
                -{discountPercentage}%
              </Badge>
            )}
            {product.totalStock > 0 && product.totalStock <= 5 && (
              <Badge variant="outline" className="border-yellow-400 text-yellow-400 bg-black/80 backdrop-blur-sm px-2.5 py-1 shadow-md shadow-black/30">
                <Zap className="w-3 h-3 mr-1 animate-pulse-slow" />
                Low Stock
              </Badge>
            )}
            {product.totalStock === 0 && (
              <Badge variant="outline" className="border-red-500 text-red-500 bg-black/80 backdrop-blur-sm px-2.5 py-1 shadow-md shadow-black/30">
                <Package className="w-3 h-3 mr-1" />
                Out of Stock
              </Badge>
            )}
          </div>

          {/* Quick Actions */}
          <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
            <Button
              size="sm"
              variant="outline"
              className="bg-black/80 backdrop-blur-sm border-yellow-400/30 hover:bg-yellow-400/10 hover:border-yellow-400 rounded-full w-9 h-9 p-0 shadow-md shadow-black/30"
              onClick={handleToggleWishlist}
            >
              <Heart 
                className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'fill-red-500 text-red-500 scale-110' : 'text-white'}`} 
              />
            </Button>
          </div>
        </div>

        <CardContent className="p-5 flex-1 relative">
          <div className="space-y-3">
            <Badge variant="secondary" className="text-xs bg-yellow-400/20 text-yellow-400 border-yellow-400/30 px-2.5 py-1">
              {product.category?.name}
            </Badge>
            
            <h3 className="font-semibold text-lg text-white line-clamp-2 group-hover:text-yellow-400 transition-colors">
              {product.name}
            </h3>
            
            <p className="text-sm text-gray-300 flex items-center gap-1">
              <span className="inline-block w-2 h-2 rounded-full bg-yellow-400/80"></span>
              {product.brand?.name}
            </p>
            
            {/* Rating */}
            {product.averageRating > 0 && (
              <div className="flex items-center space-x-1">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm text-gray-400">
                  ({product.reviewCount || 0})
                </span>
              </div>
            )}

            {/* Features (first 2) */}
            {product.features && product.features.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.features.slice(0, 2).map((feature, index) => (
                  <Badge 
                    key={index} 
                    variant="outline" 
                    className="text-xs border-yellow-400/20 bg-black/50 text-gray-300 px-2 py-0.5"
                  >
                    <Shield className="w-3 h-3 mr-1 text-yellow-400/80" />
                    {feature}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0">
          <div className="w-full space-y-3">
            {/* Price */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xl font-bold text-yellow-400">
                    ${price.toFixed(2)}
                  </span>
                  {compareAtPrice && (
                    <span className="text-sm text-gray-500 line-through">
                      ${compareAtPrice.toFixed(2)}
                    </span>
                  )}
                </div>
                {product.totalStock > 0 && (
                  <p className="text-xs text-gray-400">
                    {product.totalStock} in stock
                  </p>
                )}
              </div>
            </div>

            {/* Add to Cart Button */}
            <Button
              className={`w-full font-semibold transition-all duration-300 ${
                product.totalStock === 0
                  ? "bg-gray-800 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-300 hover:to-yellow-400 text-black shadow-lg shadow-yellow-400/10 hover:shadow-yellow-400/20"
              }`}
              onClick={handleAddToCart}
              disabled={isLoading || product.totalStock === 0}
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-black border-t-transparent mr-2"></div>
                  Adding...
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {product.totalStock === 0 ? 'Out of Stock' : 'Add to Cart'}
                </>
              )}
              
              {/* Button shine effect */}
              {product.totalStock > 0 && (
                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-yellow-400/0 via-white/20 to-yellow-400/0 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></span>
              )}
            </Button>
          </div>
        </CardFooter>
        
        {/* Bottom glowing edge */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </Card>
    </Link>
  );
}
