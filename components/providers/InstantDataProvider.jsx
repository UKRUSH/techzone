"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Instant data cache - no loading time
const INSTANT_DATA = {
  products: [
    { id: 1,  name: "RTX 4090 Gaming GPU",       price: 289900, compareAtPrice: 319900, category: "gpu",          brand: "NVIDIA",         inStock: true,  stock: 8,  rating: 5, image: "https://placehold.co/400x400/0f172a/22d3ee?text=RTX+4090" },
    { id: 2,  name: "Intel Core i9-13900K",       price: 109900, compareAtPrice: 129900, category: "cpu",          brand: "Intel",          inStock: true,  stock: 12, rating: 5, image: "https://placehold.co/400x400/1e3a5f/60a5fa?text=i9-13900K" },
    { id: 3,  name: "Samsung 980 PRO 2TB NVMe",   price: 42900,  compareAtPrice: 54900,  category: "storage",      brand: "Samsung",        inStock: true,  stock: 25, rating: 4, image: "https://placehold.co/400x400/14532d/4ade80?text=980+PRO" },
    { id: 4,  name: "Corsair Vengeance DDR5 32GB", price: 59900,  compareAtPrice: null,   category: "memory",       brand: "Corsair",        inStock: true,  stock: 30, rating: 5, image: "https://placehold.co/400x400/3b0764/c084fc?text=DDR5+32GB" },
    { id: 5,  name: "ASUS ROG Strix X670-E",      price: 89900,  compareAtPrice: 99900,  category: "motherboard",  brand: "ASUS",           inStock: true,  stock: 7,  rating: 4, image: "https://placehold.co/400x400/431407/fb923c?text=ROG+X670-E" },
    { id: 6,  name: "Corsair RM850x 80+ Gold",    price: 24900,  compareAtPrice: 29900,  category: "power-supply", brand: "Corsair",        inStock: true,  stock: 15, rating: 5, image: "https://placehold.co/400x400/1c1917/f59e0b?text=RM850x" },
    { id: 7,  name: "NZXT Kraken 360 AIO",        price: 34900,  compareAtPrice: 39900,  category: "cooling",      brand: "NZXT",           inStock: true,  stock: 10, rating: 4, image: "https://placehold.co/400x400/0c4a6e/38bdf8?text=Kraken+360" },
    { id: 8,  name: "Lian Li O11 Dynamic EVO",    price: 22900,  compareAtPrice: null,   category: "case",         brand: "Lian Li",        inStock: true,  stock: 6,  rating: 5, image: "https://placehold.co/400x400/1e293b/94a3b8?text=O11+EVO" },
    { id: 9,  name: "AMD Ryzen 9 7950X",          price: 129900, compareAtPrice: 149900, category: "cpu",          brand: "AMD",            inStock: true,  stock: 9,  rating: 5, image: "https://placehold.co/400x400/450a0a/f87171?text=Ryzen+7950X" },
    { id: 10, name: "MSI GeForce RTX 4080 Super", price: 179900, compareAtPrice: 199900, category: "gpu",          brand: "MSI",            inStock: true,  stock: 5,  rating: 4, image: "https://placehold.co/400x400/0f172a/a78bfa?text=RTX+4080S" },
    { id: 11, name: "WD Black SN850X 1TB",        price: 19900,  compareAtPrice: 24900,  category: "storage",      brand: "Western Digital",inStock: true,  stock: 40, rating: 4, image: "https://placehold.co/400x400/052e16/86efac?text=SN850X" },
    { id: 12, name: "G.Skill Trident Z5 RGB 64GB",price: 79900,  compareAtPrice: null,   category: "memory",       brand: "G.Skill",        inStock: false, stock: 0,  rating: 5, image: "https://placehold.co/400x400/2e1065/e879f9?text=Z5+RGB" },
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
