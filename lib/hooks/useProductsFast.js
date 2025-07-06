import { useQuery, useQueryClient } from '@tanstack/react-query';

// Fallback data for when database is slow/offline
const FALLBACK_CATEGORIES = [
  { id: '1', name: 'Graphics Cards', _count: { products: 25 } },
  { id: '2', name: 'Processors', _count: { products: 18 } },
  { id: '3', name: 'Motherboards', _count: { products: 15 } },
  { id: '4', name: 'Memory (RAM)', _count: { products: 22 } },
  { id: '5', name: 'Storage', _count: { products: 30 } },
  { id: '6', name: 'Power Supplies', _count: { products: 12 } },
];

const FALLBACK_BRANDS = [
  { id: '1', name: 'NVIDIA', _count: { products: 15 } },
  { id: '2', name: 'AMD', _count: { products: 18 } },
  { id: '3', name: 'Intel', _count: { products: 12 } },
  { id: '4', name: 'ASUS', _count: { products: 25 } },
  { id: '5', name: 'MSI', _count: { products: 20 } },
  { id: '6', name: 'Corsair', _count: { products: 16 } },
];

const FALLBACK_PRODUCTS = [
  {
    id: '1',
    name: 'RTX 4090 Gaming Graphics Card',
    description: 'Ultimate gaming performance with ray tracing technology',
    createdAt: new Date().toISOString(),
    category: { id: '1', name: 'Graphics Cards' },
    brand: { id: '1', name: 'NVIDIA' },
    variants: [{
      id: '1',
      sku: 'RTX4090-001',
      price: 1599.99,
      compareAtPrice: 1799.99,
      attributes: { memory: '24GB', cores: '16384' }
    }]
  },
  {
    id: '2',
    name: 'Ryzen 9 7950X Processor',
    description: 'High-performance 16-core processor for enthusiasts',
    createdAt: new Date().toISOString(),
    category: { id: '2', name: 'Processors' },
    brand: { id: '2', name: 'AMD' },
    variants: [{
      id: '2',
      sku: 'R9-7950X-001',
      price: 699.99,
      compareAtPrice: 799.99,
      attributes: { cores: '16', threads: '32', baseClock: '4.5GHz' }
    }]
  },
  {
    id: '3',
    name: 'ROG Strix Z790-E Gaming WiFi',
    description: 'Premium gaming motherboard with advanced features',
    createdAt: new Date().toISOString(),
    category: { id: '3', name: 'Motherboards' },
    brand: { id: '4', name: 'ASUS' },
    variants: [{
      id: '3',
      sku: 'ROG-Z790E-001',
      price: 449.99,
      compareAtPrice: 499.99,
      attributes: { socket: 'LGA1700', formFactor: 'ATX' }
    }]
  },
  {
    id: '4',
    name: 'Corsair Vengeance DDR5-5600 32GB',
    description: 'High-speed DDR5 memory for extreme performance',
    createdAt: new Date().toISOString(),
    category: { id: '4', name: 'Memory (RAM)' },
    brand: { id: '6', name: 'Corsair' },
    variants: [{
      id: '4',
      sku: 'VENG-DDR5-32GB',
      price: 299.99,
      compareAtPrice: 349.99,
      attributes: { capacity: '32GB', speed: '5600MHz', latency: 'CL36' }
    }]
  },
  {
    id: '5',
    name: 'Samsung 980 PRO NVMe SSD 2TB',
    description: 'Lightning-fast NVMe SSD for gaming and productivity',
    createdAt: new Date().toISOString(),
    category: { id: '5', name: 'Storage' },
    brand: { id: '7', name: 'Samsung' },
    variants: [{
      id: '5',
      sku: 'SAM-980PRO-2TB',
      price: 199.99,
      compareAtPrice: 249.99,
      attributes: { capacity: '2TB', interface: 'PCIe 4.0', speed: '7000MB/s' }
    }]
  },
  {
    id: '6',
    name: 'Corsair RM850x Modular PSU',
    description: '850W 80+ Gold certified modular power supply',
    createdAt: new Date().toISOString(),
    category: { id: '6', name: 'Power Supplies' },
    brand: { id: '6', name: 'Corsair' },
    variants: [{
      id: '6',
      sku: 'CORS-RM850X',
      price: 149.99,
      compareAtPrice: 179.99,
      attributes: { wattage: '850W', efficiency: '80+ Gold', modular: 'Full' }
    }]
  },
];

// Fast fetch with timeout and fallback
async function fetchWithFallback(url, fallbackData, timeout = 3000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { 
      signal: controller.signal,
      headers: {
        'Cache-Control': 'max-age=300', // 5 minutes cache
      }
    });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.warn(`HTTP ${response.status} for ${url}, using fallback`);
      return fallbackData;
    }
    
    const data = await response.json();
    return data.success ? data.data : data;
  } catch (error) {
    clearTimeout(timeoutId);
    console.warn(`Fetch failed for ${url}:`, error.message, '- using fallback');
    return fallbackData;
  }
}

export function useProductsFast(filters = {}) {
  return useQuery({
    queryKey: ['products-fast', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      const url = `/api/products?${params.toString()}`;
      const result = await fetchWithFallback(url, FALLBACK_PRODUCTS, 5000);
      
      return {
        products: Array.isArray(result) ? result : result.data || FALLBACK_PRODUCTS,
        pagination: result.pagination || {
          total: FALLBACK_PRODUCTS.length,
          page: filters.page || 1,
          limit: filters.limit || 20,
          totalPages: 1,
          hasMore: false
        }
      };
    },
    staleTime: 30 * 1000, // 30 seconds - shorter for more responsiveness
    cacheTime: 5 * 60 * 1000, // 5 minutes cache
    retry: false, // Don't retry, use fallback instead
    refetchOnWindowFocus: false,
    onError: (error) => {
      console.warn('Products query failed:', error.message);
    },
    // Always return fallback data on error
    onSettled: (data, error) => {
      if (error && !data) {
        return {
          products: FALLBACK_PRODUCTS,
          pagination: {
            total: FALLBACK_PRODUCTS.length,
            page: 1,
            limit: 20,
            totalPages: 1,
            hasMore: false
          }
        };
      }
    }
  });
}

export function useCategoriesFast() {
  return useQuery({
    queryKey: ['categories-fast'],
    queryFn: () => fetchWithFallback('/api/categories', FALLBACK_CATEGORIES, 3000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
    retry: false,
    refetchOnWindowFocus: false,
    initialData: FALLBACK_CATEGORIES, // Start with fallback data immediately
    onError: (error) => {
      console.warn('Categories query failed, using fallback:', error.message);
    }
  });
}

export function useBrandsFast() {
  return useQuery({
    queryKey: ['brands-fast'],
    queryFn: () => fetchWithFallback('/api/brands', FALLBACK_BRANDS, 3000),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 30 * 60 * 1000, // 30 minutes cache
    retry: false,
    refetchOnWindowFocus: false,
    initialData: FALLBACK_BRANDS, // Start with fallback data immediately
    onError: (error) => {
      console.warn('Brands query failed, using fallback:', error.message);
    }
  });
}
