"use client";

import { useInstantData } from "@/components/providers/InstantDataProvider";
import { useMemo } from "react";

// Super-fast hooks with zero loading time
export function useInstantProducts(filters = {}) {
  const { getProducts, isOnline } = useInstantData();
  
  const products = useMemo(() => {
    return getProducts(filters);
  }, [getProducts, filters.category, filters.brand, filters.search, filters.limit]);

  return {
    data: products,
    isLoading: false, // Always instant
    error: null,
    isSuccess: true,
    isOnline
  };
}

export function useInstantCategories() {
  const { getCategories, isOnline } = useInstantData();
  
  const categories = useMemo(() => {
    return getCategories();
  }, [getCategories]);

  return {
    data: categories,
    isLoading: false,
    error: null,
    isSuccess: true,
    isOnline
  };
}

export function useInstantBrands() {
  const { getBrands, isOnline } = useInstantData();
  
  const brands = useMemo(() => {
    return getBrands();
  }, [getBrands]);

  return {
    data: brands,
    isLoading: false,
    error: null,
    isSuccess: true,
    isOnline
  };
}

export function useInstantDeals() {
  const { getDeals, isOnline } = useInstantData();
  
  const deals = useMemo(() => {
    return getDeals();
  }, [getDeals]);

  return {
    data: deals,
    isLoading: false,
    error: null,
    isSuccess: true,
    isOnline
  };
}

export function useInstantFeaturedProducts() {
  const { getFeaturedProducts, isOnline } = useInstantData();
  
  const featured = useMemo(() => {
    return getFeaturedProducts();
  }, [getFeaturedProducts]);

  return {
    data: featured,
    isLoading: false,
    error: null,
    isSuccess: true,
    isOnline
  };
}

// Search hook with instant results
export function useInstantSearch(query) {
  const { getProducts, isOnline } = useInstantData();
  
  const results = useMemo(() => {
    if (!query || query.length < 2) return [];
    return getProducts({ search: query, limit: 10 });
  }, [getProducts, query]);

  return {
    data: results,
    isLoading: false,
    error: null,
    isSuccess: true,
    hasResults: results.length > 0,
    isOnline
  };
}
