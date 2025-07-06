import { useState, useEffect, useCallback, useRef } from 'react';

// Custom hook for debounced values (useful for search)
export function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

// Custom hook for debounced search with loading state
export function useDebouncedSearch(initialValue = '', delay = 500) {
  const [searchTerm, setSearchTerm] = useState(initialValue);
  const [isSearching, setIsSearching] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, delay);
  const previousDebouncedValue = useRef(debouncedSearchTerm);

  useEffect(() => {
    if (debouncedSearchTerm !== previousDebouncedValue.current) {
      setIsSearching(false);
      previousDebouncedValue.current = debouncedSearchTerm;
    }
  }, [debouncedSearchTerm]);

  const updateSearchTerm = useCallback((newValue) => {
    setSearchTerm(newValue);
    if (newValue !== debouncedSearchTerm) {
      setIsSearching(true);
    }
  }, [debouncedSearchTerm]);

  return {
    searchTerm,
    debouncedSearchTerm,
    isSearching,
    updateSearchTerm,
    setSearchTerm: updateSearchTerm
  };
}

// Custom hook for managing URL search params
export function useSearchParams() {
  const [params, setParams] = useState({});

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const paramsObject = {};
      for (const [key, value] of urlParams.entries()) {
        paramsObject[key] = value;
      }
      setParams(paramsObject);
    }
  }, []);

  const updateParam = useCallback((key, value) => {
    const newParams = { ...params, [key]: value };
    if (!value) {
      delete newParams[key];
    }
    setParams(newParams);

    // Update URL without page reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      if (value) {
        url.searchParams.set(key, value);
      } else {
        url.searchParams.delete(key);
      }
      window.history.replaceState({}, '', url);
    }
  }, [params]);

  const updateParams = useCallback((newParams) => {
    const mergedParams = { ...params, ...newParams };
    // Remove empty values
    Object.keys(mergedParams).forEach(key => {
      if (!mergedParams[key]) {
        delete mergedParams[key];
      }
    });
    
    setParams(mergedParams);

    // Update URL without page reload
    if (typeof window !== 'undefined') {
      const url = new URL(window.location);
      url.search = '';
      Object.entries(mergedParams).forEach(([key, value]) => {
        if (value) {
          url.searchParams.set(key, value);
        }
      });
      window.history.replaceState({}, '', url);
    }
  }, [params]);

  return {
    params,
    updateParam,
    updateParams
  };
}
