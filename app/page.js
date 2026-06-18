"use client";

import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import {
  Cpu, Monitor, HardDrive, MemoryStick, Power, Fan,
  ArrowRight, Star, Zap, Shield, Truck, Package, Trophy,
  ChevronRight, Sparkles, Clock, CircuitBoard, Layers,
  Gauge, Wrench, HeadphonesIcon, Award, CheckCircle
} from "lucide-react";
import { memo, useEffect, Suspense, lazy, useRef, useState } from "react";
import { FastLink } from "@/components/navigation/FastNavigation";
import { GlobalLoader } from "@/components/ui/loading";

const FeaturedProductsSection = lazy(() => import('@/components/sections/FeaturedProducts'));
const TestimonialsSection = lazy(() => import('@/components/sections/Testimonials'));

// ─── Animated counter ───────────────────────────────────────────────────────
function CountUp({ target, suffix = "", duration = 2000 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !started) setStarted(true);
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const steps = 60;
    const inc = target / steps;
    let current = 0;
    const timer = setInterval(() => {
      current += inc;
      if (current >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(current));
    }, duration / steps);
    return () => clearInterval(timer);
  }, [started, target, duration]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ─── Floating tech card ───────────────────────────────────────────────────────
function FloatingCard({ icon: Icon, label, value, color, delay, className }) {
  return (
    <motion.div
      className={`absolute bg-black/80 backdrop-blur-md border border-yellow-400/30 rounded-xl p-3 shadow-2xl shadow-yellow-400/10 ${className}`}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1, y: [0, -8, 0] }}
      transition={{
        opacity: { delay, duration: 0.5 },
        scale: { delay, duration: 0.5 },
        y: { delay, duration: 3 + delay, repeat: Infinity, ease: "easeInOut" }
      }}
    >
      <div className="flex items-center gap-2">
        <div className={`p-1.5 rounded-lg ${color}`}>
          <Icon className="w-4 h-4 text-white" />
        </div>
        <div>
          <p className="text-yellow-400 font-bold text-sm leading-none">{value}</p>
          <p className="text-gray-400 text-xs mt-0.5">{label}</p>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Brand ticker ─────────────────────────────────────────────────────────────
const brands = ["Intel", "AMD", "NVIDIA", "ASUS", "MSI", "Corsair", "Gigabyte", "Samsung", "WD", "Seagate", "Cooler Master", "NZXT", "be quiet!", "G.Skill", "Kingston"];

function BrandTicker() {
  return (
    <div className="overflow-hidden py-4 border-y border-yellow-400/10 bg-black/40">
      <motion.div
        className="flex gap-12 whitespace-nowrap"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
      >
        {[...brands, ...brands].map((b, i) => (
          <span key={i} className="text-gray-500 font-semibold text-sm tracking-widest uppercase hover:text-yellow-400 transition-colors cursor-default select-none">
            {b}
          </span>
        ))}
      </motion.div>
    </div>
  );
}

// ─── Category card ────────────────────────────────────────────────────────────
const categories = [
  { title: "Processors", sub: "Intel & AMD CPUs", icon: Cpu, href: "/products?category=cpu", accent: "from-blue-500 to-cyan-500", count: "120+" },
  { title: "Graphics Cards", sub: "NVIDIA & AMD GPUs", icon: Monitor, href: "/products?category=gpu", accent: "from-green-500 to-emerald-500", count: "85+" },
  { title: "Memory / RAM", sub: "DDR4 & DDR5 Kits", icon: MemoryStick, href: "/products?category=ram", accent: "from-purple-500 to-violet-500", count: "200+" },
  { title: "Storage", sub: "SSD, NVMe & HDD", icon: HardDrive, href: "/products?category=storage", accent: "from-orange-500 to-yellow-500", count: "150+" },
  { title: "Power Supplies", sub: "80+ Gold & Platinum", icon: Power, href: "/products?category=psu", accent: "from-red-500 to-pink-500", count: "60+" },
  { title: "PC Cooling", sub: "Air & Liquid Cooling", icon: Fan, href: "/products?category=cooling", accent: "from-teal-500 to-sky-500", count: "90+" },
  { title: "Motherboards", sub: "AM5, LGA1700 & more", icon: CircuitBoard, href: "/products?category=motherboard", accent: "from-yellow-500 to-amber-500", count: "75+" },
  { title: "PC Cases", sub: "ATX, mATX & ITX", icon: Layers, href: "/products?category=case", accent: "from-slate-500 to-gray-500", count: "55+" },
];

