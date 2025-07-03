"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingCart,
  BarChart3,
  Settings,
  Warehouse,
  Tags,
  FileText,
  Bell,
  Search,
  Menu,
  X,
  ChevronDown,
  LogOut,
  User
} from "lucide-react";

const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 }
};

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState(3);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  
  // Handle window resize events
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsCollapsed(true);
      } else {
        setIsCollapsed(false);
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on load
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const sidebarItems = [
    { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
    { name: "Products", href: "/admin/products", icon: Package },
    { name: "Orders", href: "/admin/orders", icon: ShoppingCart },
    { name: "Customers", href: "/admin/customers", icon: Users },
    { name: "Inventory", href: "/admin/inventory", icon: Warehouse },
    { name: "Categories", href: "/admin/categories", icon: Tags },
    { name: "Analytics", href: "/admin/analytics", icon: BarChart3 },
    { name: "Reports", href: "/admin/reports", icon: FileText },
    { name: "Settings", href: "/admin/settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-zinc-900 to-zinc-900">
      <div className="flex">
        {/* Mobile menu button */}
        <div className="fixed top-4 left-4 z-50 lg:hidden">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 rounded-lg bg-black border border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10 transition-colors"
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile overlay */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* Sidebar */}
        <motion.aside 
          className={`fixed top-0 left-0 z-40 h-screen bg-black/95 border-r border-yellow-400/20 shadow-xl transition-all duration-300 ${
            isCollapsed ? 'w-16' : 'w-64'
          } ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          animate={{ width: isCollapsed ? "4rem" : "16rem" }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-4 border-b border-yellow-400/10 flex justify-between items-center">
            <Link href="/" className={`flex items-center space-x-2 group overflow-hidden ${isCollapsed ? 'justify-center' : ''}`}>
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center group-hover:bg-yellow-300 transition-colors shadow-lg">
                <Package className="w-6 h-6 text-black" />
              </div>
              {!isCollapsed && (
                <motion.span 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-xl font-extrabold text-yellow-400 group-hover:text-yellow-300 transition-colors tracking-wide drop-shadow whitespace-nowrap"
                >
                  TechZone
                </motion.span>
              )}
            </Link>
            
            <button 
              className="lg:flex hidden items-center justify-center p-1.5 rounded text-yellow-400/60 hover:text-yellow-400 hover:bg-yellow-400/10"
              onClick={() => setIsCollapsed(!isCollapsed)}
            >
              <ChevronDown className={`h-4 w-4 transform transition-transform ${isCollapsed ? 'rotate-90' : '-rotate-90'}`} />
            </button>
          </div>

          <div className={`py-4 ${!isCollapsed ? 'px-4' : 'px-2'}`}>
            {!isCollapsed && (
              <div className="relative mb-6">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-yellow-400/50" />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  className="w-full bg-yellow-400/5 border border-yellow-400/20 rounded-lg py-2 pl-9 pr-4 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50 placeholder-yellow-400/30"
                />
              </div>
            )}

            <nav className="space-y-1.5">
              <div className={`mb-2 ${isCollapsed ? 'text-center' : ''}`}>
                <span className={`text-[10px] uppercase tracking-wider font-semibold text-yellow-400/50 ${isCollapsed ? 'hidden' : 'block'}`}>
                  Main Menu
                </span>
              </div>

              <ul className="space-y-1">
                {sidebarItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                    <li key={item.name}>
                      <Link
                        href={item.href}
                        className={`flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-3 py-2.5 rounded-lg ${
                          isActive 
                            ? 'bg-yellow-400/20 text-yellow-400 border border-yellow-400/30' 
                            : 'text-white/70 hover:text-yellow-400 hover:bg-yellow-400/10'
                        } transition-all duration-200 group`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`${isActive ? 'bg-yellow-400/20 text-yellow-400' : 'text-white/70'} p-1 rounded`}>
                            <item.icon className={`${isCollapsed ? 'w-5 h-5' : 'w-4 h-4'} group-hover:scale-110 transition-transform`} />
                          </div>
                          
                          {!isCollapsed && (
                            <motion.span
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              className="text-sm font-medium"
                            >
                              {item.name}
                            </motion.span>
                          )}
                        </div>
                        
                        {!isCollapsed && item.name === 'Orders' && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-yellow-400 text-black font-semibold">
                            2
                          </span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
          
          <div className={`absolute bottom-0 left-0 w-full border-t border-yellow-400/10 p-4 ${isCollapsed ? 'text-center' : ''}`}>
            <div className={`flex ${isCollapsed ? 'justify-center' : 'justify-between'} items-center`}>
              <div className={`flex items-center space-x-2 ${isCollapsed ? 'hidden' : ''}`}>
                <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                  <User className="w-4 h-4" />
                </div>
                <div className="text-sm">
                  <p className="font-medium text-white/80">Admin</p>
                  <p className="text-xs text-white/50">admin@techzone.com</p>
                </div>
              </div>
              
              <button className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-yellow-400/10 transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.aside>

        {/* Top Navigation Bar */}
        <div className={`fixed top-0 ${isCollapsed ? 'left-16' : 'left-64'} right-0 z-30 bg-black/30 backdrop-blur-lg border-b border-yellow-400/10 transition-all duration-300 hidden lg:block`}>
          <div className="flex items-center justify-between px-6 h-16">
            <div className="flex items-center space-x-2">
              {/* Breadcrumb would go here */}
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notification dropdown */}
              <div className="relative">
                <button 
                  className="p-2 rounded-lg text-white/70 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors relative"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <Bell className="w-5 h-5" />
                  {notifications > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-yellow-400 rounded-full text-[10px] font-bold text-black flex items-center justify-center">
                      {notifications}
                    </span>
                  )}
                </button>
                
                <AnimatePresence>
                  {isNotificationOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-72 bg-black border border-yellow-400/20 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-3 border-b border-yellow-400/10 flex justify-between items-center">
                        <h3 className="font-medium text-yellow-400">Notifications</h3>
                        <span className="text-xs text-white/50">Clear all</span>
                      </div>
                      <div className="max-h-64 overflow-y-auto">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="p-3 border-b border-yellow-400/5 hover:bg-yellow-400/5 transition-colors">
                            <p className="text-sm text-white/80">New order received #{1000 + i}</p>
                            <p className="text-xs text-white/50 mt-1">{i * 5} min ago</p>
                          </div>
                        ))}
                      </div>
                      <div className="p-2 text-center">
                        <a href="#" className="text-xs text-yellow-400 hover:text-yellow-300">View all notifications</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              {/* Profile dropdown */}
              <div className="relative">
                <button 
                  className="flex items-center space-x-2 p-2 rounded-lg text-white/70 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                >
                  <div className="w-8 h-8 rounded-full bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-yellow-400">
                    <User className="w-4 h-4" />
                  </div>
                  <span className="text-sm font-medium">Admin</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                
                <AnimatePresence>
                  {isProfileOpen && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }} 
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute right-0 mt-2 w-48 bg-black border border-yellow-400/20 rounded-lg shadow-xl z-50"
                    >
                      <div className="p-3 border-b border-yellow-400/10">
                        <p className="font-medium text-white/80">Admin</p>
                        <p className="text-xs text-white/50">admin@techzone.com</p>
                      </div>
                      <div>
                        <a href="#" className="block px-4 py-2 text-sm text-white/70 hover:bg-yellow-400/10 hover:text-yellow-400">Profile</a>
                        <a href="#" className="block px-4 py-2 text-sm text-white/70 hover:bg-yellow-400/10 hover:text-yellow-400">Settings</a>
                        <a href="#" className="block px-4 py-2 text-sm text-white/70 hover:bg-yellow-400/10 hover:text-yellow-400">Logout</a>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <motion.main 
          className={`flex-1 min-h-screen transition-all duration-300 ${
            isCollapsed ? 'ml-16' : 'ml-64'
          } pt-16 lg:p-8 md:p-6 p-4`}
          layout
        >
          <div className="max-w-7xl mx-auto">
            {/* Animated page content */}
            <motion.div
              variants={fadeIn}
              initial="initial"
              animate="animate"
              className="rounded-xl bg-zinc-900/80 shadow-lg p-6 min-h-[80vh] border border-yellow-400/10"
            >
              {children}
            </motion.div>
          </div>
        </motion.main>
      </div>
    </div>
  );
}
