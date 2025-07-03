"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { motion, AnimatePresence } from "framer-motion";
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
  ShoppingCart,
  Save,
  Share2
} from "lucide-react";

// Component categories for PC building
const componentCategories = [
  { id: 'cpu', name: 'CPU', icon: Cpu, required: true, description: 'The brain of your computer' },
  { id: 'gpu', name: 'Graphics Card', icon: Monitor, required: true, description: 'Powers your visual experience' },
  { id: 'motherboard', name: 'Motherboard', icon: Microchip, required: true, description: 'Connects all components' },
  { id: 'memory', name: 'Memory (RAM)', icon: MemoryStick, required: true, description: 'System memory for multitasking' },
  { id: 'storage', name: 'Storage', icon: HardDrive, required: true, description: 'Store your files and programs' },
  { id: 'psu', name: 'Power Supply', icon: Power, required: true, description: 'Powers your entire system' },
  { id: 'cooling', name: 'Cooling', icon: Fan, required: false, description: 'Keeps your system cool' }
];

// Mock components data
const mockComponents = {
  cpu: [
    { id: 1, name: "Intel Core i9-13900K", brand: "Intel", price: 599.99, specs: { cores: 24, threads: 32 } },
    { id: 2, name: "AMD Ryzen 9 7950X", brand: "AMD", price: 699.99, specs: { cores: 16, threads: 32 } }
  ],
  gpu: [
    { id: 3, name: "NVIDIA RTX 4090", brand: "NVIDIA", price: 1599.99, specs: { memory: "24GB GDDR6X" } },
    { id: 4, name: "AMD RX 7900 XTX", brand: "AMD", price: 999.99, specs: { memory: "24GB GDDR6" } }
  ],
  motherboard: [
    { id: 5, name: "ASUS ROG Z790 Hero", brand: "ASUS", price: 629.99, specs: { socket: "LGA1700" } }
  ],
  memory: [
    { id: 6, name: "G.Skill Trident Z5 32GB", brand: "G.Skill", price: 299.99, specs: { capacity: "32GB" } }
  ],
  storage: [
    { id: 7, name: "Samsung 980 PRO 2TB", brand: "Samsung", price: 199.99, specs: { capacity: "2TB" } }
  ],
  psu: [
    { id: 8, name: "Corsair RM1000x", brand: "Corsair", price: 199.99, specs: { wattage: "1000W" } }
  ],
  cooling: [
    { id: 9, name: "NZXT Kraken X73", brand: "NZXT", price: 199.99, specs: { type: "360mm AIO" } }
  ]
};

