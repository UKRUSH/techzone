"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Cpu,
  Monitor,
  HardDrive,
  MemoryStick,
  Microchip,
  Power,
  Fan,
  Check,
  Plus,
  X,
  AlertTriangle,
  DollarSign,
  Zap,
  ChevronsDown,
  Sparkles,
  Terminal,
  CircuitBoard,
  RotateCcw,
  Settings,
  ShoppingCart,
  Save,
  Share2,
  Download
} from "lucide-react";

import { useCart } from "@/components/providers/CartProvider";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { toast } from "@/components/ui/toast";
import Link from "next/link";

// Mock data for demonstration
const mockComponents = {
  cpu: [
    {
      id: 1,
      name: "Intel Core i9-13900K",
      brand: "Intel",
      price: 599.99,
      image: "/api/placeholder/400/300",
      specs: { cores: 24, threads: 32, baseClock: "3.0 GHz", boostClock: "5.8 GHz" },
      compatibility: ["LGA1700"],
      powerDraw: 125,
      performanceScore: 95
    },
    {
      id: 2,
      name: "AMD Ryzen 9 7950X",
      brand: "AMD",
      price: 699.99,
      image: "/api/placeholder/400/300",
      specs: { cores: 16, threads: 32, baseClock: "4.5 GHz", boostClock: "5.7 GHz" },
      compatibility: ["AM5"],
      powerDraw: 170,
      performanceScore: 98
    },
    {
      id: 3,
      name: "Intel Core i7-13700K",
      brand: "Intel",
      price: 409.99,
      image: "/api/placeholder/400/300",
      specs: { cores: 16, threads: 24, baseClock: "3.4 GHz", boostClock: "5.4 GHz" },
      compatibility: ["LGA1700"],
      powerDraw: 125,
      performanceScore: 88
    }
  ],
  gpu: [
    {
      id: 4,
      name: "NVIDIA RTX 4090",
      brand: "NVIDIA",
      price: 1599.99,
      image: "/api/placeholder/400/300",
      specs: { memory: "24GB GDDR6X", coreClock: "2520 MHz", memoryClock: "21000 MHz" },
      compatibility: ["PCIe 4.0"],
      powerDraw: 450,
      performanceScore: 100
    },
    {
      id: 5,
      name: "AMD RX 7900 XTX",
      brand: "AMD",
      price: 999.99,
      image: "/api/placeholder/400/300",
      specs: { memory: "24GB GDDR6", coreClock: "2500 MHz", memoryClock: "20000 MHz" },
      compatibility: ["PCIe 4.0"],
      powerDraw: 355,
      performanceScore: 92
    },
    {
      id: 6,
      name: "NVIDIA RTX 4080",
      brand: "NVIDIA",
      price: 1199.99,
      image: "/api/placeholder/400/300",
      specs: { memory: "16GB GDDR6X", coreClock: "2505 MHz", memoryClock: "22400 MHz" },
      compatibility: ["PCIe 4.0"],
      powerDraw: 320,
      performanceScore: 85
    }
  ],
  motherboard: [
    {
      id: 7,
      name: "ASUS ROG Maximus Z790 Hero",
      brand: "ASUS",
      price: 629.99,
      image: "/api/placeholder/400/300",
      specs: { socket: "LGA1700", chipset: "Z790", memorySlots: 4, maxMemory: "128GB" },
      compatibility: ["LGA1700"],
      powerDraw: 50,
      performanceScore: 95
    },
    {
      id: 8,
      name: "MSI MAG X670E Tomahawk",
      brand: "MSI",
      price: 299.99,
      image: "/api/placeholder/400/300",
      specs: { socket: "AM5", chipset: "X670E", memorySlots: 4, maxMemory: "128GB" },
      compatibility: ["AM5"],
      powerDraw: 45,
      performanceScore: 88
    }
  ],
  memory: [
    {
      id: 9,
      name: "G.Skill Trident Z5 32GB DDR5-6000",
      brand: "G.Skill",
      price: 299.99,
      image: "/api/placeholder/400/300",
      specs: { capacity: "32GB", speed: "DDR5-6000", timings: "CL36", modules: 2 },
      compatibility: ["DDR5"],
      powerDraw: 20,
      performanceScore: 92
    },
    {
      id: 10,
      name: "Corsair Vengeance LPX 32GB DDR4-3600",
      brand: "Corsair",
      price: 149.99,
      image: "/api/placeholder/400/300",
      specs: { capacity: "32GB", speed: "DDR4-3600", timings: "CL18", modules: 2 },
      compatibility: ["DDR4"],
      powerDraw: 15,
      performanceScore: 78
    }
  ],
  storage: [
    {
      id: 11,
      name: "Samsung 980 PRO 2TB NVMe SSD",
      brand: "Samsung",
      price: 199.99,
      image: "/api/placeholder/400/300",
      specs: { capacity: "2TB", interface: "NVMe PCIe 4.0", readSpeed: "7000 MB/s", writeSpeed: "5100 MB/s" },
      compatibility: ["M.2 2280"],
      powerDraw: 8,
      performanceScore: 95
    },
    {
      id: 12,
      name: "WD Black SN850X 1TB NVMe SSD",
      brand: "Western Digital",
      price: 109.99,
      image: "/api/placeholder/400/300",
      specs: { capacity: "1TB", interface: "NVMe PCIe 4.0", readSpeed: "7300 MB/s", writeSpeed: "6600 MB/s" },
      compatibility: ["M.2 2280"],
      powerDraw: 7,
      performanceScore: 92
    }
  ],
  psu: [
    {
      id: 13,
      name: "Corsair RM1000x 1000W 80+ Gold",
      brand: "Corsair",
      price: 199.99,
      image: "/api/placeholder/400/300",
      specs: { wattage: "1000W", efficiency: "80+ Gold", modular: "Fully Modular", cables: "Sleeved" },
      compatibility: ["ATX"],
      powerDraw: 0,
      performanceScore: 90
    },
    {
      id: 14,
      name: "EVGA SuperNOVA 850W 80+ Gold",
      brand: "EVGA",
      price: 149.99,
      image: "/api/placeholder/400/300",
      specs: { wattage: "850W", efficiency: "80+ Gold", modular: "Fully Modular", cables: "Standard" },
      compatibility: ["ATX"],
      powerDraw: 0,
      performanceScore: 85
    }
  ],
  case: [
    {
      id: 15,
      name: "Lian Li O11 Dynamic EVO",
      brand: "Lian Li",
      price: 169.99,
      image: "/api/placeholder/400/300",
      specs: { formFactor: "Mid Tower", material: "Tempered Glass", fans: "3x 120mm", clearance: "GPU: 420mm" },
      compatibility: ["ATX", "mATX", "Mini-ITX"],
      powerDraw: 0,
      performanceScore: 88
    },
    {
      id: 16,
      name: "Fractal Design Define 7",
      brand: "Fractal Design",
      price: 169.99,
      image: "/api/placeholder/400/300",
      specs: { formFactor: "Full Tower", material: "Steel & Tempered Glass", fans: "3x 140mm", clearance: "GPU: 440mm" },
      compatibility: ["ATX", "mATX", "Mini-ITX"],
      powerDraw: 0,
      performanceScore: 85
    }
  ],
  cooling: [
    {
      id: 17,
      name: "NZXT Kraken X73 360mm AIO",
      brand: "NZXT",
      price: 199.99,
      image: "/api/placeholder/400/300",
      specs: { type: "AIO Liquid", radiator: "360mm", fans: "3x 120mm", rpm: "500-2000 RPM" },
      compatibility: ["LGA1700", "AM5"],
      powerDraw: 15,
      performanceScore: 92
    },
    {
      id: 18,
      name: "Noctua NH-D15",
      brand: "Noctua",
      price: 99.99,
      image: "/api/placeholder/400/300",
      specs: { type: "Air Cooler", height: "165mm", fans: "2x 140mm", rpm: "300-1500 RPM" },
      compatibility: ["LGA1700", "AM5"],
      powerDraw: 5,
      performanceScore: 88
    }
  ]
};

