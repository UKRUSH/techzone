"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/components/providers/CartProvider";
import { 
  Cpu, 
  Monitor, 
  HardDrive, 
  MemoryStick, 
  Microchip, 
  Power, 
  Fan,
  Package,
  Plus,
  Trash2,
  CheckCircle,
  AlertCircle,
  Star,
  Download,
  Share2,
  Copy,
  Zap,
  Settings,
  Eye,
  ShoppingCart,
  Calculator,
  Loader2,
  Gauge,
  TrendingUp,
  TrendingDown,
  Info,
  Save,
  FileText,
  Clock,
  Shield,
  Award,
  Target,
  Activity,
  BarChart3,
  Lightbulb,
  Wrench,
  RefreshCw,
  X,
  Filter,
  SlidersHorizontal,
  Bookmark,
  BookmarkCheck
} from "lucide-react";

const componentCategories = [
  { 
    id: 'cpu', 
    name: 'Processor (CPU)', 
    icon: Cpu, 
    required: true,
    description: 'The brain of your computer - handles all calculations and processing',
    priceRange: '$100 - $800',
    color: 'from-blue-500 to-blue-600',
    powerConsumption: '65W - 170W',
    compatibility: ['motherboard'],
    performance: 95,
    efficiency: 88
  },
  { 
    id: 'motherboard', 
    name: 'Motherboard', 
    icon: Microchip, 
    required: true,
    description: 'The foundation that connects all your components together',
    priceRange: '$80 - $500',
    color: 'from-green-500 to-green-600',
    powerConsumption: '10W - 30W',
    compatibility: ['cpu', 'ram', 'gpu'],
    performance: 85,
    efficiency: 92
  },
  { 
    id: 'ram', 
    name: 'Memory (RAM)', 
    icon: MemoryStick, 
    required: true,
    description: 'System memory for smooth multitasking and performance',
    priceRange: '$50 - $400',
    color: 'from-purple-500 to-purple-600',
    powerConsumption: '2W - 8W',
    compatibility: ['motherboard'],
    performance: 90,
    efficiency: 95
  },
  { 
    id: 'gpu', 
    name: 'Graphics Card (GPU)', 
    icon: Monitor, 
    required: false,
    description: 'Essential for gaming, video editing, and graphics work',
    priceRange: '$200 - $2000',
    color: 'from-red-500 to-red-600',
    powerConsumption: '75W - 450W',
    compatibility: ['motherboard', 'psu'],
    performance: 98,
    efficiency: 75
  },
  { 
    id: 'storage', 
    name: 'Storage (SSD/HDD)', 
    icon: HardDrive, 
    required: true,
    description: 'Store your operating system, applications, and files',
    priceRange: '$50 - $600',
    color: 'from-orange-500 to-orange-600',
    powerConsumption: '2W - 15W',
    compatibility: ['motherboard'],
    performance: 85,
    efficiency: 93
  },
  { 
    id: 'psu', 
    name: 'Power Supply (PSU)', 
    icon: Power, 
    required: true,
    description: 'Provides clean, stable power to all your components',
    priceRange: '$60 - $300',
    color: 'from-yellow-500 to-yellow-600',
    powerConsumption: '500W - 1200W',
    compatibility: ['gpu', 'cpu'],
    performance: 88,
    efficiency: 90
  },
  { 
    id: 'cooling', 
    name: 'CPU Cooler', 
    icon: Fan, 
    required: true,
    description: 'Keeps your processor running at optimal temperatures',
    priceRange: '$30 - $200',
    color: 'from-cyan-500 to-cyan-600',
    powerConsumption: '3W - 25W',
    compatibility: ['cpu', 'case'],
    performance: 82,
    efficiency: 87
  },
  { 
    id: 'case', 
    name: 'PC Case', 
    icon: Package, 
    required: true,
    description: 'Houses and protects all your valuable components',
    priceRange: '$40 - $300',
    color: 'from-gray-500 to-gray-600',
    powerConsumption: '0W',
    compatibility: ['motherboard', 'gpu', 'cooling'],
    performance: 70,
    efficiency: 100
  }
];

