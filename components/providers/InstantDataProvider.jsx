"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Instant data cache - no loading time
const INSTANT_DATA = {
  products: [
    { id: 1, name: "RTX 4090 Gaming GPU", price: 1599, category: "gpu", brand: "NVIDIA", inStock: true, rating: 5, image: "/gpu.jpg" },
    { id: 2, name: "Intel i9-13900K", price: 589, category: "cpu", brand: "Intel", inStock: true, rating: 5, image: "/cpu.jpg" },
    { id: 3, name: "Samsung 980 PRO 2TB", price: 299, category: "storage", brand: "Samsung", inStock: true, rating: 4, image: "/ssd.jpg" },
    { id: 4, name: "Corsair DDR5-5600 32GB", price: 399, category: "memory", brand: "Corsair", inStock: true, rating: 5, image: "/ram.jpg" },
    { id: 5, name: "ASUS ROG Strix X670-E", price: 499, category: "motherboard", brand: "ASUS", inStock: true, rating: 4, image: "/mobo.jpg" },
    { id: 6, name: "Corsair RM850x PSU", price: 159, category: "power-supply", brand: "Corsair", inStock: true, rating: 5, image: "/psu.jpg" },
    { id: 7, name: "NZXT Kraken X73", price: 199, category: "cooling", brand: "NZXT", inStock: true, rating: 4, image: "/cooler.jpg" },
    { id: 8, name: "Fractal Design Define 7", price: 169, category: "case", brand: "Fractal", inStock: true, rating: 5, image: "/case.jpg" },
    { id: 9, name: "AMD Ryzen 9 7950X", price: 699, category: "cpu", brand: "AMD", inStock: true, rating: 5, image: "/amd-cpu.jpg" },
    { id: 10, name: "RTX 4080 Super", price: 999, category: "gpu", brand: "NVIDIA", inStock: true, rating: 4, image: "/rtx4080.jpg" },
    { id: 11, name: "WD Black SN850X 1TB", price: 149, category: "storage", brand: "Western Digital", inStock: true, rating: 4, image: "/wd-ssd.jpg" },
    { id: 12, name: "G.Skill Trident Z5 RGB", price: 299, category: "memory", brand: "G.Skill", inStock: true, rating: 5, image: "/gskill-ram.jpg" }
  ],
  categories: [
    { name: "Graphics Cards", slug: "gpu", count: 45, icon: "Monitor" },
    { name: "Processors", slug: "cpu", count: 38, icon: "Cpu" },
    { name: "Storage", slug: "storage", count: 67, icon: "HardDrive" },
    { name: "Memory", slug: "memory", count: 32, icon: "MemoryStick" },
    { name: "Motherboards", slug: "motherboard", count: 56, icon: "Microchip" },
    { name: "Power Supplies", slug: "power-supply", count: 28, icon: "Power" },
    { name: "Cooling", slug: "cooling", count: 41, icon: "Fan" },
    { name: "Cases", slug: "case", count: 23, icon: "Package" }
  ],
  brands: [
    { name: "NVIDIA", count: 45, popular: true },
    { name: "Intel", count: 38, popular: true },
    { name: "AMD", count: 42, popular: true },
    { name: "Samsung", count: 67, popular: true },
    { name: "Corsair", count: 89, popular: true },
    { name: "ASUS", count: 123, popular: true },
    { name: "MSI", count: 76, popular: false },
    { name: "Gigabyte", count: 54, popular: false },
    { name: "Western Digital", count: 43, popular: false },
    { name: "G.Skill", count: 32, popular: false },
    { name: "NZXT", count: 29, popular: false },
    { name: "Fractal Design", count: 18, popular: false }
  ],
  deals: [
    { id: 1, productId: 1, discount: 15, originalPrice: 1599, salePrice: 1359, endDate: "2025-07-15" },
    { id: 2, productId: 3, discount: 20, originalPrice: 299, salePrice: 239, endDate: "2025-07-12" },
    { id: 3, productId: 6, discount: 25, originalPrice: 159, salePrice: 119, endDate: "2025-07-20" }
  ]
};

const InstantDataContext = createContext();

export function InstantDataProvider({ children }) {
  const [data, setData] = useState(INSTANT_DATA);
  const [isOnline, setIsOnline] = useState(true);

  // Monitor connection status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Background data refresh (non-blocking)
  useEffect(() => {
    const refreshData = async () => {
      try {
        const response = await fetch('/api/products/fast?limit=20');
        if (response.ok) {
          const freshData = await response.json();
          if (freshData.products?.length > 0) {
            setData(prev => ({
              ...prev,
              products: freshData.products,
              categories: freshData.categories || prev.categories,
              brands: freshData.brands || prev.brands
            }));
          }
        }
      } catch (error) {
        // Silently fail and keep using instant data
        console.log('Background refresh failed, using instant data');
      }
    };

    // Refresh in background after initial render
    const timer = setTimeout(refreshData, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Instant data access functions
  const getProducts = (filters = {}) => {
    let products = data.products;
    
    if (filters.category) {
      products = products.filter(p => p.category === filters.category);
    }
    
    if (filters.brand) {
      products = products.filter(p => p.brand === filters.brand);
    }
    
    if (filters.search) {
      const search = filters.search.toLowerCase();
      products = products.filter(p => 
        p.name.toLowerCase().includes(search) ||
        p.brand.toLowerCase().includes(search) ||
        p.category.toLowerCase().includes(search)
      );
    }
    
    if (filters.limit) {
      products = products.slice(0, filters.limit);
    }
    
    return products;
  };

  const getCategories = () => data.categories;
  
  const getBrands = () => data.brands;
  
  const getDeals = () => data.deals;
  
  const getFeaturedProducts = () => data.products.filter(p => p.rating >= 4).slice(0, 6);

  return (
    <InstantDataContext.Provider value={{ 
      getProducts, 
      getCategories, 
      getBrands, 
      getDeals,
      getFeaturedProducts,
      isOnline,
      rawData: data
    }}>
      {children}
    </InstantDataContext.Provider>
  );
}

export function useInstantData() {
  const context = useContext(InstantDataContext);
  if (!context) {
    throw new Error("useInstantData must be used within InstantDataProvider");
  }
  return context;
}
