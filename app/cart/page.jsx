"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider_clean";
import {
  ShoppingCart, Minus, Plus, Trash2, ArrowLeft,
  ShieldCheck, Truck, RotateCcw, ChevronRight,
  Package, Zap, Lock, BadgeCheck, Flame,
} from "lucide-react";

/* ──────────────────────────── helpers ──────────────────────────── */
const fmt = (n) => Number(n).toLocaleString("en-PK");

/* ──────────────────────────── Skeleton ─────────────────────────── */
function SkeletonCard() {
  return (
    <div className="animate-pulse flex gap-5 rounded-3xl bg-zinc-900/80 border border-zinc-800/50 p-5">
      <div className="w-32 h-32 rounded-2xl bg-zinc-800 shrink-0" />
      <div className="flex-1 space-y-3 py-2">
        <div className="h-5 bg-zinc-800 rounded-lg w-3/4" />
        <div className="h-3.5 bg-zinc-800 rounded-lg w-1/4" />
        <div className="h-6 bg-zinc-800 rounded-lg w-1/3 mt-4" />
      </div>
      <div className="flex flex-col items-end justify-between py-2 w-32">
        <div className="h-5 bg-zinc-800 rounded-lg w-full" />
        <div className="h-10 bg-zinc-800 rounded-xl w-full" />
      </div>
    </div>
  );
}