const componentCategories = [
  { id: 'cpu', name: 'CPU', icon: Cpu, required: true, description: 'The brain of your computer' },
  { id: 'gpu', name: 'Graphics Card', icon: Monitor, required: true, description: 'Powers your visual experience' },
  { id: 'motherboard', name: 'Motherboard', icon: CircuitBoard, required: true, description: 'Connects all components' },
  { id: 'memory', name: 'Memory (RAM)', icon: MemoryStick, required: true, description: 'System memory for multitasking' },
  { id: 'storage', name: 'Storage', icon: HardDrive, required: true, description: 'Store your files and programs' },
  { id: 'psu', name: 'Power Supply', icon: Power, required: true, description: 'Powers your entire system' },
  { id: 'case', name: 'Case', icon: Terminal, required: true, description: 'Houses and protects components' },
  { id: 'cooling', name: 'Cooling', icon: Fan, required: false, description: 'Keeps your system cool' }
];

const PCBuilder = () => {
  const [selectedComponents, setSelectedComponents] = useState({});
  const [currentCategory, setCurrentCategory] = useState('cpu');
  const [isComponentSelectorOpen, setIsComponentSelectorOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [compatibilityWarnings, setCompatibilityWarnings] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [estimatedPowerDraw, setEstimatedPowerDraw] = useState(0);
  const [buildProgress, setBuildProgress] = useState(0);
  const [overallScore, setOverallScore] = useState(0);
  const [showPerformanceDetails, setShowPerformanceDetails] = useState(false);
  
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const router = useRouter();
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({ container: containerRef });
  const backgroundY = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  // Calculate totals and progress
  useEffect(() => {
    const components = Object.values(selectedComponents);
    const price = components.reduce((sum, comp) => sum + (comp?.price || 0), 0);
    const power = components.reduce((sum, comp) => sum + (comp?.powerDraw || 0), 0);
    const progress = (Object.keys(selectedComponents).length / componentCategories.filter(cat => cat.required).length) * 100;
    const score = components.length > 0 ? components.reduce((sum, comp) => sum + (comp?.performanceScore || 0), 0) / components.length : 0;
    
    setTotalPrice(price);
    setEstimatedPowerDraw(power);
    setBuildProgress(Math.min(progress, 100));
    setOverallScore(Math.round(score));
  }, [selectedComponents]);

  // Check compatibility
  useEffect(() => {
    const warnings = [];
    const { cpu, motherboard, memory, psu } = selectedComponents;
    
    // CPU-Motherboard compatibility
    if (cpu && motherboard) {
      const cpuSocket = cpu.compatibility[0];
      const mbSocket = motherboard.specs.socket;
      if (cpuSocket !== mbSocket) {
        warnings.push({
          type: 'incompatible',
          message: `CPU socket (${cpuSocket}) doesn't match motherboard socket (${mbSocket})`
        });
      }
    }
    
    // Power supply check
    if (psu && estimatedPowerDraw > 0) {
      const psuWattage = parseInt(psu.specs.wattage);
      const recommendedWattage = estimatedPowerDraw * 1.2; // 20% headroom
      if (psuWattage < recommendedWattage) {
        warnings.push({
          type: 'warning',
          message: `Power supply might be insufficient. Recommended: ${Math.ceil(recommendedWattage)}W`
        });
      }
    }
    
    setCompatibilityWarnings(warnings);
  }, [selectedComponents, estimatedPowerDraw]);

  const selectComponent = (category, component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: component
    }));
    setIsComponentSelectorOpen(false);
    toast.success(`${component.name} selected for ${componentCategories.find(cat => cat.id === category)?.name}`);
  };

  const removeComponent = (category) => {
    const categoryName = componentCategories.find(cat => cat.id === category)?.name;
    setSelectedComponents(prev => {
      const newComponents = { ...prev };
      delete newComponents[category];
      return newComponents;
    });
    toast.success(`${categoryName} removed from build`);
  };

  const addBuildToCart = () => {
    if (!session) {
      toast.error("Please sign in to add builds to cart");
      router.push("/auth/signin");
      return;
    }

    const components = Object.values(selectedComponents);
    if (components.length === 0) {
      toast.error("No components selected");
      return;
    }

    components.forEach(component => {
      addToCart(component, 1);
    });
    toast.success(`Build added to cart! ${components.length} components`);
  };

  const clearBuild = () => {
    setSelectedComponents({});
    toast.success("Build cleared");
  };

  const saveBuild = () => {
    if (!session) {
      toast.error("Please sign in to save builds");
      router.push("/auth/signin");
      return;
    }
    // TODO: Implement save functionality
    toast.success("Build saved!");
  };

  const shareBuild = () => {
    // TODO: Implement share functionality
    navigator.clipboard.writeText(window.location.href);
    toast.success("Build link copied to clipboard!");
  };

  const filteredComponents = (mockComponents[currentCategory] || []).filter(component =>
    component.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    component.brand.toLowerCase().includes(searchQuery.toLowerCase())
  ).sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'performance':
        return (b.performanceScore || 0) - (a.performanceScore || 0);
      default:
        return a.name.localeCompare(b.name);
    }
  });

  return (
    <div className="min-h-screen bg-background relative overflow-x-hidden" ref={containerRef}>
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          style={{ y: backgroundY }}
          className="absolute inset-0 opacity-30"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-yellow-500/5" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-slow" />
          <div className="absolute bottom-1/4 right-1/4 w-128 h-128 bg-yellow-500/10 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }} />
          <div className="absolute top-3/4 left-3/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl animate-pulse-slow" style={{ animationDelay: '4s' }} />
        </motion.div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-grid-pattern opacity-5" />
        
        {/* Floating Circuit Elements */}
        <div className="absolute inset-0">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute"
              initial={{
                x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
                y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
              }}
              animate={{
                y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
                x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200)],
                rotate: [0, 360],
              }}
              transition={{
                duration: Math.random() * 20 + 20,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              <div className="w-3 h-3 bg-primary/20 rounded-full blur-sm" />
            </motion.div>
          ))}
        </div>
      </div>

      <Header />

      <main className="relative pt-20">
        {/* Hero Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="py-20 relative"
        >
          <div className="container mx-auto px-4 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="mb-6"
            >
              <h1 className="text-4xl md:text-6xl font-bold mb-6 relative">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-yellow-300 to-primary animate-gradient-x">
                  PC Builder Studio
                </span>
                <motion.div
                  className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </h1>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Build your dream gaming PC with our advanced compatibility checker, 
                performance analyzer, and smart component recommendations.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-4 justify-center mb-12"
            >
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                <Zap className="w-4 h-4 mr-2" />
                Real-time Compatibility
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-yellow-500/10 text-yellow-300 border-yellow-500/20">
                <Settings className="w-4 h-4 mr-2" />
                Performance Analysis
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-sm bg-primary/10 text-primary border-primary/20">
                <Sparkles className="w-4 h-4 mr-2" />
                Smart Recommendations
              </Badge>
            </motion.div>

            {/* Quick Stats */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto"
            >
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{buildProgress.toFixed(0)}%</div>
                <div className="text-sm text-muted-foreground">Build Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">${totalPrice.toFixed(0)}</div>
                <div className="text-sm text-muted-foreground">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">{estimatedPowerDraw}W</div>
                <div className="text-sm text-muted-foreground">Power Draw</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-300 mb-2">{overallScore}</div>
                <div className="text-sm text-muted-foreground">Performance</div>
              </div>
            </motion.div>
          </div>
        </motion.section>

        {/* Build Interface */}
        <section className="py-20 relative">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-12 gap-8">
              {/* Component Categories Sidebar */}
              <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8 }}
                className="lg:col-span-3"
              >
                <Card className="border border-primary/20 shadow-xl shadow-primary/5 backdrop-blur-sm sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <CircuitBoard className="w-5 h-5 mr-2 text-primary" />
                      Components
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-0">
                    <div className="space-y-1">
                      {componentCategories.map((category) => {
                        const Icon = category.icon;
                        const isSelected = selectedComponents[category.id];
                        const isActive = currentCategory === category.id;
                        
                        return (
                          <motion.button
                            key={category.id}
                            onClick={() => {
                              setCurrentCategory(category.id);
                              setIsComponentSelectorOpen(true);
                            }}
                            className={`w-full flex items-center justify-between p-3 text-left transition-all duration-200 rounded-lg mx-3 mb-1 ${
                              isActive
                                ? 'bg-primary/10 text-primary border border-primary/20'
                                : 'hover:bg-muted/50 text-muted-foreground hover:text-foreground'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-3" />
                              <div>
                                <div className="font-medium text-sm">{category.name}</div>
                                {category.required && (
                                  <div className="text-xs text-primary/60">Required</div>
                                )}
                              </div>
                            </div>
                            {isSelected ? (
                              <Check className="w-4 h-4 text-primary" />
                            ) : (
                              <Plus className="w-4 h-4" />
                            )}
                          </motion.button>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Build Summary */}
                <Card className="border border-primary/20 shadow-xl shadow-primary/5 backdrop-blur-sm mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg">
                      <DollarSign className="w-5 h-5 mr-2 text-yellow-300" />
                      Build Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Total Cost</span>
                        <span className="font-bold text-yellow-300">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Power Draw</span>
                        <span className="font-medium">{estimatedPowerDraw}W</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Components</span>
                        <span className="font-medium">{Object.keys(selectedComponents).length}/8</span>
                      </div>
                      
                      <Separator />
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">Progress</span>
                          <span className="text-primary font-medium">{buildProgress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-muted/30 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-primary to-yellow-300 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${buildProgress}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>

                      {compatibilityWarnings.length > 0 && (
                        <div className="mt-4">
                          <div className="flex items-center text-sm text-yellow-300 mb-2">
                            <AlertTriangle className="w-4 h-4 mr-2" />
                            Compatibility Issues
                          </div>
                          <div className="space-y-1">
                            {compatibilityWarnings.map((warning, index) => (
                              <div key={index} className="text-xs text-muted-foreground bg-yellow-500/10 p-2 rounded">
                                {warning.message}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                      
                      <div className="flex flex-col gap-2 mt-6">
                        <Button
                          onClick={addBuildToCart}
                          disabled={Object.keys(selectedComponents).length === 0}
                          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            onClick={saveBuild}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-primary/20 hover:bg-primary/5"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            onClick={shareBuild}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-primary/20 hover:bg-primary/5"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button
                            onClick={clearBuild}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-destructive/20 hover:bg-destructive/5 text-destructive"
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Clear
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Selected Components Display */}
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="lg:col-span-9"
              >
                <Card className="border border-primary/20 shadow-xl shadow-primary/5 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center">
                        <Terminal className="w-5 h-5 mr-2 text-primary" />
                        Your Build Configuration
                      </span>
                      <Button
                        onClick={() => setShowPerformanceDetails(!showPerformanceDetails)}
                        variant="outline"
                        size="sm"
                        className="border-primary/20 hover:bg-primary/5"
                      >
                        <Sparkles className="w-4 h-4 mr-2" />
                        Performance
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      {componentCategories.map((category) => {
                        const Icon = category.icon;
                        const selectedComponent = selectedComponents[category.id];
                        
                        return (
                          <motion.div
                            key={category.id}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: componentCategories.indexOf(category) * 0.1 }}
                            className={`p-4 rounded-lg border transition-all duration-200 ${
                              selectedComponent
                                ? 'border-primary/20 bg-primary/5'
                                : 'border-muted/40 bg-muted/20'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`p-2 rounded-lg mr-4 ${
                                  selectedComponent
                                    ? 'bg-primary/20 text-primary'
                                    : 'bg-muted/40 text-muted-foreground'
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="font-semibold flex items-center">
                                    {category.name}
                                    {category.required && (
                                      <Badge variant="secondary" className="ml-2 text-xs bg-primary/10 text-primary">
                                        Required
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-muted-foreground">{category.description}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {selectedComponent ? (
                                  <>
                                    <div className="text-right">
                                      <div className="font-semibold">{selectedComponent.name}</div>
                                      <div className="text-sm text-muted-foreground">{selectedComponent.brand}</div>
                                      <div className="text-sm font-bold text-yellow-300">${selectedComponent.price}</div>
                                    </div>
                                    <Button
                                      onClick={() => removeComponent(category.id)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-destructive hover:bg-destructive/10"
                                    >
                                      <X className="w-4 h-4" />
                                    </Button>
                                  </>
                                ) : (
                                  <Button
                                    onClick={() => {
                                      setCurrentCategory(category.id);
                                      setIsComponentSelectorOpen(true);
                                    }}
                                    variant="outline"
                                    size="sm"
                                    className="border-primary/20 hover:bg-primary/5"
                                  >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Select
                                  </Button>
                                )}
                              </div>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>

                {/* Performance Details */}
                <AnimatePresence>
                  {showPerformanceDetails && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, height: 0 }}
                      animate={{ opacity: 1, y: 0, height: 'auto' }}
                      exit={{ opacity: 0, y: -20, height: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-6"
                    >
                      <Card className="border border-primary/20 shadow-xl shadow-primary/5 backdrop-blur-sm">
                        <CardHeader>
                          <CardTitle className="flex items-center">
                            <Monitor className="w-5 h-5 mr-2 text-primary" />
                            Performance Analysis
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="grid md:grid-cols-3 gap-6">
                            {/* Gaming Performance */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center">
                                <Monitor className="w-4 h-4 mr-2 text-primary" />
                                Gaming Performance
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>1080p Gaming</span>
                                    <span className="text-primary font-medium">
                                      {selectedComponents.gpu ? "Excellent" : "Not rated"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-primary h-full rounded-full transition-all duration-1000"
                                      style={{ width: selectedComponents.gpu ? '95%' : '0%' }}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>1440p Gaming</span>
                                    <span className="text-primary font-medium">
                                      {selectedComponents.gpu ? "Very Good" : "Not rated"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-primary h-full rounded-full transition-all duration-1000"
                                      style={{ width: selectedComponents.gpu ? '80%' : '0%' }}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>4K Gaming</span>
                                    <span className="text-primary font-medium">
                                      {selectedComponents.gpu ? "Good" : "Not rated"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-primary h-full rounded-full transition-all duration-1000"
                                      style={{ width: selectedComponents.gpu ? '65%' : '0%' }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* Productivity Performance */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center">
                                <Cpu className="w-4 h-4 mr-2 text-yellow-300" />
                                Productivity
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>Video Editing</span>
                                    <span className="text-yellow-300 font-medium">
                                      {selectedComponents.cpu ? "Excellent" : "Not rated"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-yellow-300 h-full rounded-full transition-all duration-1000"
                                      style={{ width: selectedComponents.cpu ? '90%' : '0%' }}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>3D Rendering</span>
                                    <span className="text-yellow-300 font-medium">
                                      {selectedComponents.cpu ? "Very Good" : "Not rated"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-yellow-300 h-full rounded-full transition-all duration-1000"
                                      style={{ width: selectedComponents.cpu ? '85%' : '0%' }}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>Streaming</span>
                                    <span className="text-yellow-300 font-medium">
                                      {selectedComponents.cpu ? "Excellent" : "Not rated"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-yellow-300 h-full rounded-full transition-all duration-1000"
                                      style={{ width: selectedComponents.cpu ? '88%' : '0%' }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            {/* System Metrics */}
                            <div>
                              <h4 className="font-semibold mb-3 flex items-center">
                                <Settings className="w-4 h-4 mr-2 text-primary" />
                                System Metrics
                              </h4>
                              <div className="space-y-3">
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>Overall Score</span>
                                    <span className="text-primary font-bold">{overallScore}/100</span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-gradient-to-r from-primary to-yellow-300 h-full rounded-full transition-all duration-1000"
                                      style={{ width: `${overallScore}%` }}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>Power Efficiency</span>
                                    <span className="text-primary font-medium">
                                      {estimatedPowerDraw > 0 ? "Good" : "Not rated"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-primary h-full rounded-full transition-all duration-1000"
                                      style={{ width: estimatedPowerDraw > 0 ? '75%' : '0%' }}
                                    />
                                  </div>
                                </div>
                                
                                <div>
                                  <div className="flex justify-between mb-1 text-sm">
                                    <span>Future Proof</span>
                                    <span className="text-primary font-medium">
                                      {overallScore > 80 ? "Excellent" : overallScore > 60 ? "Good" : "Fair"}
                                    </span>
                                  </div>
                                  <div className="w-full bg-muted/30 h-1.5 rounded-full overflow-hidden">
                                    <div
                                      className="bg-primary h-full rounded-full transition-all duration-1000"
                                      style={{ width: `${Math.max(overallScore - 10, 0)}%` }}
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Component Selector Modal */}
        <AnimatePresence>
          {isComponentSelectorOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
              onClick={() => setIsComponentSelectorOpen(false)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="bg-background border border-primary/20 rounded-lg shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-primary/20">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold flex items-center">
                      {(() => {
                        const category = componentCategories.find(cat => cat.id === currentCategory);
                        const Icon = category?.icon || Cpu;
                        return (
                          <>
                            <Icon className="w-6 h-6 mr-3 text-primary" />
                            Select {category?.name}
                          </>
                        );
                      })()}
                    </h2>
                    <Button
                      onClick={() => setIsComponentSelectorOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                  
                  {/* Search and Filter */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Search components..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 bg-muted/50 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                      />
                    </div>
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-4 py-2 bg-muted/50 border border-primary/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="name">Sort by Name</option>
                      <option value="price-low">Price: Low to High</option>
                      <option value="price-high">Price: High to Low</option>
                      <option value="performance">Performance Score</option>
                    </select>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filteredComponents.map((component) => (
                      <motion.div
                        key={component.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        <Card className="border border-primary/20 shadow-lg hover:shadow-xl hover:border-primary/40 transition-all duration-300 cursor-pointer h-full">
                          <CardContent className="p-4">
                            <div className="aspect-video bg-muted/30 rounded-lg mb-3 overflow-hidden">
                              <img
                                src={component.image}
                                alt={component.name}
                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              />
                            </div>
                            
                            <div className="mb-3">
                              <h3 className="font-semibold text-sm mb-1 line-clamp-2">{component.name}</h3>
                              <p className="text-xs text-muted-foreground mb-2">{component.brand}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-lg font-bold text-yellow-300">${component.price}</span>
                                {component.performanceScore && (
                                  <Badge variant="secondary" className="text-xs bg-primary/10 text-primary">
                                    {component.performanceScore}/100
                                  </Badge>
                                )}
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground mb-3 space-y-1">
                              {Object.entries(component.specs).slice(0, 2).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                  <span>{value}</span>
                                </div>
                              ))}
                              <div className="flex justify-between">
                                <span>Power:</span>
                                <span>{component.powerDraw}W</span>
                              </div>
                            </div>
                            
                            <Button
                              onClick={() => selectComponent(currentCategory, component)}
                              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm"
                              size="sm"
                            >
                              <Check className="w-4 h-4 mr-2" />
                              Select Component
                            </Button>
                          </CardContent>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                  
                  {filteredComponents.length === 0 && (
                    <div className="text-center py-12">
                      <div className="text-muted-foreground mb-4">No components found</div>
                      <Button
                        onClick={() => setSearchQuery('')}
                        variant="outline"
                        className="border-primary/20 hover:bg-primary/5"
                      >
                        Clear Search
                      </Button>
                    </div>
                  )}
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <Footer />
    </div>
  );
};

export default PCBuilder;
