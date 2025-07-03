"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";
import { 
  Cpu, 
  Mail, 
  Phone, 
  MapPin, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube 
} from "lucide-react";

export function Footer() {
  const currentYear = new Date().getFullYear();
  
  // Animation variants
  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };
  
  const staggerChildren = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const footerLinks = {
    "Products": [
      { name: "CPUs", href: "/category/cpu" },
      { name: "Graphics Cards", href: "/category/gpu" },
      { name: "Storage", href: "/category/storage" },
      { name: "Memory", href: "/category/ram" },
      { name: "Motherboards", href: "/category/motherboard" },
      { name: "Power Supplies", href: "/category/psu" }
    ],
    "Services": [
      { name: "PC Builder", href: "/pc-builder" },
      { name: "Custom Builds", href: "/services/custom-builds" },
      { name: "Tech Support", href: "/support" },
      { name: "Warranties", href: "/warranties" },
      { name: "Installation", href: "/services/installation" }
    ],
    "Company": [
      { name: "About Us", href: "/about" },
      { name: "Contact", href: "/contact" },
      { name: "Careers", href: "/careers" },
      { name: "Press", href: "/press" },
      { name: "Blog", href: "/blog" }
    ],
    "Support": [
      { name: "Help Center", href: "/help" },
      { name: "Returns", href: "/returns" },
      { name: "Shipping Info", href: "/shipping" },
      { name: "Track Order", href: "/track" },
      { name: "Contact Support", href: "/support/contact" }
    ]
  };

  return (
    <footer className="bg-black border-t border-yellow-400/20 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-yellow-400/20 rounded-full blur-3xl animate-pulse-slower"></div>
        <div className="absolute top-1/3 left-2/3 w-96 h-96 bg-yellow-400/10 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-0 left-1/2 w-32 h-32 bg-yellow-400/10 rounded-full blur-xl animate-pulse-slow"></div>
        
        {/* Grid overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,239,0,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,239,0,0.03)_1px,transparent_1px)] bg-[size:30px_30px]"></div>
      </div>
      
      {/* Main content wrapper */}
      <div className="relative">
        {/* Yellow glow at the top */}
        <div className="h-px bg-gradient-to-r from-yellow-400/0 via-yellow-400/80 to-yellow-400/0 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-yellow-400/80 to-transparent animate-shimmer-slow"></div>
        </div>
        
        <div className="container mx-auto px-4 py-16">
          {/* Main Footer Content */}
          <motion.div 
            variants={staggerChildren}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12"
          >
            {/* Brand Section */}
            <motion.div 
              variants={fadeInUp}
              className="lg:col-span-2"
            >
              <Link href="/" className="flex items-center space-x-2 mb-6 group">
                <div className="w-10 h-10 bg-gradient-to-br from-yellow-300 to-yellow-500 rounded-lg flex items-center justify-center group-hover:from-yellow-200 group-hover:to-yellow-400 transition-all duration-300 shadow-lg shadow-yellow-400/20">
                  <Cpu className="w-5 h-5 text-black" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xl font-bold text-yellow-400 group-hover:text-yellow-300 transition-colors">TechZone</span>
                  <span className="text-xs text-yellow-400/60">EST. 2020</span>
                </div>
              </Link>
              <motion.p 
                variants={fadeInUp}
                className="text-white/80 mb-6 max-w-sm leading-relaxed text-sm"
              >
                Your ultimate destination for premium PC components and custom builds. 
                We pride ourselves on delivering quality hardware, expert advice, and 
                unbeatable service for tech enthusiasts and professionals alike.
              </motion.p>
              
              {/* Contact Info */}
              <motion.div 
                variants={staggerChildren}
                className="space-y-3 mb-8"
              >
                <motion.div 
                  variants={fadeInUp}
                  className="flex items-center text-sm text-white/70 hover:text-yellow-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center mr-3 border border-yellow-400/30 group-hover:border-yellow-400 transition-all">
                    <Phone className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <span>+1 (555) 123-4567</span>
                </motion.div>
                <motion.div 
                  variants={fadeInUp}
                  className="flex items-center text-sm text-white/70 hover:text-yellow-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center mr-3 border border-yellow-400/30 group-hover:border-yellow-400 transition-all">
                    <Mail className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <span>support@techzone.com</span>
                </motion.div>
                <motion.div 
                  variants={fadeInUp}
                  className="flex items-center text-sm text-white/70 hover:text-yellow-400 transition-colors group"
                >
                  <div className="w-8 h-8 rounded-full bg-black/40 flex items-center justify-center mr-3 border border-yellow-400/30 group-hover:border-yellow-400 transition-all">
                    <MapPin className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <span>123 Tech Street, Silicon Valley, CA</span>
                </motion.div>
              </motion.div>

              {/* Social Links */}
              <motion.div 
                variants={staggerChildren}
                className="flex space-x-3"
              >
                <motion.div variants={fadeInUp}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-white hover:text-yellow-400 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all rounded-full w-9 h-9"
                  >
                    <Facebook className="w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-white hover:text-yellow-400 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all rounded-full w-9 h-9"
                  >
                    <Twitter className="w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-white hover:text-yellow-400 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all rounded-full w-9 h-9"
                  >
                    <Instagram className="w-4 h-4" />
                  </Button>
                </motion.div>
                <motion.div variants={fadeInUp}>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="text-white hover:text-yellow-400 border-yellow-400/30 hover:border-yellow-400 hover:bg-yellow-400/10 transition-all rounded-full w-9 h-9"
                  >
                    <Youtube className="w-4 h-4" />
                  </Button>
                </motion.div>
              </motion.div>
            </motion.div>

          {/* Links Sections */}
          {Object.entries(footerLinks).map(([title, links], index) => (
            <motion.div 
              key={title} 
              variants={fadeInUp}
              className="relative"
              style={{ transitionDelay: `${index * 100}ms` }}
            >
              <h3 className="font-semibold mb-5 text-yellow-400 flex items-center space-x-2 relative">
                <span>{title}</span>
                <span className="h-px bg-yellow-400/50 w-8"></span>
              </h3>
              <motion.ul 
                variants={staggerChildren}
                className="space-y-3"
              >
                {links.map((link, linkIndex) => (
                  <motion.li 
                    key={link.name} 
                    variants={fadeInUp}
                    className="relative group"
                  >
                    <Link 
                      href={link.href}
                      className="text-sm text-white/70 hover:text-yellow-400 transition-colors flex items-center"
                    >
                      <span className="absolute -left-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <span className="text-yellow-400 text-xs">➤</span>
                      </span>
                      {link.name}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          ))}
          </motion.div>

          {/* Newsletter Signup */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="bg-gradient-to-br from-black/80 to-black/60 border border-yellow-400/20 rounded-xl p-8 mb-12 shadow-lg shadow-black/50 relative overflow-hidden"
          >
            {/* Animated glowing dots */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-yellow-400/10 rounded-full blur-xl"></div>
            <div className="absolute bottom-0 left-1/4 w-16 h-16 bg-yellow-400/10 rounded-full blur-xl animate-pulse-slower"></div>
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
              <div className="md:max-w-md">
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 }}
                  className="text-xl font-semibold mb-3 text-yellow-400"
                >
                  Get Tech Insights & Exclusive Deals
                </motion.h3>
                <motion.p 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-sm text-white/80 leading-relaxed"
                >
                  Subscribe to our newsletter for the latest product launches, special offers, 
                  and tech tips delivered straight to your inbox. Join our community of tech enthusiasts today!
                </motion.p>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4 }}
                className="flex flex-col sm:flex-row w-full md:w-auto space-y-3 sm:space-y-0 sm:space-x-3"
              >
                <div className="relative group">
                  <Input 
                    placeholder="Enter your email" 
                    className="md:w-64 bg-black/60 border-yellow-400/30 text-white placeholder-yellow-400/50 focus:border-yellow-400 py-6 pr-4 pl-4 rounded-lg"
                  />
                  <div className="absolute inset-0 -z-10 rounded-lg border border-yellow-400/0 group-focus-within:border-yellow-400/40 opacity-0 group-focus-within:opacity-100 transition-all duration-300"></div>
                </div>
                <Button className="bg-yellow-400 hover:bg-yellow-300 text-black font-semibold py-6 shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 transition-all duration-300 rounded-lg">
                  Subscribe
                </Button>
              </motion.div>
            </div>
          </motion.div>

          <div className="h-px bg-gradient-to-r from-yellow-400/0 via-yellow-400/30 to-yellow-400/0 mb-8"></div>

          {/* Bottom Footer */}
          <motion.div 
            variants={fadeInUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="flex flex-col md:flex-row items-center justify-between text-sm text-white/60 py-4"
          >
            <div className="mb-6 md:mb-0">
              <p>&copy; {currentYear} TechZone. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center gap-x-8 gap-y-3">
              <Link href="/privacy" className="hover:text-yellow-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="hover:text-yellow-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="hover:text-yellow-400 transition-colors">
                Cookie Policy
              </Link>
              <Link href="/accessibility" className="hover:text-yellow-400 transition-colors">
                Accessibility
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </footer>
  );
}