/* ──────────────────────────── Empty state ───────────────────────── */
function EmptyCart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex flex-col items-center justify-center py-32 text-center"
    >
      {/* Floating bag icon */}
      <div className="relative mb-10">
        <div className="absolute inset-0 bg-yellow-400/20 rounded-full blur-3xl scale-[2]" />
        <motion.div
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="relative w-44 h-44 rounded-full bg-gradient-to-br from-zinc-800 via-zinc-900 to-black border border-yellow-400/20 shadow-2xl flex items-center justify-center"
        >
          <ShoppingCart className="w-20 h-20 text-yellow-400/50" strokeWidth={1.2} />
        </motion.div>
        <motion.div
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-2 -right-2 w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-lg shadow-yellow-400/40"
        >
          <span className="text-black text-sm font-black">0</span>
        </motion.div>
      </div>

      <h2 className="text-4xl font-black text-white tracking-tight mb-4">
        Your cart is{" "}
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-200">
          empty
        </span>
      </h2>
      <p className="text-zinc-500 text-base mb-10 max-w-sm leading-relaxed">
        Looks like you haven&apos;t added anything yet. Let&apos;s fix that — explore our collection!
      </p>

      <Link href="/products">
        <motion.button
          whileHover={{ scale: 1.04, boxShadow: "0 0 40px rgba(250,204,21,0.35)" }}
          whileTap={{ scale: 0.97 }}
          className="relative overflow-hidden flex items-center gap-3 bg-yellow-400 text-black font-black px-10 py-4 rounded-2xl text-base shadow-xl shadow-yellow-400/20 group"
        >
          <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
          <Package className="w-5 h-5" />
          Start Shopping
          <ChevronRight className="w-5 h-5" />
        </motion.button>
      </Link>

      <div className="mt-16 grid grid-cols-3 gap-8">
        {[
          { icon: Truck, label: "Free Shipping", sub: "On all orders" },
          { icon: ShieldCheck, label: "Secure Payment", sub: "256-bit SSL" },
          { icon: RotateCcw, label: "Easy Returns", sub: "30-day policy" },
        ].map(({ icon: Icon, label, sub }) => (
          <div key={label} className="flex flex-col items-center gap-2 group">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 group-hover:border-yellow-400/40 flex items-center justify-center transition-colors duration-300 shadow-lg">
              <Icon className="w-6 h-6 text-yellow-400/70" />
            </div>
            <p className="text-white text-sm font-semibold">{label}</p>
            <p className="text-zinc-600 text-xs">{sub}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

/* ──────────────────────────── Product Card ──────────────────────── */
function ProductCard({ item, onQty, onRemove, busy }) {
  const { variant } = item;
  const product = variant?.product;
  const img = product?.images?.[0] || "/placeholder-product.svg";
  const price = variant?.price || 0;
  const stock = variant?.totalStock ?? 0;
  const lineTotal = price * item.quantity;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -60, transition: { duration: 0.25 } }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.3 }}
      className="group relative rounded-3xl overflow-hidden border border-zinc-800 hover:border-yellow-400/40 bg-gradient-to-br from-zinc-900 via-zinc-900 to-zinc-950 shadow-xl transition-all duration-300"
      style={{ boxShadow: "0 4px 24px rgba(0,0,0,0.4)" }}
    >
      {/* Glow on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(250,204,21,0.06) 0%, transparent 70%)" }} />

      {/* Top shimmer line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-yellow-400/0 to-transparent group-hover:via-yellow-400/60 transition-all duration-500" />

      <div className="flex items-stretch">

        {/* ── Product image ─────────────────────────────── */}
        <Link href={`/products/${product?.id}`} className="block shrink-0 relative">
          <div className="relative w-36 sm:w-44 h-full min-h-[160px] overflow-hidden bg-zinc-800">
            <Image
              src={img}
              alt={product?.name || "Product"}
              fill
              className="object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-110"
              onError={(e) => { e.currentTarget.src = "/placeholder-product.svg"; }}
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-zinc-900/60" />
            {/* Category badge on image */}
            {product?.category?.name && (
              <div className="absolute top-3 left-3">
                <span className="text-[10px] bg-black/70 backdrop-blur-sm text-zinc-300 px-2 py-1 rounded-lg border border-white/10 font-medium">
                  {product.category.name}
                </span>
              </div>
            )}
          </div>
        </Link>

        {/* ── Content ───────────────────────────────────── */}
        <div className="flex flex-1 flex-col justify-between p-5 gap-3">

          {/* Top row: name + remove */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 min-w-0">
              {product?.brand?.name && (
                <div className="flex items-center gap-1.5 mb-1.5">
                  <BadgeCheck className="w-3 h-3 text-yellow-400" />
                  <span className="text-yellow-400 text-[11px] font-bold uppercase tracking-widest">
                    {product.brand.name}
                  </span>
                </div>
              )}
              <Link href={`/products/${product?.id}`}>
                <h3 className="font-bold text-white group-hover:text-yellow-50 transition-colors text-base sm:text-lg leading-snug line-clamp-2">
                  {product?.name || "Unknown Product"}
                </h3>
              </Link>
            </div>

            {/* Remove button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => onRemove(item.id)}
              disabled={busy}
              className="shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-zinc-600 hover:text-white hover:bg-red-500 border border-zinc-700 hover:border-red-500 transition-all duration-200 disabled:opacity-30"
              title="Remove"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </motion.button>
          </div>

          {/* Bottom row: price + qty + total */}
          <div className="flex items-end justify-between gap-4 flex-wrap">

            {/* Price block */}
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className="text-2xl font-black text-yellow-400 tabular-nums leading-none">
                  Rs. {fmt(price)}
                </span>
                <span className="text-zinc-600 text-xs font-normal">per unit</span>
              </div>

              {stock > 0 && stock <= 5 ? (
                <div className="flex items-center gap-1 mt-1.5">
                  <Flame className="w-3 h-3 text-amber-400" />
                  <span className="text-amber-400 text-xs font-semibold">Only {stock} left!</span>
                </div>
              ) : stock === 0 ? (
                <span className="text-red-400 text-xs mt-1 block">Out of stock</span>
              ) : (
                <div className="flex items-center gap-1 mt-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 inline-block" />
                  <span className="text-green-400 text-xs">In stock</span>
                </div>
              )}
            </div>

            {/* Qty + Total */}
            <div className="flex items-center gap-4">

              {/* Quantity stepper */}
              <div className="flex items-center rounded-2xl border border-zinc-700 bg-zinc-800/80 overflow-hidden">
                <button
                  onClick={() => onQty(item.id, item.quantity - 1)}
                  disabled={busy || item.quantity <= 1}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:bg-yellow-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 font-bold"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <div className="w-10 text-center">
                  {busy ? (
                    <span className="inline-block w-4 h-4 border-2 border-zinc-600 border-t-yellow-400 rounded-full animate-spin" />
                  ) : (
                    <span className="text-white font-black text-base tabular-nums">{item.quantity}</span>
                  )}
                </div>
                <button
                  onClick={() => onQty(item.id, item.quantity + 1)}
                  disabled={busy || item.quantity >= stock}
                  className="w-10 h-10 flex items-center justify-center text-zinc-400 hover:bg-yellow-400 hover:text-black disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150 font-bold"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Line total */}
              <div className="text-right hidden sm:block">
                <div className="text-white font-black text-xl tabular-nums leading-none">
                  Rs. {fmt(lineTotal)}
                </div>
                <div className="text-zinc-600 text-[11px] mt-1">
                  {item.quantity} × {fmt(price)}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ──────────────────────────── Order Summary ─────────────────────── */
function OrderSummary({ items, cartTotal, onCheckout, isAuthenticated }) {
  const tax = cartTotal * 0.18;
  const total = cartTotal + tax;
  const qty = items.reduce((s, i) => s + i.quantity, 0);

  return (
    <div className="sticky top-32 space-y-4">

      {/* ── Summary panel ── */}
      <div className="rounded-3xl overflow-hidden shadow-2xl shadow-black/50" style={{ background: "linear-gradient(135deg, #18181b 0%, #141414 50%, #0f0f0f 100%)", border: "1px solid rgba(250,204,21,0.15)" }}>

        {/* Header */}
        <div className="relative px-6 pt-6 pb-5 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/10 via-yellow-400/5 to-transparent" />
          <div className="absolute -top-4 -right-4 w-32 h-32 rounded-full bg-yellow-400/10 blur-2xl" />
          <div className="relative flex items-center justify-between">
            <div>
              <h2 className="text-xl font-black text-white tracking-tight">Order Summary</h2>
              <p className="text-zinc-500 text-sm mt-0.5">{qty} item{qty !== 1 ? "s" : ""} in your cart</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center">
              <ShoppingCart className="w-6 h-6 text-yellow-400" />
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px mx-6 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* Item list */}
        <div className="px-6 py-4 space-y-2.5 max-h-48 overflow-y-auto custom-scrollbar">
          {items.map((item) => (
            <div key={item.id} className="flex justify-between items-start gap-3 group">
              <div className="flex items-start gap-2 flex-1 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-400/50 mt-1.5 shrink-0" />
                <span className="text-zinc-400 text-xs line-clamp-1 group-hover:text-zinc-300 transition-colors leading-relaxed">
                  {item.variant?.product?.name}
                  <span className="text-zinc-600 ml-1.5 font-normal">×{item.quantity}</span>
                </span>
              </div>
              <span className="text-white text-xs font-bold shrink-0 tabular-nums">
                Rs. {fmt((item.variant?.price || 0) * item.quantity)}
              </span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="h-px mx-6 bg-gradient-to-r from-transparent via-zinc-700 to-transparent" />

        {/* Breakdown */}
        <div className="px-6 py-4 space-y-3">
          {[
            { label: "Subtotal", value: `Rs. ${fmt(cartTotal)}`, muted: true },
            { label: "Shipping", value: "Free", green: true, icon: Truck },
            { label: "VAT (18%)", value: `Rs. ${fmt(Math.round(tax))}`, muted: true },
          ].map(({ label, value, green, muted, icon: Icon }) => (
            <div key={label} className="flex justify-between items-center text-sm">
              <span className="text-zinc-500 flex items-center gap-1.5">
                {Icon && <Icon className="w-3.5 h-3.5 text-green-400" />}
                {label}
              </span>
              <span className={`font-semibold tabular-nums ${green ? "text-green-400" : "text-zinc-300"}`}>
                {value}
              </span>
            </div>
          ))}
        </div>

        {/* Total block */}
        <div className="mx-6 mb-5 rounded-2xl overflow-hidden" style={{ background: "linear-gradient(135deg, rgba(250,204,21,0.12), rgba(250,204,21,0.05))", border: "1px solid rgba(250,204,21,0.2)" }}>
          <div className="px-5 py-4 flex items-center justify-between">
            <div>
              <p className="text-zinc-400 text-xs uppercase tracking-widest font-bold">Total Amount</p>
              <p className="text-zinc-600 text-[11px] mt-0.5">Including all taxes</p>
            </div>
            <div className="text-right">
              <div className="text-3xl font-black text-yellow-400 tabular-nums leading-none"
                style={{ textShadow: "0 0 30px rgba(250,204,21,0.4)" }}>
                Rs. {fmt(Math.round(total))}
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="px-6 pb-6">
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: "0 8px 40px rgba(250,204,21,0.4)" }}
            whileTap={{ scale: 0.97 }}
            onClick={onCheckout}
            className="relative w-full overflow-hidden flex items-center justify-center gap-2.5 bg-yellow-400 text-black font-black py-4 rounded-2xl text-base shadow-lg shadow-yellow-400/30 group transition-all duration-200"
          >
            <span className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            <Lock className="w-4 h-4" />
            {isAuthenticated ? "Proceed to Checkout" : "Sign in to Checkout"}
            <ChevronRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
          </motion.button>

          {!isAuthenticated && (
            <p className="text-center text-xs text-zinc-600 mt-3">
              Or{" "}
              <Link href="/auth/signup" className="text-yellow-400 hover:text-yellow-300 underline underline-offset-2 transition-colors">
                create a free account
              </Link>
            </p>
          )}
        </div>
      </div>

      {/* ── Trust badges ── */}
      <div className="rounded-3xl border border-zinc-800/60 bg-zinc-900/40 backdrop-blur-sm p-5 space-y-3.5">
        <p className="text-zinc-600 text-[11px] uppercase tracking-widest font-bold">Why shop with us</p>
        {[
          { icon: ShieldCheck, label: "Secure Payments", desc: "256-bit SSL encryption", color: "text-emerald-400", glow: "bg-emerald-400/10" },
          { icon: Truck, label: "Free Delivery", desc: "On every single order", color: "text-sky-400", glow: "bg-sky-400/10" },
          { icon: RotateCcw, label: "Easy Returns", desc: "30-day no-questions policy", color: "text-violet-400", glow: "bg-violet-400/10" },
          { icon: BadgeCheck, label: "Genuine Products", desc: "100% authentic guarantee", color: "text-yellow-400", glow: "bg-yellow-400/10" },
        ].map(({ icon: Icon, label, desc, color, glow }) => (
          <div key={label} className="flex items-center gap-3 group">
            <div className={`w-9 h-9 rounded-xl ${glow} border border-white/5 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-200`}>
              <Icon className={`w-4 h-4 ${color}`} />
            </div>
            <div>
              <p className="text-white text-xs font-bold leading-none">{label}</p>
              <p className="text-zinc-600 text-[11px] mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ──────────────────────────── Page ─────────────────────────────── */
export default function CartPage() {
  const { status } = useSession();
  const router = useRouter();
  const { items, loading, cartTotal, updateCartItem, removeFromCart, clearCart } = useCart();

  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [clearing, setClearing] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = status === "authenticated";
  const totalQty = items.reduce((s, i) => s + i.quantity, 0);

  const handleQty = async (id, qty) => {
    if (qty < 1) return handleRemove(id);
    setUpdatingId(id);
    setError(null);
    const r = await updateCartItem(id, qty);
    if (!r.success) setError(r.error || "Failed to update quantity");
    setUpdatingId(null);
  };

  const handleRemove = async (id) => {
    setRemovingId(id);
    setError(null);
    const r = await removeFromCart(id);
    if (!r.success) setError(r.error || "Failed to remove item");
    setRemovingId(null);
  };

  const handleClear = async () => {
    if (!window.confirm("Remove all items from your cart?")) return;
    setClearing(true);
    setError(null);
    const r = await clearCart();
    if (!r.success) setError(r.error || "Failed to clear cart");
    setClearing(false);
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      localStorage.setItem("returnUrl", "/cart");
      router.push("/auth/signin");
      return;
    }
    router.push("/checkout");
  };

  return (
    <div className="relative min-h-screen bg-black overflow-x-hidden">

      {/* ── Ambient background ─────────────────────────────── */}
      <div className="pointer-events-none fixed inset-0"
        style={{
          backgroundImage: "radial-gradient(circle at 1px 1px, rgba(250,204,21,0.04) 1px, transparent 0)",
          backgroundSize: "40px 40px",
        }}
      />
      <div className="pointer-events-none fixed top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] rounded-full blur-[160px]"
        style={{ background: "radial-gradient(ellipse, rgba(250,204,21,0.07) 0%, transparent 70%)" }} />
      <div className="pointer-events-none fixed bottom-0 right-0 w-[600px] h-[400px] rounded-full blur-[120px]"
        style={{ background: "radial-gradient(ellipse, rgba(250,204,21,0.04) 0%, transparent 70%)" }} />

      {/* ── Page content ────────────────────────────────────── */}
      <div className="page-with-header pb-24 relative z-10">

        {/* ═══════════════ HERO BANNER ═══════════════ */}
        <div className="relative overflow-hidden border-b border-zinc-800/50 mb-8">
          <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-transparent" />
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 relative">

            {/* Breadcrumb */}
            <nav className="flex items-center gap-2 text-xs text-zinc-600 mb-6">
              <Link href="/" className="hover:text-yellow-400 transition-colors">Home</Link>
              <ChevronRight className="w-3 h-3" />
              <Link href="/products" className="hover:text-yellow-400 transition-colors">Products</Link>
              <ChevronRight className="w-3 h-3" />
              <span className="text-yellow-400 font-semibold">Shopping Cart</span>
            </nav>

            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 rounded-2xl bg-yellow-400/15 border border-yellow-400/25 flex items-center justify-center">
                    <ShoppingCart className="w-5 h-5 text-yellow-400" />
                  </div>
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    Shopping Cart
                  </h1>
                  {!loading && items.length > 0 && (
                    <motion.span
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="bg-yellow-400 text-black text-sm font-black px-3 py-1 rounded-full shadow-lg shadow-yellow-400/30"
                    >
                      {totalQty}
                    </motion.span>
                  )}
                </div>
                <p className="text-zinc-500 text-sm">
                  {loading ? "Loading your cart…" : items.length === 0
                    ? "Your cart is waiting to be filled"
                    : `${items.length} product${items.length !== 1 ? "s" : ""}, ${totalQty} item${totalQty !== 1 ? "s" : ""} total`
                  }
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => router.back()}
                  className="hidden sm:flex items-center gap-2 text-zinc-500 hover:text-white border border-zinc-800 hover:border-zinc-600 rounded-xl px-4 py-2 text-sm transition-all duration-200 group"
                >
                  <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
                  Back
                </button>
                {items.length > 0 && (
                  <button
                    onClick={handleClear}
                    disabled={clearing}
                    className="flex items-center gap-2 text-zinc-500 hover:text-red-400 border border-zinc-800 hover:border-red-500/30 rounded-xl px-4 py-2 text-sm transition-all duration-200 disabled:opacity-40"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    {clearing ? "Clearing…" : "Clear Cart"}
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* ═══════════════ MAIN CONTENT ═══════════════ */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6">

          {/* Error banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10, height: 0 }}
                animate={{ opacity: 1, y: 0, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 flex items-center gap-3 bg-red-500/8 border border-red-500/30 text-red-400 rounded-2xl px-5 py-3.5 text-sm overflow-hidden"
              >
                <Zap className="w-4 h-4 shrink-0" />
                <span className="flex-1">{error}</span>
                <button onClick={() => setError(null)} className="hover:text-red-300 ml-auto p-1 transition-colors">✕</button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Grid */}
          {loading ? (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">
              <div className="space-y-4">
                {[1, 2, 3].map((n) => <SkeletonCard key={n} />)}
              </div>
              <div className="rounded-3xl border border-zinc-800 bg-zinc-900/80 animate-pulse overflow-hidden">
                <div className="h-24 bg-zinc-800" />
                <div className="p-6 space-y-4">
                  {[1, 2, 3].map((n) => <div key={n} className="h-4 bg-zinc-800 rounded-xl" />)}
                  <div className="h-14 bg-zinc-800 rounded-2xl mt-2" />
                  <div className="h-14 bg-zinc-800 rounded-2xl" />
                </div>
              </div>
            </div>
          ) : items.length === 0 ? (
            <EmptyCart />
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-8 items-start">

              {/* ── Left: item list ──────────────── */}
              <div className="space-y-4">

                {/* Section label */}
                <div className="flex items-center justify-between">
                  <h2 className="text-white font-bold text-lg">
                    Items Added
                    <span className="ml-2 text-yellow-400 text-sm font-normal">({items.length})</span>
                  </h2>
                  <Link
                    href="/products"
                    className="flex items-center gap-1.5 text-sm text-zinc-500 hover:text-yellow-400 transition-colors group"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
                    Continue Shopping
                  </Link>
                </div>

                <AnimatePresence mode="popLayout">
                  {items.map((item, i) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07 }}
                    >
                      <ProductCard
                        item={item}
                        onQty={handleQty}
                        onRemove={handleRemove}
                        busy={updatingId === item.id || removingId === item.id}
                      />
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Free shipping notice */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="flex items-center gap-4 rounded-2xl border border-green-500/20 bg-gradient-to-r from-green-500/8 to-emerald-500/5 px-5 py-3.5"
                >
                  <div className="w-8 h-8 rounded-xl bg-green-500/15 flex items-center justify-center shrink-0">
                    <Truck className="w-4 h-4 text-green-400" />
                  </div>
                  <div>
                    <p className="text-green-400 text-sm font-bold">You qualify for free shipping!</p>
                    <p className="text-green-600 text-xs mt-0.5">Estimated delivery: 3–5 business days</p>
                  </div>
                </motion.div>
              </div>

              {/* ── Right: order summary ─────────── */}
              <OrderSummary
                items={items}
                cartTotal={cartTotal}
                onCheckout={handleCheckout}
                isAuthenticated={isAuthenticated}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