const features = [
  { icon: Truck, title: "Island-wide Delivery", sub: "Sri Lanka nationwide shipping", color: "text-yellow-400" },
  { icon: Shield, title: "Genuine Products", sub: "100% authentic components", color: "text-green-400" },
  { icon: Wrench, title: "Free PC Building", sub: "Expert assembly service", color: "text-blue-400" },
  { icon: HeadphonesIcon, title: "Tech Support", sub: "Expert advice, always on", color: "text-purple-400" },
  { icon: Award, title: "Warranty Backed", sub: "Manufacturer warranties", color: "text-pink-400" },
  { icon: Gauge, title: "Price Match", sub: "Best prices guaranteed", color: "text-orange-400" },
];

export default function HomePage() {
  useEffect(() => {
    const pages = ['/products', '/categories', '/pc-builder', '/deals'];
    pages.forEach(p => {
      const l = document.createElement('link');
      l.rel = 'prefetch'; l.href = p;
      document.head.appendChild(l);
    });
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      <Header />

      {/* ═══════════════════════════════════════════════════════════
          HERO SECTION
      ═══════════════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">

        {/* ── Background layers ── */}
        <div className="absolute inset-0 bg-black" />

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `linear-gradient(rgba(250,204,21,1) 1px, transparent 1px), linear-gradient(90deg,rgba(250,204,21,1) 1px,transparent 1px)`,
            backgroundSize: "60px 60px"
          }}
        />

        {/* Radial glow - left */}
        <div className="absolute -left-40 top-1/4 w-[700px] h-[700px] rounded-full bg-yellow-400/8 blur-[120px] pointer-events-none" />
        {/* Radial glow - right */}
        <div className="absolute -right-40 bottom-1/4 w-[500px] h-[500px] rounded-full bg-yellow-500/6 blur-[100px] pointer-events-none" />

        {/* Diagonal accent line */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-1/3 w-px h-full bg-gradient-to-b from-transparent via-yellow-400/20 to-transparent" />
          <div className="absolute top-0 right-[45%] w-px h-full bg-gradient-to-b from-transparent via-yellow-400/10 to-transparent" />
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center min-h-[80vh] py-16">

            {/* ── Left: Copy ── */}
            <div className="space-y-8">

              {/* Badge */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="bg-yellow-400/10 text-yellow-400 border border-yellow-400/30 px-4 py-2 text-sm font-semibold tracking-wide backdrop-blur-sm">
                  <Sparkles className="w-3.5 h-3.5 mr-2" />
                  Sri Lanka&apos;s #1 PC Components Store
                </Badge>
              </motion.div>

              {/* Headline */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="space-y-2"
              >
                <h1 className="text-5xl md:text-6xl xl:text-7xl font-black leading-[1.05] tracking-tight">
                  <span className="text-white">Build Your</span>
                  <br />
                  <span className="bg-gradient-to-r from-yellow-300 via-yellow-400 to-amber-500 bg-clip-text text-transparent">
                    Dream PC
                  </span>
                </h1>
                <h2 className="text-2xl md:text-3xl font-light text-gray-400 mt-4">
                  Premium Components. Unbeatable Prices.
                </h2>
              </motion.div>

              {/* Sub-copy */}
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-gray-400 text-lg leading-relaxed max-w-lg"
              >
                From entry-level rigs to extreme workstations — find CPUs, GPUs, RAM, storage, and everything in between.
                Expert assembly included. Island-wide delivery.
              </motion.p>

              {/* CTAs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="flex flex-wrap gap-4"
              >
                <FastLink href="/products">
                  <Button
                    size="lg"
                    className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-8 py-6 text-base rounded-xl shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 transition-all duration-300 group"
                  >
                    Shop Now
                    <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </FastLink>
                <FastLink href="/pc-builder">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 bg-transparent px-8 py-6 text-base rounded-xl transition-all duration-300"
                  >
                    <Wrench className="mr-2 w-5 h-5" />
                    PC Builder
                  </Button>
                </FastLink>
                <FastLink href="/deals">
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-gray-300 hover:text-yellow-400 hover:bg-yellow-400/5 px-6 py-6 text-base rounded-xl transition-all duration-300"
                  >
                    <Zap className="mr-2 w-4 h-4 text-yellow-400" />
                    Hot Deals
                  </Button>
                </FastLink>
              </motion.div>

              {/* Mini stats */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="flex flex-wrap gap-8 pt-2"
              >
                {[
                  { val: 5000, suffix: "+", label: "Products" },
                  { val: 50000, suffix: "+", label: "Happy Customers" },
                  { val: 10, suffix: "+", label: "Years Experience" },
                ].map((s) => (
                  <div key={s.label} className="text-center">
                    <p className="text-2xl font-black text-yellow-400">
                      <CountUp target={s.val} suffix={s.suffix} />
                    </p>
                    <p className="text-gray-500 text-xs uppercase tracking-wider mt-0.5">{s.label}</p>
                  </div>
                ))}
              </motion.div>

              {/* Trust badges */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.55 }}
                className="flex flex-wrap gap-3"
              >
                {["Free Assembly", "24H Delivery", "Warranty Assured", "Price Match"].map((b) => (
                  <span key={b} className="flex items-center gap-1.5 text-xs text-gray-400 bg-white/5 border border-white/10 rounded-full px-3 py-1.5">
                    <CheckCircle className="w-3 h-3 text-yellow-400 flex-shrink-0" />
                    {b}
                  </span>
                ))}
              </motion.div>
            </div>

            {/* ── Right: Visual showcase ── */}
            <div className="relative hidden lg:flex items-center justify-center h-[580px]">

              {/* Central glowing ring — CSS spin avoids JS timer overhead */}
              <div className="absolute w-72 h-72 rounded-full border border-yellow-400/20 animate-spin [animation-duration:20s]" />
              <div className="absolute w-56 h-56 rounded-full border border-yellow-400/10 animate-spin [animation-duration:15s] [animation-direction:reverse]" />

              {/* Central icon */}
              <motion.div
                className="relative z-10 w-36 h-36 bg-gradient-to-br from-yellow-400/20 to-yellow-600/10 rounded-3xl border border-yellow-400/30 flex items-center justify-center shadow-2xl shadow-yellow-400/20"
                animate={{ y: [-4, 4, -4] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                <CircuitBoard className="w-16 h-16 text-yellow-400" />
                <div className="absolute inset-0 rounded-3xl bg-yellow-400/5 animate-pulse" />
              </motion.div>

              {/* Floating spec cards */}
              <FloatingCard icon={Cpu} label="Latest Gen" value="Intel Core i9" color="bg-blue-600" delay={0.2} className="top-8 left-0" />
              <FloatingCard icon={Monitor} label="4K Ready" value="RTX 4090" color="bg-green-600" delay={0.35} className="top-20 right-0" />
              <FloatingCard icon={MemoryStick} label="DDR5-6000" value="64 GB RAM" color="bg-purple-600" delay={0.5} className="bottom-28 left-4" />
              <FloatingCard icon={HardDrive} label="7000 MB/s" value="NVMe SSD" color="bg-orange-600" delay={0.65} className="bottom-16 right-8" />
              <FloatingCard icon={Power} label="80+ Platinum" value="1000W PSU" color="bg-red-600" delay={0.8} className="top-1/2 -translate-y-1/2 right-0" />
              <FloatingCard icon={Fan} label="360mm AIO" value="Liquid Cool" color="bg-teal-600" delay={0.95} className="top-1/2 -translate-y-1/2 left-0" />

              {/* Corner accents */}
              <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-yellow-400/30 rounded-tr-3xl" />
              <div className="absolute bottom-0 left-0 w-24 h-24 border-b-2 border-l-2 border-yellow-400/30 rounded-bl-3xl" />
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-gray-600 animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-yellow-400/40 to-transparent" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          BRAND TICKER
      ═══════════════════════════════════════════════════════════ */}
      <BrandTicker />

      {/* ═══════════════════════════════════════════════════════════
          FEATURES BAR
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-12 border-b border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {features.map((f, i) => {
              const Icon = f.icon;
              return (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.08 }}
                  className="flex flex-col items-center text-center gap-2 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:border-yellow-400/20 hover:bg-yellow-400/5 transition-all duration-300 group"
                >
                  <Icon className={`w-7 h-7 ${f.color} group-hover:scale-110 transition-transform duration-300`} />
                  <p className="text-white text-sm font-semibold leading-tight">{f.title}</p>
                  <p className="text-gray-500 text-xs leading-tight">{f.sub}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          CATEGORIES GRID
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/30 mb-4">
              Shop by Category
            </Badge>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-3">
              Everything You Need to <span className="text-yellow-400">Build</span>
            </h2>
            <p className="text-gray-400 max-w-xl mx-auto">
              Thousands of genuine products across all major component categories — in stock and ready to ship.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {categories.map((cat, i) => {
              const Icon = cat.icon;
              return (
                <motion.div
                  key={cat.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.07 }}
                  whileHover={{ y: -4 }}
                >
                  <FastLink href={cat.href}>
                    <div className="group relative bg-zinc-900/60 border border-zinc-800 hover:border-yellow-400/40 rounded-2xl p-6 cursor-pointer transition-all duration-300 overflow-hidden">
                      {/* Hover glow */}
                      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/0 to-yellow-400/0 group-hover:from-yellow-400/5 group-hover:to-transparent transition-all duration-500 rounded-2xl" />

                      {/* Top line accent */}
                      <div className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${cat.accent} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full`} />

                      <div className="relative z-10">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${cat.accent} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>

                        <h3 className="font-bold text-white group-hover:text-yellow-400 transition-colors duration-200 text-base mb-1">
                          {cat.title}
                        </h3>
                        <p className="text-gray-500 text-xs mb-3">{cat.sub}</p>

                        <div className="flex items-center justify-between">
                          <span className="text-yellow-400 text-xs font-semibold">{cat.count} products</span>
                          <ChevronRight className="w-4 h-4 text-gray-600 group-hover:text-yellow-400 group-hover:translate-x-1 transition-all duration-200" />
                        </div>
                      </div>
                    </div>
                  </FastLink>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          FEATURED PRODUCTS (lazy)
      ═══════════════════════════════════════════════════════════ */}
      <Suspense fallback={<GlobalLoader isLoading={true} variant="skeleton" className="py-20" />}>
        <FeaturedProductsSection />
      </Suspense>

      {/* ═══════════════════════════════════════════════════════════
          PC BUILDER PROMO BANNER
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 via-yellow-400/5 to-transparent" />
        <div className="absolute inset-0"
          style={{
            backgroundImage: `linear-gradient(rgba(250,204,21,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(250,204,21,0.03) 1px,transparent 1px)`,
            backgroundSize: "40px 40px"
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
            <div className="flex-1 space-y-4">
              <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/30">
                <Wrench className="w-3.5 h-3.5 mr-1.5" />
                PC Builder Tool
              </Badge>
              <h2 className="text-3xl md:text-4xl font-black text-white leading-tight">
                Not sure where to<br />
                <span className="text-yellow-400">start?</span> We&apos;ll help.
              </h2>
              <p className="text-gray-400 leading-relaxed">
                Use our interactive PC Builder to select compatible components for your budget.
                Get expert recommendations and a complete parts list in minutes.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <FastLink href="/pc-builder">
                  <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-6 py-5 rounded-xl shadow-lg shadow-yellow-400/20 group">
                    Start Building
                    <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </FastLink>
                <FastLink href="/deals">
                  <Button variant="outline" className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 bg-transparent px-6 py-5 rounded-xl">
                    <Zap className="mr-2 w-4 h-4" />
                    Today&apos;s Deals
                  </Button>
                </FastLink>
              </div>
            </div>

            {/* Right: spec preview */}
            <div className="flex-shrink-0 w-full md:w-72 bg-black/60 border border-yellow-400/20 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-yellow-400 font-bold text-sm mb-4 flex items-center gap-2">
                <Sparkles className="w-4 h-4" /> Sample Build — Rs. 250,000
              </p>
              {[
                { icon: Cpu, label: "CPU", name: "Intel Core i5-13600K" },
                { icon: Monitor, label: "GPU", name: "RTX 4060 Ti 16GB" },
                { icon: MemoryStick, label: "RAM", name: "32GB DDR5-5600" },
                { icon: HardDrive, label: "SSD", name: "1TB NVMe Gen4" },
                { icon: Power, label: "PSU", name: "750W 80+ Gold" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-3 py-2 border-b border-white/5 last:border-0">
                    <Icon className="w-4 h-4 text-yellow-400 flex-shrink-0" />
                    <span className="text-gray-500 text-xs w-8">{item.label}</span>
                    <span className="text-gray-300 text-xs">{item.name}</span>
                  </div>
                );
              })}
              <FastLink href="/pc-builder">
                <Button size="sm" className="w-full mt-4 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 border border-yellow-400/20 text-xs">
                  Customize This Build
                </Button>
              </FastLink>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════
          TESTIMONIALS (lazy)
      ═══════════════════════════════════════════════════════════ */}
      <Suspense fallback={<GlobalLoader isLoading={true} variant="skeleton" className="py-16" />}>
        <TestimonialsSection />
      </Suspense>

      {/* ═══════════════════════════════════════════════════════════
          FINAL CTA
      ═══════════════════════════════════════════════════════════ */}
      <section className="py-24 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-yellow-400/5 to-black" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-yellow-400/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-6 max-w-2xl mx-auto"
          >
            <Badge className="bg-yellow-400/10 text-yellow-400 border-yellow-400/30">
              <Clock className="w-3.5 h-3.5 mr-1.5" />
              Ready to Ship Today
            </Badge>
            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
              Your Dream PC is <span className="text-yellow-400">One Click Away</span>
            </h2>
            <p className="text-gray-400 text-lg">
              Join 50,000+ satisfied customers across Sri Lanka. Premium components, expert support, fast delivery.
            </p>
            <div className="flex flex-wrap justify-center gap-4 pt-2">
              <FastLink href="/products">
                <Button size="lg" className="bg-yellow-400 hover:bg-yellow-300 text-black font-bold px-10 py-6 text-base rounded-xl shadow-lg shadow-yellow-400/25 hover:shadow-yellow-400/40 transition-all duration-300 group">
                  Shop All Products
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </FastLink>
              <FastLink href="/pc-builder">
                <Button variant="outline" size="lg" className="border-yellow-400/40 text-yellow-400 hover:bg-yellow-400/10 hover:border-yellow-400 bg-transparent px-10 py-6 text-base rounded-xl transition-all duration-300">
                  Build Custom PC
                </Button>
              </FastLink>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
