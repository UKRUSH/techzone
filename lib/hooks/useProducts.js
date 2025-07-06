import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useCallback } from 'react';

// Custom hook for fetching products with optimized caching and performance
export function useProducts(filters = {}) {
  const queryClient = useQueryClient();
  
  const {
    page = 1,
    limit = 20,
    category = '',
    brand = '',
    search = '',
    minPrice,
    maxPrice
  } = filters;

  // Create a stable query key
  const queryKey = useMemo(() => [
    'products',
    { page, limit, category, brand, search, minPrice, maxPrice }
  ], [page, limit, category, brand, search, minPrice, maxPrice]);

  // Fetch function
  const fetchProducts = useCallback(async () => {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      includeMetadata: page === 1 ? 'true' : 'false', // Only fetch metadata on first page
      ...(category && { category }),
      ...(brand && { brand }),
      ...(search && { search }),
      ...(minPrice && { minPrice: minPrice.toString() }),
      ...(maxPrice && { maxPrice: maxPrice.toString() })
    });

    const response = await fetch(`/api/products?${params}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'Failed to fetch products');
    }
    
    return data;
  }, [page, limit, category, brand, search, minPrice, maxPrice]);

  // Use React Query with optimized settings
  const query = useQuery({
    queryKey,
    queryFn: fetchProducts,
    staleTime: search ? 30 * 1000 : 5 * 60 * 1000, // 30s for search, 5min for browse
    cacheTime: 10 * 60 * 1000, // 10 minutes
    retry: 1,
    keepPreviousData: true, // Keep previous data while fetching new
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    onSuccess: (data) => {
      // Prefetch next page if available
      if (data.pagination?.hasMore && page < 3) { // Only prefetch first few pages
        const nextPageKey = [
          'products',
          { ...filters, page: page + 1 }
        ];
        
        queryClient.prefetchQuery({
          queryKey: nextPageKey,
          queryFn: () => fetchProducts({ ...filters, page: page + 1 }),
          staleTime: 5 * 60 * 1000
        });
      }
    }
  });

  // Prefetch filters data if not already loaded
  const prefetchFilters = useCallback(() => {
    queryClient.prefetchQuery({
      queryKey: ['categories'],
      queryFn: async () => {
        const response = await fetch('/api/categories');
        return response.json();
      },
      staleTime: 10 * 60 * 1000 // 10 minutes
    });

    queryClient.prefetchQuery({
      queryKey: ['brands'],
      queryFn: async () => {
        const response = await fetch('/api/brands');
        return response.json();
      },
      staleTime: 10 * 60 * 1000 // 10 minutes
    });
  }, [queryClient]);

  return {
    ...query,
    products: query.data?.data || [],
    pagination: query.data?.pagination,
    metadata: query.data?.metadata,
    prefetchFilters
  };
}

// Hook for categories with caching
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      return data.success ? data.data : data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: 1
  });
}

// Hook for brands with caching
export function useBrands() {
  return useQuery({
    queryKey: ['brands'],
    queryFn: async () => {
      const response = await fetch('/api/brands');
      if (!response.ok) throw new Error('Failed to fetch brands');
      const data = await response.json();
      return data.success ? data.data : data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    cacheTime: 15 * 60 * 1000, // 15 minutes
    retry: 1
  });
}
