// Performance optimization utilities for faster loading
import React, { useCallback, useMemo, useRef, useEffect, useState } from 'react';

// Optimized debounce hook for better performance
export const useDebounce = (callback, delay) => {
  const timeoutRef = useRef(null);
  
  return useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  }, [callback, delay]);
};

// Optimized throttle hook for better performance
export const useThrottle = (callback, delay) => {
  const lastCallRef = useRef(0);
  
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCallRef.current >= delay) {
      lastCallRef.current = now;
      callback(...args);
    }
  }, [callback, delay]);
};

// Fast memoization with shallow comparison
export const useFastMemo = (factory, deps) => {
  return useMemo(factory, deps);
};

// Optimized API request hook with caching
export const useFastAPI = (url, options = {}) => {
  const cacheRef = useRef(new Map());
  const abortControllerRef = useRef(null);
  
  const fetchData = useCallback(async () => {
    // Check cache first
    const cacheKey = `${url}-${JSON.stringify(options)}`;
    if (cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }
    
    // Cancel previous request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    abortControllerRef.current = new AbortController();
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: abortControllerRef.current.signal,
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      // Cache the result for 5 minutes
      cacheRef.current.set(cacheKey, data);
      setTimeout(() => {
        cacheRef.current.delete(cacheKey);
      }, 5 * 60 * 1000);
      
      return data;
    } catch (error) {
      if (error.name !== 'AbortError') {
        throw error;
      }
    }
  }, [url, options]);
  
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);
  
  return fetchData;
};

// Component lazy loading utility
export const createLazyComponent = (importFunc) => {
  const LazyComponent = React.lazy(importFunc);
  
  return React.memo(React.forwardRef((props, ref) => (
    <React.Suspense fallback={<div className="animate-pulse bg-gray-200 rounded h-32"></div>}>
      <LazyComponent {...props} ref={ref} />
    </React.Suspense>
  )));
};

// Image optimization hook
export const useOptimizedImage = (src, options = {}) => {
  const {
    width = 800,
    height = 600,
    quality = 75,
    format = 'webp'
  } = options;
  
  return useMemo(() => {
    if (!src) return '';
    
    // For Next.js Image component optimization
    const params = new URLSearchParams({
      url: src,
      w: width.toString(),
      h: height.toString(),
      q: quality.toString(),
      f: format
    });
    
    return `/_next/image?${params.toString()}`;
  }, [src, width, height, quality, format]);
};

// Performance monitoring
export const measurePerformance = (name, fn) => {
  return async (...args) => {
    const start = performance.now();
    try {
      const result = await fn(...args);
      const duration = performance.now() - start;
      console.log(`⚡ ${name} completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(`❌ ${name} failed after ${duration.toFixed(2)}ms:`, error);
      throw error;
    }
  };
};

// Critical CSS injection
export const injectCriticalCSS = (css) => {
  if (typeof window !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);
  }
};

// Preload critical resources
export const preloadResource = (href, type = 'script') => {
  if (typeof window !== 'undefined') {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.href = href;
    link.as = type;
    document.head.appendChild(link);
  }
};

// Fast state management for simple states
export class FastState {
  constructor(initialValue) {
    this.value = initialValue;
    this.listeners = new Set();
  }
  
  get() {
    return this.value;
  }
  
  set(newValue) {
    this.value = newValue;
    this.listeners.forEach(listener => listener(newValue));
  }
  
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }
}

// React hook for FastState
export const useFastState = (fastState) => {
  const [value, setValue] = useState(fastState.get());
  
  useEffect(() => {
    const unsubscribe = fastState.subscribe(setValue);
    return unsubscribe;
  }, [fastState]);
  
  const setFastState = useCallback((newValue) => {
    fastState.set(newValue);
  }, [fastState]);
  
  return [value, setFastState];
};
