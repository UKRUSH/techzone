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
  Loader2
} from "lucide-react";

const componentCategories = [
  { 
    id: 'cpu', 
    name: 'Processor (CPU)', 
    icon: Cpu, 
    required: true,
    description: 'The brain of your computer - handles all calculations and processing',
    priceRange: '$100 - $800',
    color: 'from-blue-500 to-blue-600'
  },
  { 
    id: 'motherboard', 
    name: 'Motherboard', 
    icon: Microchip, 
    required: true,
    description: 'The foundation that connects all your components together',
    priceRange: '$80 - $500',
    color: 'from-green-500 to-green-600'
  },
  { 
    id: 'ram', 
    name: 'Memory (RAM)', 
    icon: MemoryStick, 
    required: true,
    description: 'System memory for smooth multitasking and performance',
    priceRange: '$50 - $400',
    color: 'from-purple-500 to-purple-600'
  },
  { 
    id: 'gpu', 
    name: 'Graphics Card (GPU)', 
    icon: Monitor, 
    required: false,
    description: 'Essential for gaming, video editing, and graphics work',
    priceRange: '$200 - $2000',
    color: 'from-red-500 to-red-600'
  },
  { 
    id: 'storage', 
    name: 'Storage (SSD/HDD)', 
    icon: HardDrive, 
    required: true,
    description: 'Store your operating system, applications, and files',
    priceRange: '$50 - $600',
    color: 'from-orange-500 to-orange-600'
  },
  { 
    id: 'psu', 
    name: 'Power Supply (PSU)', 
    icon: Power, 
    required: true,
    description: 'Provides clean, stable power to all your components',
    priceRange: '$60 - $300',
    color: 'from-yellow-500 to-yellow-600'
  },
  { 
    id: 'cooling', 
    name: 'CPU Cooler', 
    icon: Fan, 
    required: true,
    description: 'Keeps your processor running at optimal temperatures',
    priceRange: '$30 - $200',
    color: 'from-cyan-500 to-cyan-600'
  },
  { 
    id: 'case', 
    name: 'PC Case', 
    icon: Package, 
    required: true,
    description: 'Houses and protects all your valuable components',
    priceRange: '$40 - $300',
    color: 'from-gray-500 to-gray-600'
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
  
  const { addToCart } = useCart();

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
  }, [selectedComponents]);

  // Handle component selection
  const handleComponentSelect = (categoryId, tier = 'mid') => {
    const category = componentCategories.find(c => c.id === categoryId);
    
    // Sample components based on tier
    const componentOptions = {
      premium: { 
        name: `Premium ${category.name}`, 
        price: Math.floor(Math.random() * 400) + 300,
        tier: 'Premium'
      },
      mid: { 
        name: `Mid-Range ${category.name}`, 
        price: Math.floor(Math.random() * 200) + 150,
        tier: 'Mid-Range'
      },
      budget: { 
        name: `Budget ${category.name}`, 
        price: Math.floor(Math.random() * 100) + 50,
        tier: 'Budget'
      }
    };
    
    setIsAnimating(true);
    setTimeout(() => {
      setSelectedComponents(prev => ({
        ...prev,
        [categoryId]: componentOptions[tier]
      }));
      setIsAnimating(false);
    }, 300);
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
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-yellow-400 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-white mb-2">Loading PC Builder Studio</h2>
              <p className="text-gray-400">Preparing your custom PC configuration tool...</p>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      <Header />
      
      {/* Success Notification */}
      {showSuccess && (
        <motion.div 
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-20 right-4 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg"
        >
          <div className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            PC Build added to cart successfully!
          </div>
        </motion.div>
      )}

      <div className="container mx-auto px-4 py-8">
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
            <Card className="bg-gray-800/50 border-gray-700">
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

            <Card className="bg-gray-800/50 border-gray-700">
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

            <Card className="bg-gray-800/50 border-gray-700">
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
              className="bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 text-center text-lg"
            />
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-gray-800/50 rounded-lg p-1">
            {[
              { id: 'components', label: 'Components', icon: Settings },
              { id: 'summary', label: 'Summary', icon: Calculator },
              { id: 'preview', label: 'Preview', icon: Eye }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 ${
                    activeTab === tab.id 
                      ? 'bg-yellow-500 text-black hover:bg-yellow-600' 
                      : 'text-gray-300 hover:text-white hover:bg-gray-700'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Components Tab */}
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
                    <Card className={`h-full transition-all duration-300 hover:scale-105 ${
                      selectedComponent 
                        ? 'bg-gray-800/70 border-yellow-500/50 shadow-lg shadow-yellow-500/20' 
                        : 'bg-gray-800/50 border-gray-700 hover:border-gray-600'
                    }`}>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            selectedComponent 
                              ? `bg-gradient-to-r ${category.color}` 
                              : 'bg-gray-700'
                          }`}>
                            <IconComponent className={`h-6 w-6 ${
                              selectedComponent ? 'text-white' : 'text-gray-300'
                            }`} />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              <span className="text-white text-lg">{category.name}</span>
                              {category.required && (
                                <Badge variant="destructive" className="text-xs">Required</Badge>
                              )}
                            </div>
                            <p className="text-sm text-gray-400 font-normal">
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
                            <div className="p-4 bg-gray-700/50 rounded-lg border border-yellow-500/30">
                              <div className="flex justify-between items-start mb-3">
                                <div>
                                  <h4 className="font-semibold text-yellow-300">{selectedComponent.name}</h4>
                                  <p className="text-gray-400">${selectedComponent.price.toLocaleString()}</p>
                                  <Badge variant="outline" className="mt-1 text-xs">
                                    {selectedComponent.tier}
                                  </Badge>
                                </div>
                                <Button 
                                  variant="ghost" 
                                  size="sm"
                                  onClick={() => removeComponent(category.id)}
                                  className="text-gray-400 hover:text-red-400"
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
                                  className="text-xs capitalize border-gray-600 hover:border-yellow-500"
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
                                className={`w-full justify-start gap-2 bg-gradient-to-r ${category.color} hover:opacity-90`}
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
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Calculator className="h-6 w-6" />
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
                      <div key={category.id} className="flex items-center justify-between p-4 bg-gray-700/30 rounded-lg">
                        <div className="flex items-center gap-3">
                          <IconComponent className="h-5 w-5 text-gray-400" />
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

                <Separator className="bg-gray-700" />

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
                      className={`flex-1 ${
                        isComplete 
                          ? 'bg-yellow-500 hover:bg-yellow-600 text-black' 
                          : 'bg-gray-600 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      <ShoppingCart className="h-4 w-4 mr-2" />
                      {isComplete ? 'Add to Cart' : `Complete Build (${completionPercentage}%)`}
                    </Button>
                    
                    <Button 
                      variant="outline" 
                      onClick={handleCopyBuild}
                      className="border-gray-600 text-gray-300 hover:border-gray-500"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy Build
                    </Button>
                    
                    <Button 
                      variant="outline"
                      className="border-gray-600 text-gray-300 hover:border-gray-500"
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
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-400">
                  <Eye className="h-6 w-6" />
                  3D Build Preview
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-20">
                  <div className="mb-6">
                    <Package className="h-24 w-24 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-2xl font-bold text-white mb-2">3D Preview Coming Soon</h3>
                    <p className="text-gray-400 max-w-md mx-auto">
                      Interactive 3D visualization of your custom PC build will be available in the next update.
                    </p>
                  </div>
                  
                  {Object.keys(selectedComponents).length > 0 && (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
                      {Object.entries(selectedComponents).map(([key, component]) => (
                        <div key={key} className="p-4 bg-gray-700/30 rounded-lg">
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

      <Footer />
    </div>
  );
}
