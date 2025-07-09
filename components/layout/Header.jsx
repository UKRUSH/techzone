"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, X, Cpu, Monitor, HardDrive, Bell, ChevronDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/components/providers/CartProvider";
import { FastLink } from "@/components/navigation/FastNavigation";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { cartItemCount } = useCart();

  const navigation = [
    { name: "Products", href: "/products" },
    { name: "PC Builder", href: "/pc-builder" },
    { name: "Categories", href: "/categories" },
    { name: "Deals", href: "/deals" },
  ];

  const categories = [
    { name: "CPUs", icon: Cpu, href: "/category/cpu" },
    { name: "Graphics Cards", icon: Monitor, href: "/category/gpu" },
    { name: "Storage", icon: HardDrive, href: "/category/storage" },
  ];

  // Animation variants
  const slideInLeft = {
    hidden: { x: -20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.1 } }
  };

  const slideInRight = {
    hidden: { x: 20, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { duration: 0.5, delay: 0.2 } }
  };
  
  const logoFloat = {
    animate: { 
      y: [-2, 2, -2],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };
  
  // State management
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (typeof window !== 'undefined') {
        setScrolled(window.scrollY > 10);
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-[9999] transition-all duration-500 ${
        scrolled 
          ? "bg-black/98 backdrop-blur-xl shadow-2xl shadow-yellow-400/10 border-b border-yellow-400/40" 
          : "bg-gradient-to-b from-black via-black/95 to-black/90 backdrop-blur-lg"
      }`}
    >
      {/* Dynamic top accent line */}
      <div className="h-1 bg-gradient-to-r from-transparent via-yellow-400 to-transparent relative overflow-hidden">
        <motion.div 
          className="absolute h-full w-20 bg-gradient-to-r from-yellow-200 to-yellow-600 shadow-lg shadow-yellow-400/50"
          animate={{ x: [-100, (typeof window !== 'undefined' ? window.innerWidth : 1200), -100] }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        />
      </div>
      
      <div className="container mx-auto px-6">
        {/* Main Header Content */}
        <div className="flex items-center justify-between h-20">
          {/* Logo Section */}
          <motion.div 
            variants={slideInLeft}
            initial="hidden"
            animate="visible"
            className="flex items-center space-x-4"
          >
            <Link href="/" className="flex items-center space-x-3 group">
              <motion.div 
                variants={logoFloat}
                animate="animate"
                className="relative"
              >
                <div className="w-12 h-12 bg-gradient-to-tr from-yellow-400 to-yellow-300 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/25 group-hover:shadow-yellow-400/40 transition-all duration-300 relative overflow-hidden">
                  <Cpu className="w-6 h-6 text-black z-10 relative" />
                  {/* Circuit pattern overlay */}
                  <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-1 left-1 w-2 h-2 border border-black/30"></div>
                    <div className="absolute bottom-1 right-1 w-2 h-2 border border-black/30"></div>
                    <div className="absolute top-1 right-1 w-1 h-1 bg-black/40 rounded-full"></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-black/40 rounded-full"></div>
                  </div>
                  {/* Hover glow effect */}
                  <div className="absolute inset-0 bg-yellow-300 opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500"></div>
                </div>
              </motion.div>
              
              <div className="flex flex-col">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-yellow-400 to-yellow-300 bg-clip-text text-transparent group-hover:from-yellow-300 group-hover:to-yellow-200 transition-all duration-300">
                    TechZone
                  </span>
                  <Zap className="w-4 h-4 text-yellow-400 opacity-80" />
                </div>
                <span className="text-xs text-yellow-400/70 font-medium tracking-wide hidden sm:block">
                  Next-Gen Computing Hub
                </span>
              </div>
            </Link>
          </motion.div>

          {/* Center Navigation - Desktop */}
          <nav className="hidden lg:flex items-center space-x-1 bg-black/40 rounded-full px-2 py-2 border border-yellow-400/20">
            {navigation.map((item, index) => (
              <motion.div
                key={item.name}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 + 0.3 }}
              >
                <FastLink
                  href={item.href}
                  className="relative px-6 py-2 text-sm font-medium text-white hover:text-black transition-all duration-300 rounded-full group"
                >
                  <span className="relative z-10">{item.name}</span>
                  <div className="absolute inset-0 bg-yellow-400 opacity-0 group-hover:opacity-100 rounded-full transition-all duration-300 scale-0 group-hover:scale-100"></div>
                </FastLink>
              </motion.div>
            ))}
          </nav>

          {/* Right Actions */}
          <motion.div 
            variants={slideInRight}
            initial="hidden"
            animate="visible"
            className="flex items-center space-x-3"
          >
            {/* Search */}
            <div className="hidden md:block relative group">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400/60 w-4 h-4 group-focus-within:text-yellow-400 transition-colors z-10" />
                <Input
                  placeholder="Search components..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-2 w-80 bg-black/50 border-2 border-yellow-400/30 text-white placeholder-yellow-400/50 focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all rounded-full focus:bg-black/70"
                />
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <kbd className="px-2 py-1 text-xs text-yellow-400/60 bg-yellow-400/10 rounded border border-yellow-400/20">⌘K</kbd>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              {/* Notifications */}
              <div className="relative hidden sm:block">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-11 w-11 text-white hover:text-black hover:bg-yellow-400 transition-all duration-300 rounded-full border border-yellow-400/30 hover:border-yellow-400"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="w-5 h-5" />
                  <motion.span 
                    className="absolute -top-1 -right-1 w-4 h-4 bg-yellow-400 rounded-full border-2 border-black flex items-center justify-center"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span className="w-2 h-2 bg-black rounded-full"></span>
                  </motion.span>
                </Button>
                
                {/* Notification dropdown */}
                <AnimatePresence>
                  {showNotifications && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-80 bg-black/95 border-2 border-yellow-400/30 rounded-xl shadow-xl shadow-yellow-400/20 z-50 overflow-hidden backdrop-blur-lg"
                    >
                      <div className="p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-400/5">
                        <div className="flex items-center justify-between">
                          <h3 className="font-semibold text-yellow-400">Latest Updates</h3>
                          <Button variant="ghost" size="sm" className="text-xs text-white/70 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-full">
                            Clear all
                          </Button>
                        </div>
                      </div>
                      <div className="max-h-80 overflow-y-auto">
                        <div className="p-4 hover:bg-yellow-400/5 border-b border-yellow-400/10 transition-colors cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-yellow-400 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">RTX 4080 Super back in stock!</p>
                              <p className="text-xs text-white/70 mt-1">Limited quantities available - grab yours now</p>
                              <p className="text-xs text-yellow-400/80 mt-2">2 minutes ago</p>
                            </div>
                          </div>
                        </div>
                        <div className="p-4 hover:bg-yellow-400/5 transition-colors cursor-pointer">
                          <div className="flex items-start space-x-3">
                            <div className="w-2 h-2 bg-yellow-400/60 rounded-full mt-2 flex-shrink-0"></div>
                            <div className="flex-1">
                              <p className="text-sm font-medium text-white">Your order shipped</p>
                              <p className="text-xs text-white/70 mt-1">Order #TZ-12345 is on the way</p>
                              <p className="text-xs text-yellow-400/80 mt-2">1 hour ago</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="p-3 bg-gradient-to-r from-yellow-400/5 to-transparent">
                        <Button variant="ghost" size="sm" className="w-full text-yellow-400 hover:bg-yellow-400/10 text-sm rounded-full">
                          View all notifications
                        </Button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Cart */}
              <Link href="/cart">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="relative h-11 w-11 text-white hover:text-black hover:bg-yellow-400 transition-all duration-300 rounded-full border border-yellow-400/30 hover:border-yellow-400 group"
                >
                  <ShoppingCart className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  {cartItemCount > 0 && (
                    <Badge
                      className="absolute -top-2 -right-2 w-6 h-6 flex items-center justify-center p-0 text-xs bg-gradient-to-r from-yellow-400 to-yellow-300 text-black hover:from-yellow-300 hover:to-yellow-200 border-2 border-black rounded-full font-bold"
                    >
                      <motion.span
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", stiffness: 500, damping: 15 }}
                      >
                        {cartItemCount}
                      </motion.span>
                    </Badge>
                  )}
                </Button>
              </Link>

              {/* User Menu */}
              <div className="relative">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="h-11 w-11 text-white hover:text-black hover:bg-yellow-400 transition-all duration-300 rounded-full border border-yellow-400/30 hover:border-yellow-400"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <User className="w-5 h-5" />
                </Button>
                
                {/* User menu dropdown */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div 
                      initial={{ opacity: 0, y: 15, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 15, scale: 0.9 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-64 bg-black/95 border-2 border-yellow-400/30 rounded-xl shadow-xl shadow-yellow-400/20 z-50 backdrop-blur-lg"
                    >
                      <div className="p-4 bg-gradient-to-r from-yellow-400/10 to-yellow-400/5">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-gradient-to-tr from-yellow-400 to-yellow-300 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-black" />
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-white">John Doe</p>
                            <p className="text-xs text-yellow-400/80">Premium Member</p>
                          </div>
                        </div>
                      </div>
                      <div className="py-2">
                        <Link href="/profile" className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                          <User className="w-4 h-4" />
                          <span>Your Profile</span>
                        </Link>
                        <Link href="/orders" className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                          <ShoppingCart className="w-4 h-4" />
                          <span>Order History</span>
                        </Link>
                        <Link href="/settings" className="flex items-center space-x-3 px-4 py-3 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                          <Cpu className="w-4 h-4" />
                          <span>Account Settings</span>
                        </Link>
                        <div className="border-t border-yellow-400/20 mt-2 pt-2">
                          <button className="flex items-center space-x-3 w-full px-4 py-3 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400 transition-all">
                            <X className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Mobile Menu Toggle */}
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden h-11 w-11 text-white hover:text-black hover:bg-yellow-400 transition-all duration-300 rounded-full border border-yellow-400/30 hover:border-yellow-400"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <motion.div
                  animate={{ rotate: isMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  {isMenuOpen ? (
                    <X className="w-5 h-5" />
                  ) : (
                    <Menu className="w-5 h-5" />
                  )}
                </motion.div>
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Bottom Navigation Bar - Desktop */}
        <div className="hidden lg:block border-t border-yellow-400/20">
          <div className="flex items-center justify-between py-4">
            {/* Categories Quick Access */}
            <div className="flex items-center space-x-6">
              <span className="text-sm font-medium text-yellow-400/80">Quick Access:</span>
              {categories.map((category) => (
                <FastLink
                  key={category.name}
                  href={category.href}
                  className="flex items-center space-x-2 text-sm text-white/80 hover:text-yellow-400 transition-all group"
                >
                  <div className="p-1 rounded-lg bg-yellow-400/10 group-hover:bg-yellow-400/20 transition-colors">
                    <category.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                  </div>
                  <span className="group-hover:translate-x-1 transition-transform">{category.name}</span>
                </FastLink>
              ))}
            </div>

            {/* Status Indicators */}
            <div className="flex items-center space-x-4 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-white/70">System Online</span>
              </div>
              <div className="flex items-center space-x-2">
                <Zap className="w-3 h-3 text-yellow-400" />
                <span className="text-white/70">Fast Shipping</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="lg:hidden border-t border-yellow-400/30 overflow-hidden bg-gradient-to-b from-black/98 to-black/95 backdrop-blur-xl"
          >
            <div className="px-6 py-8 space-y-6">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-yellow-400/70 w-5 h-5" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 py-3 bg-black/60 border-2 border-yellow-400/30 text-white placeholder-yellow-400/50 focus:border-yellow-400 rounded-full text-base"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-3">
                <h3 className="text-sm font-semibold text-yellow-400/80 uppercase tracking-wide">Navigation</h3>
                {navigation.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <FastLink
                      href={item.href}
                      className="flex items-center justify-between px-4 py-3 text-base font-medium text-white hover:text-black hover:bg-yellow-400 rounded-xl transition-all group"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <span>{item.name}</span>
                      <ChevronDown className="w-4 h-4 rotate-[-90deg] group-hover:translate-x-1 transition-transform" />
                    </FastLink>
                  </motion.div>
                ))}
              </nav>

              {/* Mobile Categories */}
              <div className="pt-4 border-t border-yellow-400/20">
                <h3 className="text-sm font-semibold text-yellow-400/80 uppercase tracking-wide mb-3">Categories</h3>
                <div className="grid grid-cols-1 gap-3">
                  {categories.map((category, index) => (
                    <motion.div
                      key={category.name}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + index * 0.1 }}
                    >
                      <Link
                        href={category.href}
                        className="flex items-center space-x-4 px-4 py-3 text-white/90 hover:text-black hover:bg-yellow-400/90 rounded-xl transition-all group"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <div className="p-2 bg-yellow-400/20 rounded-lg group-hover:bg-black/20 transition-colors">
                          <category.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                        </div>
                        <div className="flex-1">
                          <span className="font-medium">{category.name}</span>
                          <p className="text-xs text-white/60 group-hover:text-black/70">Explore latest {category.name.toLowerCase()}</p>
                        </div>
                      </Link>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Mobile User Actions */}
              <div className="pt-4 border-t border-yellow-400/20">
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <ShoppingCart className="w-5 h-5" />
                    <span className="font-medium">Cart ({cartItemCount})</span>
                  </Link>
                  <button className="flex items-center justify-center space-x-2 px-4 py-3 bg-yellow-400/10 hover:bg-yellow-400/20 text-yellow-400 rounded-xl transition-all">
                    <User className="w-5 h-5" />
                    <span className="font-medium">Account</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
