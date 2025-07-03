"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ShoppingCart, 
  Heart, 
  Share2, 
  Star, 
  Truck, 
  Shield, 
  ArrowLeft,
  Package,
  Zap,
  Check,
  AlertCircle
} from "lucide-react";
import { useCart } from "@/components/providers/CartProvider";
import { useSession } from "next-auth/react";
import { toast } from "@/components/ui/toast";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const { addToCart } = useCart();
  const { data: session } = useSession();

  useEffect(() => {
    if (params.id) {
      fetchProduct();
    }
  }, [params.id]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/products/${params.id}`);
      
      if (response.ok) {
        const data = await response.json();
        setProduct(data);
      } else if (response.status === 404) {
        router.push('/products');
      } else {
        console.error('Error fetching product');
        // Set mock data as fallback for demo
        setProduct(mockProduct);
      }
    } catch (error) {
      console.error('Error fetching product:', error);
      // Set mock data as fallback for demo
      setProduct(mockProduct);
    } finally {
      setLoading(false);
    }
  };

  // Mock product data for fallback
  const mockProduct = {
    id: params.id,
    name: "AMD Ryzen 9 7900X",
    description: "The AMD Ryzen™ 9 7900X processor delivers incredible performance for gaming and content creation with 12 cores and 24 processing threads.",
    category: { name: "CPU" },
    brand: { name: "AMD" },
    variants: [
      { 
        id: "1",
        sku: "AMD-7900X-001", 
        price: 599.99, 
        compareAtPrice: 699.99,
        attributes: { color: "Default" }
      }
    ],
    averageRating: 4.8,
    reviewCount: 247,
    totalStock: 45,
    images: [
      { url: "/api/placeholder/600/600", altText: "AMD Ryzen 9 7900X" },
      { url: "/api/placeholder/600/600", altText: "AMD Ryzen 9 7900X Side View" }
    ],
    features: [
      "12 Cores, 24 Threads",
      "Base Clock: 4.7 GHz, Max Boost: 5.6 GHz",
      "AM5 Socket",
      "105W TDP",
      "PCIe 5.0 Support",
      "DDR5 Memory Support"
    ],
    specifications: {
      "Cores": "12",
      "Threads": "24",
      "Base Clock": "4.7 GHz",
      "Max Boost Clock": "5.6 GHz",
      "Socket": "AM5",
      "TDP": "105W",
      "Memory Support": "DDR5-5200",
      "PCIe Support": "PCIe 5.0"
    },
    reviews: []
  };

  const handleAddToCart = async () => {
    if (!session) {
      router.push('/auth/signin');
      return;
    }
    
    setIsAddingToCart(true);
    try {
      const variantId = product.variants[selectedVariant].id;
      const result = await addToCart(variantId, quantity);
      
      if (result.success) {
        toast.success(`Added ${quantity} item(s) to cart successfully!`);
      } else {
        toast.error(result.error || 'Failed to add item to cart');
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
    } finally {
      setIsAddingToCart(false);
    }
  };

  const handleToggleWishlist = async () => {
    try {
      setIsWishlisted(!isWishlisted);
      // You would implement wishlist API call here
    } catch (error) {
      console.error("Error toggling wishlist:", error);
      setIsWishlisted(isWishlisted); // Revert on error
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Product Not Found</h1>
            <p className="text-gray-400 mb-6">The product you're looking for doesn't exist.</p>
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const currentVariant = product.variants[selectedVariant];
  const discountPercentage = currentVariant.compareAtPrice 
    ? Math.round(((currentVariant.compareAtPrice - currentVariant.price) / currentVariant.compareAtPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 text-sm text-gray-400 mb-8">
          <Link href="/" className="hover:text-primary">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-primary">Products</Link>
          <span>/</span>
          <Link href={`/products?category=${product.category.name}`} className="hover:text-primary">
            {product.category.name}
          </Link>
          <span>/</span>
          <span className="text-white">{product.name}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images */}
          <div className="space-y-4">
            <div className="aspect-square overflow-hidden rounded-lg bg-gray-800">
              <Image
                src={product.images[0]?.url || "/api/placeholder/600/600"}
                alt={product.images[0]?.altText || product.name}
                width={600}
                height={600}
                className="w-full h-full object-cover"
              />
            </div>
            
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square overflow-hidden rounded-lg bg-gray-800 cursor-pointer opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.name}
                      width={150}
                      height={150}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <div className="flex items-center space-x-2 mb-2">
                <Badge variant="secondary">{product.category.name}</Badge>
                <Badge variant="outline" className="border-gray-700 text-gray-300">
                  {product.brand.name}
                </Badge>
              </div>
              
              <h1 className="text-3xl font-bold text-white mb-4">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < Math.floor(product.averageRating)
                          ? 'text-primary fill-primary'
                          : 'text-gray-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-white font-medium">
                  {product.averageRating.toFixed(1)}
                </span>
                <span className="text-gray-400">
                  ({product.reviewCount} reviews)
                </span>
              </div>
            </div>

            {/* Price */}
            <div className="space-y-2">
              <div className="flex items-center space-x-4">
                <span className="text-3xl font-bold text-primary">
                  ${currentVariant.price.toFixed(2)}
                </span>
                {currentVariant.compareAtPrice && (
                  <>
                    <span className="text-xl text-gray-500 line-through">
                      ${currentVariant.compareAtPrice.toFixed(2)}
                    </span>
                    <Badge className="bg-red-600 hover:bg-red-600">
                      -{discountPercentage}%
                    </Badge>
                  </>
                )}
              </div>
              
              {/* Stock Status */}
              <div className="flex items-center space-x-2">
                {product.totalStock > 0 ? (
                  <>
                    <Check className="w-4 h-4 text-green-500" />
                    <span className="text-green-500">
                      In Stock ({product.totalStock} available)
                    </span>
                  </>
                ) : (
                  <>
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span className="text-red-500">Out of Stock</span>
                  </>
                )}
              </div>
            </div>

            {/* Quantity & Add to Cart */}
            <div className="space-y-4">
              <div className="flex items-center space-x-4">
                <label className="text-white font-medium">Quantity:</label>
                <div className="flex items-center border border-gray-700 rounded-md">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-2 text-white hover:bg-gray-800"
                    disabled={quantity <= 1}
                  >
                    -
                  </button>
                  <span className="px-4 py-2 text-white bg-gray-800 min-w-[60px] text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(Math.min(product.totalStock, quantity + 1))}
                    className="px-3 py-2 text-white hover:bg-gray-800"
                    disabled={quantity >= product.totalStock}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="flex space-x-4">
                <Button
                  className="flex-1 bg-primary hover:bg-primary/90 text-black font-semibold"
                  onClick={handleAddToCart}
                  disabled={isAddingToCart || product.totalStock === 0}
                >
                  {isAddingToCart ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black mr-2"></div>
                      Adding...
                    </>
                  ) : (
                    <>
                      <ShoppingCart className="w-4 h-4 mr-2" />
                      Add to Cart
                    </>
                  )}
                </Button>
                
                <Button
                  variant="outline"
                  onClick={handleToggleWishlist}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Heart 
                    className={`w-4 h-4 ${isWishlisted ? 'fill-red-500 text-red-500' : ''}`} 
                  />
                </Button>
                
                <Button
                  variant="outline"
                  className="border-gray-700 text-gray-300 hover:bg-gray-800"
                >
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Features */}
            <Card className="bg-card border-gray-800">
              <CardHeader className="pb-3">
                <CardTitle className="text-white">Key Features</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-2">
                  {product.features.map((feature, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Zap className="w-4 h-4 text-primary" />
                      <span className="text-gray-300">{feature}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trust Badges */}
            <div className="flex items-center space-x-6 text-sm text-gray-400">
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4" />
                <span>Free Shipping</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>2 Year Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Package className="w-4 h-4" />
                <span>Easy Returns</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Details Tabs */}
        <div className="mt-16">
          <Tabs defaultValue="description" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-gray-800">
              <TabsTrigger value="description">Description</TabsTrigger>
              <TabsTrigger value="specifications">Specifications</TabsTrigger>
              <TabsTrigger value="reviews">Reviews ({product.reviewCount})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="description" className="mt-6">
              <Card className="bg-card border-gray-800">
                <CardContent className="p-6">
                  <p className="text-gray-300 leading-relaxed">
                    {product.description}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="specifications" className="mt-6">
              <Card className="bg-card border-gray-800">
                <CardContent className="p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(product.specifications).map(([key, value]) => (
                      <div key={key} className="flex justify-between items-center py-2 border-b border-gray-800">
                        <span className="font-medium text-gray-400">{key}:</span>
                        <span className="text-white">{value}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="reviews" className="mt-6">
              <Card className="bg-card border-gray-800">
                <CardContent className="p-6">
                  <div className="text-center py-8">
                    <p className="text-gray-400">Reviews feature will be implemented soon.</p>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Back to Products */}
        <div className="mt-8">
          <Link href="/products">
            <Button variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Products
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
