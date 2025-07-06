"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { ShoppingCart, Search, User, Menu, X, Cpu, Monitor, HardDrive, Bell, ChevronDown } from "lucide-react";
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

  // Animation variants for elements
  const fadeInUp = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3 } }
  };
  
  const glowPulse = {
    initial: { boxShadow: '0 0 0 rgba(255, 239, 0, 0)' },
    animate: { 
      boxShadow: ['0 0 0 rgba(255, 239, 0, 0)', '0 0 15px rgba(255, 239, 0, 0.4)', '0 0 0 rgba(255, 239, 0, 0)'],
      transition: { duration: 3, repeat: Infinity }
    }
  };
  
  // Notification dropdown state
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  
  // Scroll effect for header
  const [scrolled, setScrolled] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b shadow-lg transition-all duration-300 ${
        scrolled 
          ? "bg-black/95 border-yellow-400/30 shadow-yellow-400/5" 
          : "bg-black/80 border-yellow-400/20"
      }`}
    >
      {/* Animated yellow line at the top */}
      <div className="h-0.5 bg-gradient-to-r from-yellow-400/20 via-yellow-400 to-yellow-400/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent animate-shimmer-slow"></div>
      </div>
      
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 group relative">
            <motion.div 
              variants={glowPulse}
              initial="initial"
              animate="animate"
              className="w-9 h-9 bg-yellow-400 rounded-lg flex items-center justify-center group-hover:bg-yellow-300 transition-all duration-300 relative"
            >
              <Cpu className="w-5 h-5 text-black" />
              {/* Subtle glow effect */}
              <div className="absolute inset-0 rounded-lg bg-yellow-400 opacity-0 group-hover:opacity-30 blur-xl transition-opacity duration-500"></div>
            </motion.div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors relative">
                TechZone
                <motion.span 
                  className="absolute bottom-0 left-0 w-0 h-0.5 bg-yellow-400"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </span>
              <span className="text-xs text-yellow-400/60 hidden sm:block">Tech Enthusiast's Paradise</span>
            </div>
          </Link>

          {/* Search Bar - Hidden on mobile */}
          <div className="hidden md:flex flex-1 max-w-xl mx-8">
            <div className="relative w-full group">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400/70 w-4 h-4 group-focus-within:text-yellow-400 transition-colors" />
              <Input
                placeholder="Search for PC components..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-4 bg-black/60 border-yellow-400/30 text-white placeholder-yellow-400/50 focus:border-yellow-400 focus:ring-yellow-400/20 transition-all focus:bg-black/80 rounded-lg"
              />
              <motion.div 
                className="absolute inset-0 -z-10 rounded-lg border border-yellow-400/0 group-focus-within:border-yellow-400/40 opacity-0 group-focus-within:opacity-100"
                initial={{ scale: 0.96 }}
                whileHover={{ scale: 1.01 }}
                animate={{ scale: [0.96, 1, 0.99, 1], opacity: [0, 1, 0.8, 1] }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </div>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {/* Notifications */}
            <div className="relative hidden sm:block">
              <Button 
                variant="ghost" 
                size="icon" 
                className="relative text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
                onClick={() => setShowNotifications(!showNotifications)}
              >
                <Bell className="w-5 h-5" />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full border-2 border-black"></span>
              </Button>
              
              {/* Notification dropdown */}
              <AnimatePresence>
                {showNotifications && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 bg-black/95 border border-yellow-400/20 rounded-lg shadow-lg shadow-yellow-400/10 z-50 overflow-hidden"
                  >
                    <div className="p-4 border-b border-yellow-400/20">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium text-yellow-400">Notifications</h3>
                        <Button variant="ghost" size="sm" className="text-xs text-white/70 hover:text-yellow-400">Mark all as read</Button>
                      </div>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      <div className="p-3 hover:bg-yellow-400/5 border-b border-yellow-400/10 transition-colors">
                        <p className="text-sm font-medium text-white">New RTX 4080 cards in stock</p>
                        <p className="text-xs text-white/70 mt-1">Limited quantities available now</p>
                        <p className="text-xs text-yellow-400/80 mt-1">1 hour ago</p>
                      </div>
                      <div className="p-3 hover:bg-yellow-400/5 border-b border-yellow-400/10 transition-colors">
                        <p className="text-sm font-medium text-white">Your order has shipped</p>
                        <p className="text-xs text-white/70 mt-1">Order #12345 is on its way</p>
                        <p className="text-xs text-yellow-400/80 mt-1">Yesterday</p>
                      </div>
                    </div>
                    <div className="p-3 text-center">
                      <Button variant="ghost" size="sm" className="text-yellow-400 hover:bg-yellow-400/10 text-xs">
                        View all notifications
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Cart */}
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all">
                <ShoppingCart className="w-5 h-5" />
                {cartItemCount > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-2 -right-2 w-5 h-5 flex items-center justify-center p-0 text-xs bg-yellow-400 text-black hover:bg-yellow-300"
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
                className="text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
                onClick={() => setShowUserMenu(!showUserMenu)}
              >
                <User className="w-5 h-5" />
              </Button>
              
              {/* User menu dropdown */}
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 bg-black/95 border border-yellow-400/20 rounded-lg shadow-lg shadow-yellow-400/10 z-50"
                  >
                    <div className="p-3 border-b border-yellow-400/20">
                      <p className="text-sm font-medium text-white">John Doe</p>
                      <p className="text-xs text-white/70">john.doe@example.com</p>
                    </div>
                    <div className="py-1">
                      <Link href="/profile" className="block px-4 py-2 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400">
                        Your Profile
                      </Link>
                      <Link href="/orders" className="block px-4 py-2 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400">
                        Your Orders
                      </Link>
                      <Link href="/settings" className="block px-4 py-2 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400">
                        Settings
                      </Link>
                      <div className="border-t border-yellow-400/20 mt-1 pt-1">
                        <button className="w-full text-left px-4 py-2 text-sm text-white hover:bg-yellow-400/10 hover:text-yellow-400">
                          Sign out
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
              className="md:hidden text-white hover:text-yellow-400 hover:bg-yellow-400/10 transition-all"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </Button>
          </div>
        </div>

        {/* Navigation - Desktop */}
        <nav className="hidden md:flex items-center space-x-8 py-3 border-t border-yellow-400/20">
          {navigation.map((item) => (
            <FastLink
              key={item.name}
              href={item.href}
              className="text-sm font-medium text-white hover:text-yellow-400 transition-colors relative group"
            >
              {item.name}
              <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-yellow-400 group-hover:w-full transition-all duration-300"></span>
            </FastLink>
          ))}
          
          {/* Quick Categories */}
          <div className="flex items-center space-x-4 ml-auto">
            {categories.map((category) => (
              <FastLink
                key={category.name}
                href={category.href}
                className="flex items-center space-x-2 text-sm text-white/80 hover:text-yellow-400 transition-colors group"
              >
                <category.icon className="w-4 h-4 group-hover:scale-110 transition-transform" />
                <span>{category.name}</span>
              </FastLink>
            ))}
          </div>
        </nav>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="md:hidden border-t border-yellow-400/20 overflow-hidden bg-black/98"
          >
            <div className="px-4 py-6 space-y-4">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-yellow-400/70 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 bg-black/60 border-yellow-400/30 text-white placeholder-yellow-400/50 focus:border-yellow-400"
                />
              </div>

              {/* Mobile Navigation */}
              <nav className="space-y-2">
                {navigation.map((item) => (
                  <FastLink
                    key={item.name}
                    href={item.href}
                    className="block px-3 py-2 text-base font-medium text-white hover:text-yellow-400 hover:bg-yellow-400/10 rounded-md transition-all"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </FastLink>
                ))}
              </nav>

              {/* Mobile Categories */}
              <div className="pt-4 border-t border-yellow-400/20">
                <h3 className="text-sm font-semibold text-yellow-400 mb-2">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <Link
                      key={category.name}
                      href={category.href}
                      className="flex items-center space-x-3 px-3 py-2 text-sm text-white/80 hover:text-yellow-400 hover:bg-yellow-400/10 rounded-md transition-all"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <category.icon className="w-4 h-4" />
                      <span>{category.name}</span>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
