"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Users,
  Package,
  Calendar,
  Download,
  RefreshCw,
  Eye,
  ArrowUpRight,
  ArrowDownRight
} from "lucide-react";

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

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("30d");

  useEffect(() => {
    fetchAnalytics();
  }, [timeRange]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/admin/analytics?range=${timeRange}`);
      const result = await response.json();
      
      if (result.success) {
        setAnalytics(result.data);
      } else {
        console.error("Error fetching analytics:", result.error);
        setAnalytics(null);
      }
    } catch (error) {
      console.error("Error fetching analytics:", error);
      setAnalytics(null);
    } finally {
      setLoading(false);
    }
  };

  // If no analytics data, show empty state
  const data = analytics || {
    revenue: { current: 0, previous: 0, change: 0 },
    orders: { current: 0, previous: 0, change: 0 },
    customers: { current: 0, previous: 0, change: 0 },
    avgOrderValue: { current: 0, previous: 0, change: 0 },
    topProducts: [],
    salesByCategory: [],
    recentActivity: []
  };

  const mainStats = [
    {
      title: "Total Revenue",
      value: new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR',
        notation: 'compact'
      }).format(data.revenue?.current || 0),
      change: data.revenue?.change || 0,
      icon: DollarSign,
      bg: "from-green-500/20 to-green-600/20",
      iconColor: "text-green-400"
    },
    {
      title: "Total Orders",
      value: (data.orders?.current || 0).toString(),
      change: data.orders?.change || 0,
      icon: ShoppingCart,
      bg: "from-blue-500/20 to-blue-600/20",
      iconColor: "text-blue-400"
    },
    {
      title: "New Customers",
      value: (data.customers?.current || 0).toString(),
      change: data.customers?.change || 0,
      icon: Users,
      bg: "from-purple-500/20 to-purple-600/20",
      iconColor: "text-purple-400"
    },
    {
      title: "Avg Order Value",
      value: new Intl.NumberFormat('en-LK', {
        style: 'currency',
        currency: 'LKR'
      }).format(data.avgOrderValue?.current || 0),
      change: data.avgOrderValue?.change || 0,
      icon: BarChart3,
      bg: "from-yellow-500/20 to-yellow-600/20",
      iconColor: "text-yellow-400"
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-8 h-8 border-4 border-yellow-400/20 border-l-yellow-400 rounded-full animate-spin"></div>
          <p className="text-white/60 mt-4">Loading analytics...</p>
        </div>
      </div>
    );
  }

  // Show empty state if no data available
  if (!analytics || (analytics.revenue.current === 0 && analytics.orders.current === 0)) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-black" />
              </div>
              Analytics
            </h1>
            <p className="text-white/60 mt-2">Monitor your store performance and insights</p>
          </div>
        </div>

        <div className="bg-zinc-800/50 rounded-lg p-12 border border-yellow-400/10 text-center">
          <BarChart3 className="w-16 h-16 text-yellow-400/50 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No Analytics Data Available</h3>
          <p className="text-white/60 mb-6">
            Start selling products to see analytics data. Your charts and statistics will appear here once you have orders.
          </p>
          <Button 
            onClick={fetchAnalytics}
            className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh Data
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative overflow-hidden bg-black min-h-screen">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 bg-yellow-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-yellow-500/10 rounded-full blur-3xl"></div>
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,215,0,0.02)_1px,transparent_1px),linear-gradient(to_right,rgba(255,215,0,0.02)_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      <div className="relative z-10 p-6">
        {/* Header */}
        <motion.div variants={fadeIn} initial="initial" animate="animate" className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 drop-shadow-sm">
                Analytics Dashboard
              </h1>
              <p className="text-white/70 mt-2">Business insights and performance metrics</p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="bg-yellow-400/5 border border-yellow-400/20 text-white rounded-lg px-4 py-2 focus:ring-2 focus:ring-yellow-400/40"
              >
                <option value="7d">Last 7 days</option>
                <option value="30d">Last 30 days</option>
                <option value="90d">Last 90 days</option>
                <option value="1y">Last year</option>
              </select>
              <Button 
                onClick={fetchAnalytics}
                variant="outline" 
                className="border-yellow-400/30 text-yellow-400 hover:bg-yellow-400/10"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Refresh
              </Button>
              <Button className="bg-gradient-to-r from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-black font-semibold">
                <Download className="w-4 h-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>
        </motion.div>

        {/* Main Stats */}
        <motion.div 
          variants={staggerContainer}
          initial="initial"
          animate="animate"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          {mainStats.map((stat, index) => (
            <motion.div key={stat.title} variants={fadeIn}>
              <Card className={`bg-gradient-to-br ${stat.bg} border border-yellow-400/20 backdrop-blur-sm relative overflow-hidden group hover:scale-105 transition-transform`}>
                <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                <CardContent className="p-6 relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-full ${stat.iconColor} bg-black/20`}>
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className={`flex items-center gap-1 text-sm ${stat.change >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {stat.change >= 0 ? <ArrowUpRight className="w-4 h-4" /> : <ArrowDownRight className="w-4 h-4" />}
                      {Math.abs(stat.change)}%
                    </div>
                  </div>
                  <div>
                    <p className="text-white/60 text-sm font-medium">{stat.title}</p>
                    <p className="text-2xl font-bold text-white mt-1">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Top Products */}
          <Card className="bg-black/90 border-yellow-400/20">
            <CardHeader className="border-b border-yellow-400/10">
              <CardTitle className="text-yellow-400">Top Selling Products</CardTitle>
              <CardDescription className="text-white/60">Best performing products by revenue</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.topProducts?.map((product, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-yellow-400/5 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded bg-yellow-400/20 border border-yellow-400/30 flex items-center justify-center text-xs font-bold text-yellow-400">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-white">{product.name}</p>
                        <p className="text-sm text-white/60">{product.units} units sold</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-yellow-400">
                        {new Intl.NumberFormat('en-LK', {
                          style: 'currency',
                          currency: 'LKR',
                          notation: 'compact'
                        }).format(product.revenue)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Sales by Category */}
          <Card className="bg-black/90 border-yellow-400/20">
            <CardHeader className="border-b border-yellow-400/10">
              <CardTitle className="text-yellow-400">Sales by Category</CardTitle>
              <CardDescription className="text-white/60">Revenue distribution across categories</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-4">
                {data.salesByCategory?.map((item, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-white font-medium">{item.category}</span>
                      <span className="text-yellow-400 font-semibold">{item.value}%</span>
                    </div>
                    <div className="w-full bg-yellow-400/10 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${item.value}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="bg-black/90 border-yellow-400/20">
          <CardHeader className="border-b border-yellow-400/10">
            <CardTitle className="text-yellow-400">Recent Activity</CardTitle>
            <CardDescription className="text-white/60">Latest business activities and alerts</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              {data.recentActivity?.map((activity, index) => (
                <motion.div 
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-center justify-between p-3 bg-yellow-400/5 rounded-lg hover:bg-yellow-400/10 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                      activity.type === 'sale' ? 'bg-green-400/20 text-green-400' :
                      activity.type === 'customer' ? 'bg-blue-400/20 text-blue-400' :
                      'bg-yellow-400/20 text-yellow-400'
                    }`}>
                      {activity.type === 'sale' ? <DollarSign className="w-4 h-4" /> :
                       activity.type === 'customer' ? <Users className="w-4 h-4" /> :
                       <Package className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="font-medium text-white">{activity.description}</p>
                      <p className="text-sm text-white/60">{activity.time}</p>
                    </div>
                  </div>
                  {activity.amount && (
                    <div className="text-right">
                      <p className="font-semibold text-yellow-400">
                        {new Intl.NumberFormat('en-LK', {
                          style: 'currency',
                          currency: 'LKR'
                        }).format(activity.amount)}
                      </p>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
