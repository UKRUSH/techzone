"use client";

import { memo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star, ArrowRight, ShoppingCart, Heart, Eye,
  Zap, Package, CheckCircle, Sparkles
} from "lucide-react";
import { FastLink } from "@/components/navigation/FastNavigation";
import { useInstantFeaturedProducts } from "@/lib/hooks/useInstantData";
import { useCart } from "@/components/providers/CartProvider_clean";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { ProductImageUpload } from "@/components/admin/ProductImageUpload";

// ─── Category accent colours ─────────────────────────────────────────────────
const CATEGORY_META = {
  gpu:          { label: "GPU",         from: "from-cyan-500",   to: "to-blue-600"   },
  cpu:          { label: "CPU",         from: "from-blue-500",   to: "to-indigo-600" },
  storage:      { label: "Storage",     from: "from-emerald-500",to: "to-green-600"  },
  memory:       { label: "Memory",      from: "from-purple-500", to: "to-violet-600" },
  motherboard:  { label: "Motherboard", from: "from-orange-500", to: "to-amber-600"  },
  "power-supply":{ label: "PSU",        from: "from-yellow-500", to: "to-amber-500"  },
  cooling:      { label: "Cooling",     from: "from-sky-500",    to: "to-teal-600"   },
  case:         { label: "Case",        from: "from-slate-400",  to: "to-gray-600"   },
};

function formatPrice(p) {
  return `Rs. ${p.toLocaleString()}`;
}

