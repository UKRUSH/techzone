"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Eye,
  Filter,
  BarChart3,
  PieChart,
  LineChart,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Calendar as CalendarIcon,
  Search,
  RefreshCw
} from "lucide-react";

export default function ReportsPage() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState("last30days");
  const [selectedType, setSelectedType] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReports();
  }, [selectedPeriod, selectedType]);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        period: selectedPeriod,
        type: selectedType
      });
      
      const response = await fetch(`/api/admin/reports?${params}`);
      const data = await response.json();
      
      if (data.success) {
        setReports(data.reports);
      } else {
        console.error("Error fetching reports:", data.error);
      }
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setLoading(false);
    }
  };

  const reportTypes = [
    { value: "all", label: "All Reports", icon: FileText },
    { value: "sales", label: "Sales", icon: TrendingUp },
    { value: "inventory", label: "Inventory", icon: Package },
    { value: "customers", label: "Customers", icon: Users },
    { value: "orders", label: "Orders", icon: ShoppingCart },
    { value: "products", label: "Products", icon: Package },
    { value: "revenue", label: "Revenue", icon: DollarSign }
  ];

  const periods = [
    { value: "today", label: "Today" },
    { value: "last7days", label: "Last 7 Days" },
    { value: "last30days", label: "Last 30 Days" },
    { value: "last90days", label: "Last 90 Days" },
    { value: "lastyear", label: "Last Year" }
  ];

  const getReportIcon = (type) => {
    const iconMap = {
      sales: TrendingUp,
      inventory: Package,
      customers: Users,
      orders: ShoppingCart,
      products: Package,
      revenue: DollarSign
    };
    return iconMap[type] || FileText;
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "text-green-400 bg-green-400/10 border-green-400/20";
      case "generating":
        return "text-yellow-400 bg-yellow-400/10 border-yellow-400/20";
      case "failed":
        return "text-red-400 bg-red-400/10 border-red-400/20";
      default:
        return "text-gray-400 bg-gray-400/10 border-gray-400/20";
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesType = selectedType === "all" || report.type === selectedType;
    const matchesSearch = report.name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  const generateNewReport = async (type) => {
    try {
      const response = await fetch('/api/admin/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type,
          period: selectedPeriod,
          name: `${type.charAt(0).toUpperCase() + type.slice(1)} Report`
        }),
      });
      
      const data = await response.json();
      
      if (data.success) {
        console.log(`Generating new ${type} report...`);
        // Refresh reports list to show the new generating report
        fetchReports();
      } else {
        console.error("Error generating report:", data.error);
      }
    } catch (error) {
      console.error("Error generating report:", error);
    }
  };

  const downloadReport = async (reportId) => {
    try {
      // Find the report to get the download URL
      const report = reports.find(r => r.id === reportId);
      if (report && report.downloadUrl) {
        // In a real implementation, this would download the actual file
        window.open(report.downloadUrl, '_blank');
      } else {
        console.log(`Report ${reportId} is not ready for download`);
      }
    } catch (error) {
      console.error("Error downloading report:", error);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-lg flex items-center justify-center">
              <FileText className="w-6 h-6 text-black" />
            </div>
            Reports
          </h1>
          <p className="text-white/60 mt-2">Generate and download detailed business reports</p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchReports}
            className="px-4 py-2 bg-yellow-400/10 text-yellow-400 border border-yellow-400/20 rounded-lg hover:bg-yellow-400/20 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-zinc-800/50 rounded-lg p-6 border border-yellow-400/10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-yellow-400/50" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-black/30 border border-yellow-400/20 rounded-lg py-2 pl-10 pr-4 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50 placeholder-yellow-400/30"
            />
          </div>

          {/* Report Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
          >
            {reportTypes.map(type => (
              <option key={type.value} value={type.value} className="bg-black">
                {type.label}
              </option>
            ))}
          </select>

          {/* Period Filter */}
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-black/30 border border-yellow-400/20 rounded-lg py-2 px-4 text-sm text-white/80 focus:outline-none focus:ring-1 focus:ring-yellow-400/50 focus:border-yellow-400/50"
          >
            {periods.map(period => (
              <option key={period.value} value={period.value} className="bg-black">
                {period.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Quick Report Generation */}
      <div className="bg-zinc-800/50 rounded-lg p-6 border border-yellow-400/10">
        <h3 className="text-lg font-semibold text-white mb-4">Generate New Report</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
          {reportTypes.slice(1).map(type => {
            const Icon = type.icon;
            return (
              <button
                key={type.value}
                onClick={() => generateNewReport(type.value)}
                className="p-4 bg-black/30 hover:bg-yellow-400/10 border border-yellow-400/20 hover:border-yellow-400/40 rounded-lg transition-all group"
              >
                <Icon className="w-6 h-6 text-yellow-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <span className="text-sm text-white/80 group-hover:text-yellow-400 transition-colors">
                  {type.label}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-zinc-800/50 rounded-lg border border-yellow-400/10 overflow-hidden">
        <div className="p-6 border-b border-yellow-400/10">
          <h3 className="text-lg font-semibold text-white">Recent Reports</h3>
          <p className="text-white/60 text-sm">
            Showing {filteredReports.length} of {reports.length} reports
          </p>
        </div>

        {loading ? (
          <div className="p-12 text-center">
            <div className="inline-block w-8 h-8 border-4 border-yellow-400/20 border-l-yellow-400 rounded-full animate-spin"></div>
            <p className="text-white/60 mt-4">Loading reports...</p>
          </div>
        ) : filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-yellow-400/50 mx-auto mb-4" />
            <p className="text-white/60">No reports found</p>
          </div>
        ) : (
          <div className="divide-y divide-yellow-400/10">
            {filteredReports.map((report) => {
              const Icon = getReportIcon(report.type);
              return (
                <motion.div
                  key={report.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-6 hover:bg-yellow-400/5 transition-colors group"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-yellow-400/10 rounded-lg flex items-center justify-center border border-yellow-400/20">
                        <Icon className="w-6 h-6 text-yellow-400" />
                      </div>
                      
                      <div>
                        <h4 className="text-white font-medium group-hover:text-yellow-400 transition-colors">
                          {report.name}
                        </h4>
                        <div className="flex items-center space-x-4 mt-1 text-sm text-white/60">
                          <span className="flex items-center gap-1">
                            <CalendarIcon className="w-3 h-3" />
                            {formatDate(report.generatedAt)}
                          </span>
                          <span>{report.period}</span>
                          {report.size && <span>{report.size}</span>}
                          {report.records > 0 && <span>{report.records.toLocaleString()} records</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-4">
                      {/* Status */}
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                        {report.status}
                      </span>

                      {/* Growth indicator */}
                      {report.growth !== 0 && report.status === "completed" && (
                        <div className={`flex items-center gap-1 text-sm ${
                          report.growth > 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                          {report.growth > 0 ? (
                            <TrendingUp className="w-4 h-4" />
                          ) : (
                            <TrendingDown className="w-4 h-4" />
                          )}
                          <span>{Math.abs(report.growth)}%</span>
                        </div>
                      )}

                      {/* Actions */}
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => downloadReport(report.id)}
                          disabled={report.status !== "completed"}
                          className="p-2 rounded-lg text-white/60 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Download Report"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        
                        <button
                          className="p-2 rounded-lg text-white/60 hover:text-yellow-400 hover:bg-yellow-400/10 transition-colors"
                          title="View Details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
