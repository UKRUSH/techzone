"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { 
  Package,
  ShoppingCart,
  Users,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  BarChart3,
  AlertTriangle,
  CheckCircle,
  Clock,
  Activity,
  Zap
} from "lucide-react";

// Animation variants
const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 }
};

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
};

const pulseAnimation = {
  animate: {
    scale: [1, 1.03, 1],
    transition: { 
      repeat: Infinity, 
      repeatType: "reverse", 
      duration: 1.5 
    }
  }
};

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState('');
  
  useEffect(() => {
    // Update time every second
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: "Total Products",
      value: "1,234",
      change: "+12%",
      trend: "up",
      icon: Package,
      color: "from-purple-500 to-blue-500"
    },
    {
      title: "Total Orders",
      value: "856",
      change: "+8%",
      trend: "up",
      icon: ShoppingCart,
      color: "from-green-500 to-emerald-500"
    },
    {
      title: "Total Customers",
      value: "2,341",
      change: "+23%",
      trend: "up",
      icon: Users,
      color: "from-orange-400 to-pink-500"
    },
    {
      title: "Revenue",
      value: "$12,345",
      change: "-2%",
      trend: "down",
      icon: DollarSign,
      color: "from-yellow-400 to-amber-500"
    }
  ];

  return (
    <div className="p-6 relative">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
        {/* Grid pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,215,0,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
        {/* Glowing dots */}
        <div className="absolute top-1/4 left-1/4 h-2 w-2 rounded-full bg-yellow-400/80 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/3 h-2 w-2 rounded-full bg-yellow-400/80 animate-ping"></div>
        <div className="absolute bottom-1/3 right-1/4 h-1.5 w-1.5 rounded-full bg-yellow-400/80 animate-pulse"></div>
      </div>

      <motion.div 
        variants={fadeIn} 
        initial="initial" 
        animate="animate"
        className="mb-8 relative"
      >
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-sm">Dashboard</h1>
            <p className="text-white/70 flex items-center mt-2">
              <Clock className="h-4 w-4 mr-2 text-yellow-400/80" /> 
              <span>{currentTime} • Welcome to TechZone Admin Panel</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-3 mt-4 md:mt-0">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 border border-green-500/30">
              <CheckCircle className="h-3 w-3 mr-1" /> System Online
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">
              <AlertTriangle className="h-3 w-3 mr-1" /> 3 Pending Tasks
            </span>
          </div>
        </div>
      </motion.div>

      {/* Stats Grid */}
      <motion.div 
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
      >
        {stats.map((stat) => (
          <motion.div key={stat.title} variants={fadeIn}>
            <Card className="bg-black border border-yellow-400/20 hover:border-yellow-400/40 transition-all overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br opacity-10 from-transparent to-yellow-500/20"></div>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-white/90">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-full bg-gradient-to-r ${stat.color} shadow-lg`}>
                  <stat.icon className="h-4 w-4 text-white" />
                </div>
              </CardHeader>
              <CardContent>
                <motion.div 
                  variants={pulseAnimation}
                  animate="animate"
                  className="text-3xl font-bold text-yellow-400"
                >
                  {stat.value}
                </motion.div>
                <p className="text-xs font-medium text-white/80 flex items-center mt-2">
                  {stat.trend === "up" ? (
                    <TrendingUp className="h-3 w-3 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="h-3 w-3 text-red-500 mr-1" />
                  )}
                  <span className={stat.trend === "up" ? "text-green-500" : "text-red-500"}>
                    {stat.change}
                  </span>
                  <span className="ml-1">from last month</span>
                </p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions & Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.2 }}
        >
          <Card className="bg-black/90 border-yellow-400/20 border overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5 from-transparent to-yellow-500/20"></div>
            <CardHeader className="border-b border-yellow-400/10">
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Recent Orders</CardTitle>
              <CardDescription className="text-white/60">Latest customer orders</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[1, 2, 3, 4, 5].map((i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-yellow-400/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg hover:bg-yellow-400/10 transition-all cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div>
                      <p className="font-medium text-white flex items-center">
                        Order #{1000 + i} 
                        {i === 1 && <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-yellow-400 text-black rounded uppercase font-bold">New</span>}
                      </p>
                      <p className="text-sm text-white/60">Customer {i}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-yellow-400">${(Math.random() * 1000 + 100).toFixed(2)}</p>
                      <p className="text-xs text-white/60 flex items-center justify-end">
                        {i === 1 ? '2 minutes' : (i * 2) + ' hours'} ago
                        <ArrowUpRight className="ml-1 h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-400/10 text-center">
                <a href="#" className="inline-flex items-center text-sm text-yellow-400 hover:text-yellow-300">
                  View All Orders
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.3 }}
        >
          <Card className="bg-black/90 border-yellow-400/20 border overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br opacity-5 from-transparent to-yellow-500/20"></div>
            <CardHeader className="border-b border-yellow-400/10">
              <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">Top Products</CardTitle>
              <CardDescription className="text-white/60">Best selling products this month</CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="space-y-4">
                {[
                  "AMD Ryzen 9 7900X",
                  "NVIDIA RTX 4080",
                  "Corsair Dominator DDR5",
                  "Samsung 980 PRO SSD",
                  "ASUS ROG Motherboard"
                ].map((product, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="flex items-center justify-between p-3 bg-yellow-400/5 backdrop-blur-sm border border-yellow-400/20 rounded-lg hover:bg-yellow-400/10 transition-all cursor-pointer group"
                    whileHover={{ scale: 1.02 }}
                  >
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded bg-gradient-to-br from-yellow-400/30 to-yellow-600/30 flex items-center justify-center mr-3">
                        <span className="text-xs font-bold text-yellow-400">#{i+1}</span>
                      </div>
                      <div>
                        <p className="font-medium text-white">{product}</p>
                        <p className="text-sm text-white/60">{Math.floor(Math.random() * 50 + 10)} sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium text-yellow-400">${(Math.random() * 500 + 200).toFixed(2)}</p>
                      <div className="mt-1 h-1.5 w-24 bg-gray-800 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full" 
                          style={{ width: `${Math.floor(Math.random() * 50 + 50)}%` }}
                        ></div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t border-yellow-400/10 text-center">
                <a href="#" className="inline-flex items-center text-sm text-yellow-400 hover:text-yellow-300">
                  View All Products
                  <ArrowUpRight className="ml-1 h-3 w-3" />
                </a>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Activity Stream */}
      <motion.div
        variants={fadeIn}
        initial="initial"
        animate="animate" 
        transition={{ delay: 0.4 }}
        className="mb-6"
      >
        <Card className="bg-black/90 border-yellow-400/20 border overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br opacity-5 from-transparent to-yellow-500/20"></div>
          <CardHeader className="border-b border-yellow-400/10">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-500">
                  Activity Stream
                </CardTitle>
                <CardDescription className="text-white/60">Recent system activity</CardDescription>
              </div>
              <div className="flex space-x-2">
                <span className="animate-ping absolute h-2 w-2 rounded-full bg-yellow-400 opacity-75"></span>
                <span className="relative rounded-full h-2 w-2 bg-yellow-500"></span>
                <span className="text-xs text-yellow-400/80">Live</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="relative pl-6 border-l border-yellow-400/20">
              {[
                { icon: Package, text: "New product added", user: "Admin", time: "2 minutes ago" },
                { icon: ShoppingCart, text: "New order #1023 received", user: "System", time: "15 minutes ago" },
                { icon: Users, text: "Customer John Doe registered", user: "System", time: "1 hour ago" },
                { icon: AlertTriangle, text: "Low stock alert for RTX 4090", user: "System", time: "3 hours ago" },
                { icon: DollarSign, text: "Daily sales report generated", user: "System", time: "6 hours ago" }
              ].map((activity, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="mb-6 relative"
                >
                  <div className="absolute -left-[26px] p-1.5 rounded-full bg-black border border-yellow-400/30">
                    <activity.icon className="h-3 w-3 text-yellow-400" />
                  </div>
                  <p className="text-white text-sm">{activity.text}</p>
                  <p className="text-xs text-white/50 flex items-center mt-1">
                    <span className="font-medium text-yellow-400/80">{activity.user}</span>
                    <span className="mx-1">•</span>
                    {activity.time}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.5 }}
        >
          <Card className="bg-gradient-to-br from-black to-zinc-900 border-yellow-400/20 border">
            <CardContent className="flex items-center p-4">
              <div className="p-3 rounded-full bg-yellow-400/10 mr-4">
                <Activity className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Server Status</p>
                <p className="text-white font-medium flex items-center">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></span>
                  Operational
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.6 }}
        >
          <Card className="bg-gradient-to-br from-black to-zinc-900 border-yellow-400/20 border">
            <CardContent className="flex items-center p-4">
              <div className="p-3 rounded-full bg-yellow-400/10 mr-4">
                <BarChart3 className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">Today's Sales</p>
                <p className="text-white font-medium flex items-center">
                  $1,250
                  <span className="ml-2 text-xs text-green-400 flex items-center">
                    <ArrowUpRight className="h-3 w-3" /> +5.2%
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          variants={fadeIn}
          initial="initial"
          animate="animate"
          transition={{ delay: 0.7 }}
        >
          <Card className="bg-gradient-to-br from-black to-zinc-900 border-yellow-400/20 border">
            <CardContent className="flex items-center p-4">
              <div className="p-3 rounded-full bg-yellow-400/10 mr-4">
                <Zap className="h-6 w-6 text-yellow-400" />
              </div>
              <div>
                <p className="text-white/70 text-sm">API Requests</p>
                <p className="text-white font-medium flex items-center">
                  2,345
                  <span className="ml-2 text-xs text-white/50">past 24h</span>
                </p>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