// ─── Single Product Card ──────────────────────────────────────────────────────
function FeaturedCard({ product, index }) {
  const [wishlisted, setWishlisted] = useState(false);
  const [adding, setAdding] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [localImage, setLocalImage] = useState(null);
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();

  const displayImage = localImage || product.image;

  const meta   = CATEGORY_META[product.category] || { label: product.category?.toUpperCase(), from: "from-yellow-500", to: "to-amber-500" };
  const discount = product.compareAtPrice
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;

  const handleAddToCart = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!session) { router.push("/auth/signin"); return; }
    setAdding(true);
    try {
      await addToCart(String(product.id), 1);
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.45, delay: index * 0.08 }}
      whileHover={{ y: -6 }}
      className="group relative"
    >
      <FastLink href={`/products/${product.id}`}>
        <div className="bg-zinc-900 border border-zinc-800 group-hover:border-yellow-400/40 rounded-2xl overflow-hidden transition-all duration-300 group-hover:shadow-2xl group-hover:shadow-yellow-400/10 h-full flex flex-col">

          {/* ── Image area with bands ── */}
          <div className="relative aspect-square overflow-hidden bg-zinc-800">
            {/* Top decorative band */}
            <div className={`absolute top-0 inset-x-0 h-2 bg-gradient-to-r ${meta.from} ${meta.to} opacity-100 z-10`} />
            
            {!imgError && displayImage ? (
              <img
                src={displayImage}
                alt={product.name}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                onError={() => setImgError(true)}
              />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${meta.from} ${meta.to} opacity-80 flex items-center justify-center`}>
                <Package className="w-16 h-16 text-white/60" />
              </div>
            )}

            {/* Dark overlay on hover */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
            
            {/* Bottom decorative band */}
            <div className={`absolute bottom-0 inset-x-0 h-1.5 bg-gradient-to-r ${meta.from} ${meta.to} opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10`} />

            {/* Badges — top left */}
            <div className="absolute top-3 left-3 flex flex-col gap-2">
              {discount > 0 && (
                <Badge className="bg-yellow-400 text-black font-bold text-xs px-2 py-0.5 shadow-md">
                  -{discount}%
                </Badge>
              )}
              {product.stock > 0 && product.stock <= 5 && (
                <Badge className="bg-red-500/90 text-white text-xs px-2 py-0.5 shadow-md border-0">
                  <Zap className="w-2.5 h-2.5 mr-1" />
                  Only {product.stock} left
                </Badge>
              )}
              {!product.inStock && (
                <Badge className="bg-zinc-700 text-zinc-300 text-xs px-2 py-0.5 border-0">
                  Out of Stock
                </Badge>
              )}
            </div>

            {/* Wishlist — top right */}
            <button
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); setWishlisted(w => !w); }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 backdrop-blur-sm border border-white/10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:border-red-400/50"
            >
              <Heart className={`w-4 h-4 transition-colors duration-200 ${wishlisted ? "fill-red-500 text-red-500" : "text-white"}`} />
            </button>

            {/* Quick-view pill — bottom center */}
            <div className="absolute bottom-3 inset-x-3 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
              <div className="flex items-center justify-center gap-1 bg-black/70 backdrop-blur-sm rounded-full py-1.5 px-3 border border-white/10 text-white text-xs">
                <Eye className="w-3 h-3" />
                Quick View
              </div>
            </div>

            {/* Admin image upload — bottom-left, hover only */}
            <div className="absolute bottom-10 left-3 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <ProductImageUpload
                productId={String(product.id)}
                onUploaded={(url) => { setLocalImage(url); setImgError(false); }}
              />
            </div>
          </div>

          {/* ── Card body with accent band ── */}
          <div className="flex flex-col flex-1 p-4 gap-3 relative">
            {/* Category band accent */}
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${meta.from} ${meta.to}`} />
            
            {/* Category + Brand */}
            <div className="flex items-center justify-between gap-2 pt-1">
              <Badge className={`bg-gradient-to-r ${meta.from} ${meta.to} text-white border-0 text-xs px-2 py-0.5 shadow-sm`}>
                {meta.label}
              </Badge>
              <span className="text-gray-500 text-xs truncate font-medium">{product.brand}</span>
            </div>

            {/* Name */}
            <h3 className="text-white font-semibold text-sm leading-snug line-clamp-2 group-hover:text-yellow-400 transition-colors duration-200 min-h-[2.5rem]">
              {product.name}
            </h3>

            {/* Stars */}
            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < product.rating ? "text-yellow-400 fill-yellow-400" : "text-zinc-600"}`}
                />
              ))}
              <span className="text-gray-500 text-xs ml-1">({product.rating}.0)</span>
            </div>

            {/* Price */}
            <div className="flex items-end gap-2 mt-auto">
              <span className="text-yellow-400 font-black text-lg leading-none">
                {formatPrice(product.price)}
              </span>
              {product.compareAtPrice && (
                <span className="text-gray-600 text-sm line-through leading-none">
                  {formatPrice(product.compareAtPrice)}
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <button
              onClick={handleAddToCart}
              disabled={adding || !product.inStock}
              className={`
                w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200
                ${product.inStock
                  ? "bg-yellow-400 hover:bg-yellow-300 text-black shadow-md shadow-yellow-400/20 hover:shadow-yellow-400/40 active:scale-95"
                  : "bg-zinc-800 text-zinc-500 cursor-not-allowed"}
              `}
            >
              {adding ? (
                <>
                  <div className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />
                  Adding…
                </>
              ) : (
                <>
                  <ShoppingCart className="w-4 h-4" />
                  {product.inStock ? "Add to Cart" : "Out of Stock"}
                </>
              )}
            </button>
          </div>
        </div>
      </FastLink>
    </motion.div>
  );
}

// ─── Section ──────────────────────────────────────────────────────────────────
const FeaturedProducts = memo(function FeaturedProducts() {
  const { data: instantProducts } = useInstantFeaturedProducts();
  const [dbProducts, setDbProducts] = useState(null);

  // Fetch real products from DB so uploaded images appear immediately
  useEffect(() => {
    fetch('/api/products?limit=8', { cache: 'no-store' })
      .then(r => r.json())
      .then(result => {
        if (result.success && result.data?.length > 0) {
          setDbProducts(result.data.map(p => ({
            id: p.id,
            name: p.name,
            price: p.price || p.variants?.[0]?.price || 0,
            compareAtPrice: p.compareAtPrice || p.variants?.[0]?.compareAtPrice || null,
            category: p.category?.slug || p.category?.name?.toLowerCase() || 'other',
            brand: p.brand?.name || '',
            inStock: (p.totalStock || 0) > 0,
            stock: p.totalStock || 0,
            rating: 4,
            image: p.images?.[0] || null,
          })));
        }
      })
      .catch(() => {});
  }, []);

  const products = dbProducts || instantProducts;

  return (
    <section className="py-20 border-t border-white/5 relative">
      {/* Section header band */}
      <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-yellow-400/20 via-yellow-400/5 to-yellow-400/20" />
      
      <div className="container mx-auto px-4">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10"
        >
          <div>
            <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/30 mb-3">
              <Sparkles className="w-3.5 h-3.5 mr-1.5" />
              Hand-picked for You
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
              Featured <span className="text-yellow-400">Products</span>
            </h2>
            <p className="text-gray-400 mt-2 max-w-md">
              Top-rated components our customers love most — in stock and ready to ship.
            </p>
          </div>
          <FastLink href="/products" className="flex-shrink-0">
            <Button
              variant="outline"
              className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 bg-transparent rounded-xl group"
            >
              View All Products
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
          </FastLink>
        </motion.div>

        {/* Cards grid */}
        <div className="relative">
          {/* Band separator above grid */}
          <div className="absolute -top-3 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {products.map((product, i) => (
              <FeaturedCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 relative"
        >
          {/* Band separator above CTA */}
          <div className="absolute -top-6 inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-yellow-400/30 to-transparent" />
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 py-6 border border-yellow-400/10 rounded-2xl bg-yellow-400/5">
            <div className="flex flex-wrap justify-center gap-5 text-sm text-gray-400">
              {[
                { icon: CheckCircle, text: "Free Assembly" },
                { icon: Zap, text: "Same-day Dispatch" },
                { icon: Package, text: "Warranty Included" },
              ].map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5">
                  <Icon className="w-4 h-4 text-yellow-400" />
                  {text}
                </span>
              ))}
            </div>
            <FastLink href="/products">
              <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl px-6 group">
                Shop All
                <ArrowRight className="ml-1.5 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </FastLink>
          </div>
        </motion.div>
      </div>
    </section>
  );
});

export default FeaturedProducts;