export default function PCBuilderPage() {
  const [selectedComponents, setSelectedComponents] = useState({});
  const [totalPrice, setTotalPrice] = useState(0);
  const [buildName, setBuildName] = useState('My Custom PC Build');
  const [activeTab, setActiveTab] = useState('components');
  const [isAnimating, setIsAnimating] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Advanced features
  const [savedBuilds, setSavedBuilds] = useState([]);
  const [showCompatibilityWarnings, setShowCompatibilityWarnings] = useState(true);
  const [performanceMode, setPerformanceMode] = useState('balanced'); // gaming, workstation, budget, balanced
  const [powerConsumption, setPowerConsumption] = useState(0);
  const [compatibilityIssues, setCompatibilityIssues] = useState([]);
  const [buildRecommendations, setBuildRecommendations] = useState([]);
  const [showBuildPresets, setShowBuildPresets] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState(null);
  const [estimatedPerformance, setEstimatedPerformance] = useState(0);
  const [buildTags, setBuildTags] = useState([]);
  const [filterByBudget, setFilterByBudget] = useState({ min: 0, max: 5000 });
  const [showAdvancedStats, setShowAdvancedStats] = useState(false);
  
  const { addToCart } = useCart();

  // Build presets for quick start
  const buildPresets = [
    {
      id: 'gaming-beast',
      name: 'Gaming Beast',
      description: 'High-end gaming with RTX 4080+ performance',
      budget: '$2500-3500',
      tags: ['Gaming', 'High-End', 'RTX'],
      icon: Target,
      components: {
        cpu: { name: 'Intel Core i7-13700K', price: 419, tier: 'Premium', specs: ['16 Cores', '24 Threads', '5.4 GHz'] },
        gpu: { name: 'NVIDIA RTX 4080 Super', price: 999, tier: 'Premium', specs: ['16GB GDDR6X', 'Ray Tracing'] },
        ram: { name: 'Corsair Vengeance 32GB DDR5', price: 299, tier: 'Premium', specs: ['32GB', 'DDR5-5600'] },
        motherboard: { name: 'ASUS ROG Strix Z790', price: 349, tier: 'Premium', specs: ['ATX', 'WiFi 6E'] },
        storage: { name: 'Samsung 980 PRO 2TB', price: 199, tier: 'Premium', specs: ['2TB', 'NVMe SSD'] },
        psu: { name: 'Corsair RM850x', price: 149, tier: 'Premium', specs: ['850W', '80+ Gold'] },
        cooling: { name: 'Corsair H100i RGB', price: 129, tier: 'Premium', specs: ['240mm AIO', 'RGB'] },
        case: { name: 'Fractal Design Define 7', price: 169, tier: 'Premium', specs: ['Mid Tower', 'Tempered Glass'] }
      }
    },
    {
      id: 'workstation-pro',
      name: 'Workstation Pro',
      description: 'Professional workstation for content creation',
      budget: '$3000-4000',
      tags: ['Workstation', 'Content Creation', 'Professional'],
      icon: Wrench,
      components: {
        cpu: { name: 'AMD Ryzen 9 7950X', price: 549, tier: 'Premium', specs: ['16 Cores', '32 Threads', '5.7 GHz'] },
        gpu: { name: 'NVIDIA RTX 4070 Ti', price: 799, tier: 'Premium', specs: ['12GB GDDR6X', 'DLSS 3'] },
        ram: { name: 'G.Skill Trident Z5 64GB', price: 599, tier: 'Premium', specs: ['64GB', 'DDR5-6000'] },
        motherboard: { name: 'MSI PRO X670-P', price: 289, tier: 'Premium', specs: ['ATX', 'WiFi 6'] },
        storage: { name: 'WD Black SN850X 4TB', price: 399, tier: 'Premium', specs: ['4TB', 'NVMe SSD'] },
        psu: { name: 'EVGA SuperNOVA 1000W', price: 199, tier: 'Premium', specs: ['1000W', '80+ Platinum'] },
        cooling: { name: 'Noctua NH-D15', price: 99, tier: 'Mid-Range', specs: ['Dual Tower', 'Silent'] },
        case: { name: 'Be Quiet! Dark Base 700', price: 179, tier: 'Premium', specs: ['Full Tower', 'Silent'] }
      }
    },
    {
      id: 'budget-gamer',
      name: 'Budget Gamer',
      description: 'Affordable gaming build with great performance',
      budget: '$800-1200',
      tags: ['Budget', 'Gaming', 'Value'],
      icon: TrendingUp,
      components: {
        cpu: { name: 'AMD Ryzen 5 7600', price: 229, tier: 'Mid-Range', specs: ['6 Cores', '12 Threads', '5.1 GHz'] },
        gpu: { name: 'AMD RX 7600', price: 269, tier: 'Mid-Range', specs: ['8GB GDDR6', 'RDNA 3'] },
        ram: { name: 'Corsair Vengeance LPX 16GB', price: 79, tier: 'Mid-Range', specs: ['16GB', 'DDR4-3200'] },
        motherboard: { name: 'MSI B650M PRO', price: 129, tier: 'Mid-Range', specs: ['mATX', 'WiFi'] },
        storage: { name: 'Kingston NV2 1TB', price: 59, tier: 'Budget', specs: ['1TB', 'NVMe SSD'] },
        psu: { name: 'Corsair CV650', price: 69, tier: 'Budget', specs: ['650W', '80+ Bronze'] },
        cooling: { name: 'Cooler Master Hyper 212', price: 39, tier: 'Budget', specs: ['Tower Cooler', 'Quiet'] },
        case: { name: 'Fractal Design Core 1000', price: 49, tier: 'Budget', specs: ['Micro ATX', 'Compact'] }
      }
    }
  ];

  // Simulate loading for consistent UX
  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Calculate total price whenever components change
  useEffect(() => {
    const total = Object.values(selectedComponents).reduce((sum, component) => {
      return sum + (component?.price || 0);
    }, 0);
    setTotalPrice(total);
    
    // Calculate power consumption
    const power = Object.entries(selectedComponents).reduce((sum, [categoryId, component]) => {
      const category = componentCategories.find(c => c.id === categoryId);
      if (category && component) {
        const powerRange = category.powerConsumption.match(/(\d+)W/g);
        if (powerRange) {
          const avgPower = powerRange.reduce((acc, p) => acc + parseInt(p), 0) / powerRange.length;
          return sum + avgPower;
        }
      }
      return sum;
    }, 0);
    setPowerConsumption(Math.round(power));
    
    // Calculate estimated performance
    const performance = Object.entries(selectedComponents).reduce((sum, [categoryId, component]) => {
      const category = componentCategories.find(c => c.id === categoryId);
      return sum + (category?.performance || 0);
    }, 0) / Object.keys(selectedComponents).length;
    setEstimatedPerformance(Math.round(performance || 0));
    
    // Check compatibility
    checkCompatibility();
    generateRecommendations();
  }, [selectedComponents]);

  // Check component compatibility
  const checkCompatibility = () => {
    const issues = [];
    const components = selectedComponents;
    
    // Check PSU power sufficiency
    if (components.psu && powerConsumption > 0) {
      const psuWattage = parseInt(components.psu.specs?.find(spec => spec.includes('W'))?.replace('W', '') || '0');
      if (psuWattage < powerConsumption * 1.2) { // 20% overhead recommended
        issues.push({
          type: 'power',
          message: `PSU may be insufficient. Recommended: ${Math.round(powerConsumption * 1.2)}W+`,
          severity: 'warning'
        });
      }
    }
    
    // Check RAM and motherboard compatibility
    if (components.ram && components.motherboard) {
      const ramType = components.ram.specs?.find(spec => spec.includes('DDR'))?.split('-')[0];
      const moboRam = components.motherboard.specs?.find(spec => spec.includes('DDR')) || ramType;
      if (ramType && !moboRam.includes(ramType)) {
        issues.push({
          type: 'ram',
          message: 'RAM type may not be compatible with motherboard',
          severity: 'error'
        });
      }
    }
    
    // Check GPU clearance
    if (components.gpu && components.case) {
      const isFullTower = components.case.specs?.some(spec => spec.includes('Full Tower'));
      const isMidTower = components.case.specs?.some(spec => spec.includes('Mid Tower'));
      const isHighEndGPU = components.gpu.price > 800;
      
      if (isHighEndGPU && !isFullTower && !isMidTower) {
        issues.push({
          type: 'clearance',
          message: 'High-end GPU may not fit in compact case',
          severity: 'warning'
        });
      }
    }
    
    setCompatibilityIssues(issues);
  };

  // Generate build recommendations
  const generateRecommendations = () => {
    const recommendations = [];
    const components = selectedComponents;
    
    // Budget optimization recommendations
    if (totalPrice > 2000 && !components.gpu) {
      recommendations.push({
        type: 'upgrade',
        message: 'Consider adding a dedicated GPU for better gaming performance',
        action: 'Add GPU'
      });
    }
    
    if (totalPrice < 1000 && components.cpu?.tier === 'Premium') {
      recommendations.push({
        type: 'optimize',
        message: 'Consider a mid-range CPU to balance your budget better',
        action: 'Optimize CPU'
      });
    }
    
    // Performance recommendations
    if (components.cpu && components.gpu) {
      const cpuPrice = components.cpu.price;
      const gpuPrice = components.gpu.price;
      
      if (cpuPrice / gpuPrice > 1.5) {
        recommendations.push({
          type: 'balance',
          message: 'CPU seems overspecced for GPU. Consider balancing the build',
          action: 'Balance Build'
        });
      }
    }
    
    setBuildRecommendations(recommendations);
  };

  // Handle component selection with enhanced features
  const handleComponentSelect = (categoryId, tier = 'mid', customComponent = null) => {
    const category = componentCategories.find(c => c.id === categoryId);
    
    let selectedComponent;
    
    if (customComponent) {
      selectedComponent = customComponent;
    } else {
      // Enhanced component generation with more realistic specs
      const componentOptions = {
        premium: { 
          name: `Premium ${category.name}`, 
          price: Math.floor(Math.random() * 400) + 300,
          tier: 'Premium',
          specs: generateSpecs(categoryId, 'premium'),
          benchmarkScore: Math.floor(Math.random() * 20) + 80,
          efficiency: Math.floor(Math.random() * 15) + 85
        },
        mid: { 
          name: `Mid-Range ${category.name}`, 
          price: Math.floor(Math.random() * 200) + 150,
          tier: 'Mid-Range',
          specs: generateSpecs(categoryId, 'mid'),
          benchmarkScore: Math.floor(Math.random() * 20) + 60,
          efficiency: Math.floor(Math.random() * 15) + 70
        },
        budget: { 
          name: `Budget ${category.name}`, 
          price: Math.floor(Math.random() * 100) + 50,
          tier: 'Budget',
          specs: generateSpecs(categoryId, 'budget'),
          benchmarkScore: Math.floor(Math.random() * 20) + 40,
          efficiency: Math.floor(Math.random() * 15) + 55
        }
      };
      selectedComponent = componentOptions[tier];
    }
    
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedComponents(prev => ({
        ...prev,
        [categoryId]: selectedComponent
      }));
      setIsAnimating(false);
    }, 300);
  };

  // Generate realistic specs based on component type and tier
  const generateSpecs = (categoryId, tier) => {
    const specs = {
      cpu: {
        premium: ['12-16 Cores', '24-32 Threads', '5.4-5.8 GHz Boost'],
        mid: ['6-8 Cores', '12-16 Threads', '4.8-5.2 GHz Boost'],
        budget: ['4-6 Cores', '8-12 Threads', '4.2-4.6 GHz Boost']
      },
      gpu: {
        premium: ['16-24GB VRAM', 'Ray Tracing', 'DLSS 3.0'],
        mid: ['8-12GB VRAM', 'Ray Tracing', 'DLSS 2.0'],
        budget: ['6-8GB VRAM', 'DirectX 12', 'FSR Support']
      },
      ram: {
        premium: ['32-64GB', 'DDR5-6000+', 'RGB Lighting'],
        mid: ['16-32GB', 'DDR4-3600', 'Heat Spreaders'],
        budget: ['8-16GB', 'DDR4-3200', 'Standard']
      },
      motherboard: {
        premium: ['ATX/E-ATX', 'WiFi 6E', 'USB 3.2 Gen2'],
        mid: ['ATX/mATX', 'WiFi 6', 'USB 3.2 Gen1'],
        budget: ['mATX/Mini-ITX', 'Ethernet', 'USB 3.0']
      },
      storage: {
        premium: ['2-4TB', 'NVMe Gen4', '7000+ MB/s'],
        mid: ['1-2TB', 'NVMe Gen3', '3500+ MB/s'],
        budget: ['500GB-1TB', 'SATA SSD', '550+ MB/s']
      },
      psu: {
        premium: ['850-1200W', '80+ Platinum', 'Modular'],
        mid: ['650-850W', '80+ Gold', 'Semi-Modular'],
        budget: ['500-650W', '80+ Bronze', 'Non-Modular']
      },
      cooling: {
        premium: ['280-360mm AIO', 'RGB Lighting', 'PWM Fans'],
        mid: ['240mm AIO', 'Quiet Operation', 'PWM Fans'],
        budget: ['Tower Cooler', 'Silent', 'Standard Fans']
      },
      case: {
        premium: ['Full/Mid Tower', 'Tempered Glass', 'RGB Support'],
        mid: ['Mid Tower', 'Side Panel', 'Good Airflow'],
        budget: ['Micro/Mini', 'Basic Design', 'Compact']
      }
    };
    
    return specs[categoryId]?.[tier] || ['Standard', 'Compatible', 'Reliable'];
  };

  // Load preset build
  const loadPreset = (preset) => {
    setSelectedComponents(preset.components);
    setBuildName(preset.name);
    setSelectedPreset(preset.id);
    setShowBuildPresets(false);
    
    // Auto-generate tags based on preset
    setBuildTags(preset.tags);
  };

  // Save current build
  const saveBuild = () => {
    const newBuild = {
      id: Date.now(),
      name: buildName,
      components: selectedComponents,
      totalPrice,
      powerConsumption,
      estimatedPerformance,
      tags: buildTags,
      createdAt: new Date().toISOString()
    };
    
    setSavedBuilds(prev => [...prev, newBuild]);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };

  // Clear all components
  const clearBuild = () => {
    setSelectedComponents({});
    setBuildName('My Custom PC Build');
    setSelectedPreset(null);
    setBuildTags([]);
  };

  // Remove component
  const removeComponent = (categoryId) => {
    setSelectedComponents(prev => {
      const newComponents = { ...prev };
      delete newComponents[categoryId];
      return newComponents;
    });
  };

  // Check if build is complete
  const isComplete = componentCategories
    .filter(cat => cat.required)
    .every(cat => selectedComponents[cat.id]);

  const completionPercentage = Math.round(
    (Object.keys(selectedComponents).length / componentCategories.length) * 100
  );

  // Add to cart functionality
  const handleAddToCart = async () => {
    if (!isComplete) {
      return;
    }
    
    try {
      const buildItem = {
        id: `build-${Date.now()}`,
        name: buildName,
        price: totalPrice,
        category: 'PC Build',
        components: selectedComponents,
        image: '/api/placeholder/300/300'
      };
      
      await addToCart(buildItem);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Copy build to clipboard
  const handleCopyBuild = async () => {
    const buildText = [
      `${buildName}`,
      `Total Cost: $${totalPrice.toLocaleString()}`,
      '',
      'Components:',
      ...Object.entries(selectedComponents).map(([key, component]) => 
        `${componentCategories.find(c => c.id === key)?.name}: ${component.name} - $${component.price}`
      )
    ].join('\n');
    
    try {
      await navigator.clipboard.writeText(buildText);
      // Could add toast notification here
    } catch (error) {
      console.error('Failed to copy build', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen relative overflow-hidden">
          {/* Enhanced background with advanced patterns and animations - matching products page */}
          <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-yellow-950/20 z-0"></div>
          
          {/* Animated yellow orbs with advanced glow effects */}
          <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-yellow-500/20 to-amber-600/5 blur-3xl animate-pulse-slower"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-bl from-yellow-300/20 to-yellow-500/5 blur-3xl animate-pulse-slow"></div>
          
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center">
                <div className="mb-6">
                  <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto mb-4" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full border-2 border-yellow-400/20 animate-ping-slow"></div>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Loading PC Builder Studio</h2>
                <p className="text-gray-400">Preparing your custom PC configuration tool...</p>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <div className="min-h-screen relative overflow-hidden">
        {/* Enhanced background with advanced patterns and animations - matching products page */}
        <div className="absolute inset-0 bg-gradient-to-b from-black via-zinc-950 to-yellow-950/20 z-0"></div>
        
        {/* Dynamic animated wave patterns */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 right-0 h-[200px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTI4OCA0NDYuNUMtMjEuOCAzMDcuMSAxMzYuNiA0MTMuMSAyNDMuNyAzMzUuNkM0MTIuMyAyMTcuMiA1NDMuMSA0MTEuMyA3MTkuMiAzMDNDODY0LjcgMjE2LjUgOTI3LjEgMzYwLjggMTEzMC43IDI0OEMxMzk3LjMgOTguNiAxNDMwLjIgMzc2LjQgMTYyMC44IDI2MC4xQzE3ODMuMSAxNjEuNSAxODc3LjEgMzU3LjMgMjAxMC40IDI3Ny42IiBzdHJva2U9IiNGRkQzMDAiIHN0cm9rZS13aWR0aD0iMyIvPjwvc3ZnPg==')] bg-no-repeat bg-cover animate-pulse-slower"></div>
          <div className="absolute bottom-0 left-0 right-0 h-[200px] bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTQ0MCIgaGVpZ2h0PSI1MDAiIHZpZXdCb3g9IjAgMCAxNDQwIDUwMCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNLTM5NyAxOTkuMUMtMTMwLjggMzM4LjUgMjcuNiAyMzIuNSAxMzQuNyAzMDkuOUMzMDMuMyA0MjguMyA0MzQuMSAyMzQuMiA2MTAuMiAzNDIuNUM3NTUuNyA0MjkgODE4LjEgMjg0LjcgMTAyMS43IDM5Ny41QzEyODguMyA1NDYuOSAxMzIxLjIgMjY5LjEgMTUxMS44IDM4NS40QzE2NzQuMSA0ODQgMTc2OC4xIDI4OC4yIDE5MDEuNCAzNjcuOSIgc3Ryb2tlPSIjRkZEMzAwIiBzdHJva2Utd2lkdGg9IjMiLz48L3N2Zz4=')] bg-no-repeat bg-cover animate-pulse-slow"></div>
        </div>
        
        {/* Animated yellow orbs with advanced glow effects */}
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-gradient-to-br from-yellow-400/20 to-yellow-600/5 blur-3xl animate-pulse-slow"></div>
        <div className="absolute top-1/3 -left-40 w-96 h-96 rounded-full bg-gradient-to-tr from-yellow-500/20 to-amber-600/5 blur-3xl animate-pulse-slower"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 rounded-full bg-gradient-to-bl from-yellow-300/20 to-yellow-500/5 blur-3xl animate-pulse-slow"></div>
        
        {/* Advanced glow focal points */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 rounded-full bg-gradient-to-r from-yellow-400/15 via-yellow-300/10 to-yellow-500/5 blur-3xl animate-pulse-slower"></div>
        <div className="absolute bottom-1/3 left-1/4 w-72 h-72 rounded-full bg-gradient-to-l from-yellow-400/15 via-yellow-300/10 to-yellow-500/5 blur-3xl animate-pulse-slow"></div>
        
        {/* Black overlay with improved depth effect */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/70 z-1"></div>
        
        {/* Enhanced grid pattern overlay with subtle animation */}
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0wIDBoNjB2NjBIMHoiLz48cGF0aCBkPSJNMzAgMzBoMzB2MzBIMzB6IiBzdHJva2U9InJnYmEoMjU1LDIxNSwwLDAuMDgpIiBzdHJva2Utd2lkdGg9Ii41Ii8+PHBhdGggZD0iTTAgMzBoMzB2MzBIMHoiIHN0cm9rZT0icmdiYSgyNTUsMjE1LDAsMC4wOCkiIHN0cm9rZS13aWR0aD0iLjUiLz48L2c+PC9zdmc+')] opacity-30 z-1 animate-pulse-slower"></div>
        
        {/* Diagonal yellow streaks */}
        <div className="absolute inset-0 overflow-hidden z-1 opacity-10">
          <div className="absolute -left-full -bottom-full w-[200%] h-[200%] bg-[repeating-linear-gradient(45deg,transparent,transparent_40px,rgba(255,215,0,0.1)_40px,rgba(255,215,0,0.1)_80px)] transform rotate-45"></div>
        </div>
        
        {/* Advanced animated glowing dots with interactive effects */}
        <div className="absolute top-40 right-20 w-3 h-3 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-400/40 animate-ping-slow z-2"></div>
        <div className="absolute top-1/2 left-32 w-2 h-2 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/40 animate-ping-slower z-2"></div>
        <div className="absolute bottom-40 right-1/3 w-2.5 h-2.5 rounded-full bg-gradient-to-r from-yellow-200 to-yellow-400 shadow-lg shadow-yellow-300/40 animate-ping-slow z-2"></div>
        <div className="absolute top-2/3 left-1/4 w-2 h-2 rounded-full bg-gradient-to-r from-yellow-300 to-yellow-500 shadow-lg shadow-yellow-400/40 animate-ping-slow z-2"></div>
        <div className="absolute top-1/4 left-2/3 w-1.5 h-1.5 rounded-full bg-gradient-to-r from-yellow-400 to-yellow-600 shadow-lg shadow-yellow-500/40 animate-ping-slower z-2"></div>

        {/* Success Notification */}
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-20 right-4 z-50 bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg shadow-lg shadow-green-400/20 border border-green-400/30"
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              PC Build added to cart successfully!
            </div>
          </motion.div>
        )}

        <div className="container mx-auto px-4 py-12 relative z-10">
          {/* Hero Section */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="mb-6">
              <h1 className="text-4xl md:text-6xl font-bold mb-4">
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  PC Builder Studio
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-6">
                Create your perfect custom PC build with our advanced configuration tool. 
                Choose from premium components and get real-time compatibility checks.
              </p>
            </div>

            {/* Build Status Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto mb-8">
              <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    {isComplete ? (
                      <CheckCircle className="h-8 w-8 text-green-400" />
                    ) : (
                      <AlertCircle className="h-8 w-8 text-yellow-400" />
                    )}
                    <div className="text-left">
                      <p className="text-sm text-gray-400">Build Status</p>
                      <p className="font-semibold text-white">
                        {isComplete ? 'Complete' : `${completionPercentage}% Complete`}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Calculator className="h-8 w-8 text-yellow-400" />
                    <div className="text-left">
                      <p className="text-sm text-gray-400">Total Cost</p>
                      <p className="font-semibold text-white">${totalPrice.toLocaleString()}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <Star className="h-8 w-8 text-yellow-400" />
                    <div className="text-left">
                      <p className="text-sm text-gray-400">Build Rating</p>
                      <div className="flex gap-1">
                        {Array.from({length: 5}).map((_, i) => (
                          <Star 
                            key={i} 
                            className={`h-4 w-4 ${
                              i < Math.min(5, Math.floor(totalPrice / 300)) 
                                ? 'text-yellow-400 fill-current' 
                                : 'text-gray-600'
                            }`} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Build Name Input */}
            <div className="max-w-md mx-auto mb-8">
              <Input
                value={buildName}
                onChange={(e) => setBuildName(e.target.value)}
                placeholder="Enter build name..."
                className="bg-black/60 border-yellow-400/30 text-white placeholder-gray-400 text-center text-lg focus:ring-2 focus:ring-yellow-400/40 focus:border-yellow-400 transition-all shadow-inner shadow-yellow-400/5"
              />
            </div>
          </motion.div>

          {/* Enhanced Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <div className="flex backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 rounded-lg p-1 shadow-xl shadow-yellow-400/10">
              {[
                { id: 'presets', label: 'Presets', icon: Bookmark },
                { id: 'components', label: 'Components', icon: Settings },
                { id: 'compatibility', label: 'Compatibility', icon: Shield },
                { id: 'performance', label: 'Performance', icon: BarChart3 },
                { id: 'summary', label: 'Summary', icon: Calculator },
                { id: 'preview', label: 'Preview', icon: Eye }
              ].map(tab => {
                const Icon = tab.icon;
                return (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "ghost"}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 transition-all duration-200 px-4 py-2 rounded-md font-medium ${
                      activeTab === tab.id 
                        ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700 shadow-lg border-0' 
                        : 'text-gray-300 hover:text-white hover:bg-yellow-400/20 bg-black/20 border border-yellow-400/20 hover:border-yellow-400/40'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Advanced Control Panel */}
          <div className="flex justify-center mb-8 gap-4">
            <Button
              variant="outline"
              onClick={() => setShowBuildPresets(!showBuildPresets)}
              className="border-yellow-400/50 text-yellow-400 hover:border-yellow-400/80 hover:bg-yellow-400/20 bg-black/40 transition-all duration-200 font-medium"
            >
              <Bookmark className="h-4 w-4 mr-2" />
              Quick Presets
            </Button>
            
            <Button
              variant="outline"
              onClick={saveBuild}
              disabled={Object.keys(selectedComponents).length === 0}
              className="border-green-400/50 text-green-400 hover:border-green-400/80 hover:bg-green-400/20 bg-black/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Build
            </Button>
            
            <Button
              variant="outline"
              onClick={clearBuild}
              className="border-red-400/50 text-red-400 hover:border-red-400/80 hover:bg-red-400/20 bg-black/40 transition-all duration-200 font-medium"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Clear All
            </Button>
            
            <Button
              variant="outline"
              onClick={() => setShowAdvancedStats(!showAdvancedStats)}
              className="border-purple-400/50 text-purple-400 hover:border-purple-400/80 hover:bg-purple-400/20 bg-black/40 transition-all duration-200 font-medium"
            >
              <Activity className="h-4 w-4 mr-2" />
              {showAdvancedStats ? 'Hide' : 'Show'} Stats
            </Button>
          </div>

          {/* Build Presets Modal */}
          {showBuildPresets && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
              onClick={() => setShowBuildPresets(false)}
            >
              <Card 
                className="w-full max-w-4xl max-h-[80vh] overflow-y-auto backdrop-blur-sm bg-gradient-to-b from-black/95 via-black/90 to-black/95 border border-yellow-400/30 shadow-xl shadow-yellow-400/20"
                onClick={(e) => e.stopPropagation()}
              >
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="text-yellow-400 text-2xl">Choose a Build Preset</CardTitle>
                    <Button 
                      variant="ghost" 
                      onClick={() => setShowBuildPresets(false)}
                      className="text-gray-400 hover:text-white hover:bg-red-400/20 transition-all duration-200 border border-transparent hover:border-red-400/30"
                    >
                      <X className="h-6 w-6" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {buildPresets.map((preset) => {
                      const PresetIcon = preset.icon;
                      return (
                        <Card 
                          key={preset.id}
                          className="cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-gradient-to-b from-black/80 via-black/70 to-black/80 border border-yellow-400/20 hover:border-yellow-400/40"
                          onClick={() => loadPreset(preset)}
                        >
                          <CardHeader>
                            <CardTitle className="flex items-center gap-3">
                              <PresetIcon className="h-6 w-6 text-yellow-400" />
                              <span className="text-white">{preset.name}</span>
                            </CardTitle>
                            <CardDescription className="text-gray-400">
                              {preset.description}
                            </CardDescription>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-3">
                              <div className="flex justify-between">
                                <span className="text-gray-300">Budget:</span>
                                <span className="text-yellow-400">{preset.budget}</span>
                              </div>
                              <div className="flex flex-wrap gap-1">
                                {preset.tags.map(tag => (
                                  <Badge key={tag} variant="outline" className="text-xs border-yellow-400/30 text-yellow-400">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                              <div className="text-sm text-gray-400">
                                {Object.keys(preset.components).length} components included
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Presets Tab */}
          {activeTab === 'presets' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {buildPresets.map((preset) => {
                  const PresetIcon = preset.icon;
                  return (
                    <Card 
                      key={preset.id}
                      className="cursor-pointer transition-all duration-300 hover:scale-105 backdrop-blur-sm bg-gradient-to-b from-black/80 via-black/70 to-black/80 border border-yellow-400/30 hover:border-yellow-400/50 shadow-xl shadow-yellow-400/10"
                      onClick={() => loadPreset(preset)}
                    >
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-gradient-to-r from-yellow-400/20 to-yellow-600/10">
                            <PresetIcon className="h-6 w-6 text-yellow-400" />
                          </div>
                          <span className="text-white">{preset.name}</span>
                        </CardTitle>
                        <CardDescription className="text-gray-400">
                          {preset.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-gray-300">Budget Range:</span>
                            <span className="text-yellow-400 font-semibold">{preset.budget}</span>
                          </div>
                          <div className="flex flex-wrap gap-1">
                            {preset.tags.map(tag => (
                              <Badge key={tag} variant="outline" className="text-xs border-yellow-400/30 text-yellow-400">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className="text-gray-400">Components:</div>
                            <div className="text-white">{Object.keys(preset.components).length}</div>
                            <div className="text-gray-400">Est. Performance:</div>
                            <div className="text-green-400">Excellent</div>
                          </div>
                          <Button 
                            className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-black hover:from-yellow-600 hover:to-yellow-700"
                            onClick={(e) => {
                              e.stopPropagation();
                              loadPreset(preset);
                            }}
                          >
                            Load This Build
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Compatibility Tab */}
          {activeTab === 'compatibility' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10 mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <Shield className="h-6 w-6" />
                    Compatibility Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {compatibilityIssues.length === 0 ? (
                    <div className="text-center py-8">
                      <CheckCircle className="h-16 w-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-white mb-2">All Components Compatible!</h3>
                      <p className="text-gray-400">No compatibility issues detected with your current build.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {compatibilityIssues.map((issue, index) => (
                        <div 
                          key={index}
                          className={`p-4 rounded-lg border ${
                            issue.severity === 'error' 
                              ? 'bg-red-900/20 border-red-400/40 text-red-300' 
                              : 'bg-yellow-900/20 border-yellow-400/40 text-yellow-300'
                          }`}
                        >
                          <div className="flex items-center gap-2 mb-2">
                            {issue.severity === 'error' ? 
                              <AlertCircle className="h-5 w-5" /> : 
                              <Info className="h-5 w-5" />
                            }
                            <span className="font-semibold">
                              {issue.severity === 'error' ? 'Compatibility Error' : 'Warning'}
                            </span>
                          </div>
                          <p>{issue.message}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Build Recommendations */}
              {buildRecommendations.length > 0 && (
                <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400">
                      <Lightbulb className="h-6 w-6" />
                      Build Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {buildRecommendations.map((rec, index) => (
                        <div key={index} className="p-4 bg-gradient-to-r from-blue-900/20 to-blue-800/10 rounded-lg border border-blue-400/30">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="flex items-center gap-2 mb-2">
                                <Info className="h-4 w-4 text-blue-400" />
                                <span className="font-semibold text-blue-300 capitalize">{rec.type}</span>
                              </div>
                              <p className="text-gray-300">{rec.message}</p>
                            </div>
                            <Button 
                              size="sm"
                              variant="outline"
                              className="border-blue-400/50 text-blue-400 hover:border-blue-400/80 hover:bg-blue-400/20 bg-black/40 transition-all duration-200 font-medium"
                            >
                              {rec.action}
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}

          {/* Performance Tab */}
          {activeTab === 'performance' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Performance Metrics */}
                <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400">
                      <BarChart3 className="h-6 w-6" />
                      Performance Metrics
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Overall Score</span>
                        <span className="text-2xl font-bold text-yellow-400">{estimatedPerformance}/100</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${estimatedPerformance}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Separator className="bg-yellow-400/20" />
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Gaming:</span>
                        <span className="text-green-400">
                          {estimatedPerformance > 80 ? 'Excellent' : estimatedPerformance > 60 ? 'Good' : 'Fair'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Productivity:</span>
                        <span className="text-blue-400">
                          {estimatedPerformance > 75 ? 'Excellent' : estimatedPerformance > 55 ? 'Good' : 'Fair'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Content Creation:</span>
                        <span className="text-purple-400">
                          {estimatedPerformance > 70 ? 'Excellent' : estimatedPerformance > 50 ? 'Good' : 'Fair'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Power Efficiency:</span>
                        <span className="text-cyan-400">
                          {powerConsumption < 400 ? 'Excellent' : powerConsumption < 600 ? 'Good' : 'Fair'}
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Power & Thermal */}
                <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400">
                      <Gauge className="h-6 w-6" />
                      Power & Thermal
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-300">Power Consumption</span>
                        <span className="text-2xl font-bold text-red-400">{powerConsumption}W</span>
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full transition-all duration-500 ${
                            powerConsumption > 800 ? 'bg-gradient-to-r from-red-500 to-red-600' :
                            powerConsumption > 500 ? 'bg-gradient-to-r from-yellow-500 to-orange-500' :
                            'bg-gradient-to-r from-green-400 to-green-600'
                          }`}
                          style={{ width: `${Math.min(powerConsumption / 10, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <Separator className="bg-yellow-400/20" />
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Est. Monthly Cost:</span>
                        <span className="text-yellow-400">${Math.round(powerConsumption * 0.12 * 24 * 30 / 1000)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Thermal Output:</span>
                        <span className="text-orange-400">
                          {powerConsumption > 600 ? 'High' : powerConsumption > 300 ? 'Medium' : 'Low'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Recommended PSU:</span>
                        <span className="text-cyan-400">{Math.round(powerConsumption * 1.2)}W+</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Detailed Component Performance */}
              {Object.keys(selectedComponents).length > 0 && (
                <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-yellow-400">
                      <Activity className="h-6 w-6" />
                      Component Performance Breakdown
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Object.entries(selectedComponents).map(([categoryId, component]) => {
                        const category = componentCategories.find(c => c.id === categoryId);
                        const IconComponent = category?.icon;
                        return (
                          <div key={categoryId} className="p-4 bg-gradient-to-r from-black/80 to-black/60 rounded-lg border border-yellow-400/20">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                {IconComponent && <IconComponent className="h-5 w-5 text-yellow-400" />}
                                <div>
                                  <div className="font-semibold text-white">{component.name}</div>
                                  <div className="text-sm text-gray-400">{category?.name}</div>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className="text-yellow-400 font-semibold">
                                  {component.benchmarkScore || Math.floor(Math.random() * 30) + 70}/100
                                </div>
                                <div className="text-xs text-gray-400">Performance Score</div>
                              </div>
                            </div>
                            {component.specs && (
                              <div className="mt-3 flex flex-wrap gap-2">
                                {component.specs.map((spec, index) => (
                                  <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                    {spec}
                                  </Badge>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              )}
            </motion.div>
          )}
          {activeTab === 'components' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                {componentCategories.map((category, index) => {
                  const IconComponent = category.icon;
                  const selectedComponent = selectedComponents[category.id];
                  
                  return (
                    <motion.div
                      key={category.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card className={`h-full transition-all duration-300 hover:scale-105 backdrop-blur-sm border shadow-xl ${
                        selectedComponent 
                          ? 'bg-gradient-to-b from-black/90 via-black/80 to-black/90 border-yellow-400/50 shadow-yellow-400/20' 
                          : 'bg-gradient-to-b from-black/80 via-black/70 to-black/80 border-yellow-400/30 hover:border-yellow-400/40 shadow-yellow-400/10'
                      }`}>
                        <CardHeader>
                          {/* Pulsing corner accent */}
                          <div className="absolute top-0 left-0 w-16 h-16">
                            <div className={`absolute top-0 left-0 w-full h-full ${
                              selectedComponent 
                                ? 'bg-gradient-to-br from-yellow-400/40 to-transparent' 
                                : 'bg-gradient-to-br from-yellow-400/20 to-transparent'
                            } rounded-tl-xl`}></div>
                            <div className={`absolute top-2 left-2 w-2 h-2 rounded-full ${
                              selectedComponent ? 'bg-yellow-400/90' : 'bg-yellow-400/60'
                            } animate-pulse-slow`}></div>
                          </div>
                          
                          <CardTitle className="flex items-center gap-3 relative z-10">
                            <div className={`p-2 rounded-lg ${
                              selectedComponent 
                                ? `bg-gradient-to-r ${category.color}` 
                                : 'bg-gradient-to-r from-yellow-400/20 to-yellow-600/10'
                            }`}>
                              <IconComponent className={`h-6 w-6 ${
                                selectedComponent ? 'text-white' : 'text-yellow-400'
                              }`} />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center gap-2">
                                <span className="text-white text-lg">{category.name}</span>
                                {category.required && (
                                  <Badge variant="destructive" className="text-xs bg-gradient-to-r from-red-500 to-red-600">Required</Badge>
                                )}
                              </div>
                              <p className="text-sm text-yellow-400/80 font-normal">
                                {category.priceRange}
                              </p>
                            </div>
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {category.description}
                          </CardDescription>
                        </CardHeader>
                        
                        <CardContent>
                          {selectedComponent ? (
                            <div className="space-y-4">
                              <div className="p-4 bg-gradient-to-r from-black/80 to-black/60 rounded-lg border border-yellow-400/40 shadow-inner shadow-yellow-400/10">
                                <div className="flex justify-between items-start mb-3">
                                  <div>
                                    <h4 className="font-semibold text-yellow-300">{selectedComponent.name}</h4>
                                    <p className="text-yellow-400/90">${selectedComponent.price.toLocaleString()}</p>
                                    <Badge variant="outline" className="mt-1 text-xs border-yellow-400/40 text-yellow-400">
                                      {selectedComponent.tier}
                                    </Badge>
                                  </div>
                                  <Button 
                                    variant="ghost" 
                                    size="sm"
                                    onClick={() => removeComponent(category.id)}
                                    className="text-gray-400 hover:text-red-400 hover:bg-red-400/20 transition-all duration-200 border border-transparent hover:border-red-400/30"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-3 gap-2">
                                {['budget', 'mid', 'premium'].map((tier) => (
                                  <Button
                                    key={tier}
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleComponentSelect(category.id, tier)}
                                    className="text-xs capitalize border-yellow-400/40 text-yellow-400 hover:border-yellow-400/70 hover:bg-yellow-400/20 hover:text-yellow-300 transition-all duration-200 bg-black/40"
                                  >
                                    {tier}
                                  </Button>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3">
                              {['premium', 'mid', 'budget'].map((tier) => (
                                <Button 
                                  key={tier}
                                  onClick={() => handleComponentSelect(category.id, tier)}
                                  className={`w-full justify-start gap-2 bg-gradient-to-r ${category.color} hover:opacity-90 hover:scale-[1.02] transition-all duration-200 shadow-lg hover:shadow-xl text-white font-medium border border-white/10 hover:border-white/20`}
                                >
                                  <Plus className="h-4 w-4" />
                                  Select {tier.charAt(0).toUpperCase() + tier.slice(1)} {category.name}
                                </Button>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* Summary Tab */}
          {activeTab === 'summary' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                {/* Pulsing corner accent */}
                <div className="absolute top-0 left-0 w-24 h-24">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/30 to-transparent rounded-tl-xl"></div>
                  <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-yellow-400/80 animate-pulse-slow"></div>
                </div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5">
                      <Calculator className="h-6 w-6 text-yellow-400" />
                    </div>
                    Build Summary: {buildName}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Components List */}
                  <div className="space-y-4">
                    {componentCategories.map(category => {
                      const component = selectedComponents[category.id];
                      const IconComponent = category.icon;
                      
                      return (
                        <div key={category.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-black/80 to-black/60 rounded-lg border border-yellow-400/20">
                          <div className="flex items-center gap-3">
                            <div className="p-1.5 rounded-full bg-yellow-400/10">
                              <IconComponent className="h-5 w-5 text-yellow-400/70" />
                            </div>
                            <span className="text-gray-300">{category.name}</span>
                          </div>
                          <div className="text-right">
                            {component ? (
                              <div>
                                <p className="font-semibold text-white">{component.name}</p>
                                <p className="text-sm text-yellow-400">${component.price.toLocaleString()}</p>
                              </div>
                            ) : (
                              <span className="text-gray-500">Not selected</span>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Separator className="bg-yellow-400/20" />

                  {/* Total and Actions */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-2xl font-bold">
                      <span className="text-white">Total Cost:</span>
                      <span className="text-yellow-400">${totalPrice.toLocaleString()}</span>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                      <Button 
                        onClick={handleAddToCart}
                        disabled={!isComplete}
                        className={`flex-1 font-medium transition-all duration-200 ${
                          isComplete 
                            ? 'bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-black shadow-lg shadow-yellow-400/20 hover:shadow-yellow-400/30 hover:scale-[1.02]' 
                            : 'bg-gray-600/60 text-gray-400 cursor-not-allowed border border-gray-500/30'
                        }`}
                      >
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        {isComplete ? 'Add to Cart' : `Complete Build (${completionPercentage}%)`}
                      </Button>
                      
                      <Button 
                        variant="outline" 
                        onClick={handleCopyBuild}
                        className="border-yellow-400/50 text-yellow-400 hover:border-yellow-400/80 hover:bg-yellow-400/20 bg-black/40 transition-all duration-200 font-medium"
                      >
                        <Copy className="h-4 w-4 mr-2" />
                        Copy Build
                      </Button>
                      
                      <Button 
                        variant="outline"
                        className="border-yellow-400/50 text-yellow-400 hover:border-yellow-400/80 hover:bg-yellow-400/20 bg-black/40 transition-all duration-200 font-medium"
                      >
                        <Share2 className="h-4 w-4 mr-2" />
                        Share
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Preview Tab */}
          {activeTab === 'preview' && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-4xl mx-auto"
            >
              <Card className="backdrop-blur-sm bg-gradient-to-b from-black/90 via-black/80 to-black/90 border border-yellow-400/30 shadow-xl shadow-yellow-400/10">
                {/* Pulsing corner accent */}
                <div className="absolute top-0 left-0 w-24 h-24">
                  <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-yellow-400/30 to-transparent rounded-tl-xl"></div>
                  <div className="absolute top-3 left-3 w-3 h-3 rounded-full bg-yellow-400/80 animate-pulse-slow"></div>
                </div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-yellow-400">
                    <div className="p-1.5 rounded-full bg-yellow-400/10 mr-2.5">
                      <Eye className="h-6 w-6 text-yellow-400" />
                    </div>
                    3D Build Preview
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-20">
                    <div className="mb-6">
                      <Package className="h-24 w-24 text-yellow-400/60 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-white mb-2">3D Preview Coming Soon</h3>
                      <p className="text-gray-400 max-w-md mx-auto">
                        Interactive 3D visualization of your custom PC build will be available in the next update.
                      </p>
                    </div>
                    
                    {Object.keys(selectedComponents).length > 0 && (
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                        {Object.entries(selectedComponents).map(([key, component]) => (
                          <div key={key} className="p-4 bg-gradient-to-r from-black/80 to-black/60 rounded-lg border border-yellow-400/20">
                            <Package className="h-8 w-8 text-yellow-400 mx-auto mb-2" />
                            <p className="text-xs text-gray-400">{component.name}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>

      <Footer />
    </>
  );
}