const PCBuilder = () => {
  const [selectedComponents, setSelectedComponents] = useState({});
  const [currentCategory, setCurrentCategory] = useState('cpu');
  const [isComponentSelectorOpen, setIsComponentSelectorOpen] = useState(false);
  const [totalPrice, setTotalPrice] = useState(0);
  const [buildProgress, setBuildProgress] = useState(0);

  // Calculate totals and progress
  useEffect(() => {
    const components = Object.values(selectedComponents);
    const price = components.reduce((sum, comp) => sum + (comp?.price || 0), 0);
    const progress = (Object.keys(selectedComponents).length / componentCategories.filter(cat => cat.required).length) * 100;
    
    setTotalPrice(price);
    setBuildProgress(Math.min(progress, 100));
  }, [selectedComponents]);

  const selectComponent = (category, component) => {
    setSelectedComponents(prev => ({
      ...prev,
      [category]: component
    }));
    setIsComponentSelectorOpen(false);
  };

  const removeComponent = (category) => {
    setSelectedComponents(prev => {
      const newComponents = { ...prev };
      delete newComponents[category];
      return newComponents;
    });
  };

  const clearBuild = () => {
    setSelectedComponents({});
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/5 via-transparent to-yellow-500/10" />
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
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
            <h1 className="text-4xl md:text-6xl font-bold mb-6 relative">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-500">
                PC Builder Studio
              </span>
            </h1>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Build your dream gaming PC with our advanced compatibility checker, 
              performance analyzer, and smart component recommendations.
            </p>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-2xl mx-auto mt-12">
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{buildProgress.toFixed(0)}%</div>
                <div className="text-sm text-gray-400">Build Progress</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">${totalPrice.toFixed(0)}</div>
                <div className="text-sm text-gray-400">Total Cost</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-yellow-400 mb-2">{Object.keys(selectedComponents).length}</div>
                <div className="text-sm text-gray-400">Components</div>
              </div>
            </div>
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
                <Card className="border border-yellow-500/30 bg-zinc-900/50 backdrop-blur-sm sticky top-24">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg text-yellow-300">
                      <Microchip className="w-5 h-5 mr-2 text-yellow-400" />
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
                                ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/40'
                                : 'hover:bg-zinc-800/50 text-gray-300 hover:text-white'
                            }`}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <div className="flex items-center">
                              <Icon className="w-4 h-4 mr-3" />
                              <div>
                                <div className="font-medium text-sm">{category.name}</div>
                                {category.required && (
                                  <div className="text-xs text-yellow-400/60">Required</div>
                                )}
                              </div>
                            </div>
                            {isSelected ? (
                              <Check className="w-4 h-4 text-yellow-400" />
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
                <Card className="border border-yellow-500/30 bg-zinc-900/50 backdrop-blur-sm mt-6">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center text-lg text-yellow-300">
                      <ShoppingCart className="w-5 h-5 mr-2 text-yellow-400" />
                      Build Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Total Cost</span>
                        <span className="font-bold text-yellow-400">${totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-400">Components</span>
                        <span className="font-medium text-white">{Object.keys(selectedComponents).length}/7</span>
                      </div>
                      
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-gray-400">Progress</span>
                          <span className="text-yellow-400 font-medium">{buildProgress.toFixed(0)}%</span>
                        </div>
                        <div className="w-full bg-zinc-800 h-2 rounded-full overflow-hidden">
                          <motion.div
                            className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-full rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${buildProgress}%` }}
                            transition={{ duration: 0.8 }}
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 mt-6">
                        <Button
                          disabled={Object.keys(selectedComponents).length === 0}
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
                        >
                          <ShoppingCart className="w-4 h-4 mr-2" />
                          Add to Cart
                        </Button>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400"
                          >
                            <Save className="w-4 h-4 mr-1" />
                            Save
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400"
                          >
                            <Share2 className="w-4 h-4 mr-1" />
                            Share
                          </Button>
                          <Button
                            onClick={clearBuild}
                            variant="outline"
                            size="sm"
                            className="flex-1 border-red-500/30 hover:bg-red-500/10 text-red-400"
                          >
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
                <Card className="border border-yellow-500/30 bg-zinc-900/50 backdrop-blur-sm">
                  <CardHeader>
                    <CardTitle className="flex items-center text-yellow-300">
                      <Microchip className="w-5 h-5 mr-2 text-yellow-400" />
                      Your Build Configuration
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
                                ? 'border-yellow-500/30 bg-yellow-500/5'
                                : 'border-zinc-700 bg-zinc-800/30'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className={`p-2 rounded-lg mr-4 ${
                                  selectedComponent
                                    ? 'bg-yellow-500/20 text-yellow-400'
                                    : 'bg-zinc-700 text-gray-400'
                                }`}>
                                  <Icon className="w-5 h-5" />
                                </div>
                                <div>
                                  <h3 className="font-semibold flex items-center text-white">
                                    {category.name}
                                    {category.required && (
                                      <Badge variant="secondary" className="ml-2 text-xs bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
                                        Required
                                      </Badge>
                                    )}
                                  </h3>
                                  <p className="text-sm text-gray-400">{category.description}</p>
                                </div>
                              </div>
                              
                              <div className="flex items-center gap-3">
                                {selectedComponent ? (
                                  <>
                                    <div className="text-right">
                                      <div className="font-semibold text-white">{selectedComponent.name}</div>
                                      <div className="text-sm text-gray-400">{selectedComponent.brand}</div>
                                      <div className="text-sm font-bold text-yellow-400">${selectedComponent.price}</div>
                                    </div>
                                    <Button
                                      onClick={() => removeComponent(category.id)}
                                      variant="ghost"
                                      size="sm"
                                      className="text-red-400 hover:bg-red-500/10"
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
                                    className="border-yellow-500/30 hover:bg-yellow-500/10 text-yellow-400"
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
                className="bg-zinc-900 border border-yellow-500/30 rounded-lg shadow-2xl max-w-4xl w-full max-h-[80vh] overflow-hidden"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-yellow-500/30">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-2xl font-bold text-yellow-300 flex items-center">
                      {(() => {
                        const category = componentCategories.find(cat => cat.id === currentCategory);
                        const Icon = category?.icon || Cpu;
                        return (
                          <>
                            <Icon className="w-6 h-6 mr-3 text-yellow-400" />
                            Select {category?.name}
                          </>
                        );
                      })()}
                    </h2>
                    <Button
                      onClick={() => setIsComponentSelectorOpen(false)}
                      variant="ghost"
                      size="sm"
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-5 h-5" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-6 overflow-y-auto max-h-[60vh]">
                  <div className="grid md:grid-cols-2 gap-4">
                    {(mockComponents[currentCategory] || []).map((component) => (
                      <motion.div
                        key={component.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3 }}
                        className="group"
                      >
                        <Card className="border border-yellow-500/30 bg-zinc-800/50 hover:bg-zinc-800/80 hover:border-yellow-500/50 transition-all duration-300 cursor-pointer h-full">
                          <CardContent className="p-4">
                            <div className="mb-3">
                              <h3 className="font-semibold text-lg mb-1 text-white">{component.name}</h3>
                              <p className="text-sm text-gray-400 mb-2">{component.brand}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-xl font-bold text-yellow-400">${component.price}</span>
                              </div>
                            </div>
                            
                            <div className="text-sm text-gray-400 mb-4 space-y-1">
                              {Object.entries(component.specs).map(([key, value]) => (
                                <div key={key} className="flex justify-between">
                                  <span className="capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}:</span>
                                  <span className="text-white">{value}</span>
                                </div>
                              ))}
                            </div>
                            
                            <Button
                              onClick={() => selectComponent(currentCategory, component)}
                              className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold"
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
