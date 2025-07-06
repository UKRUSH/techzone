"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect, memo } from "react";
import { GlobalLoader } from "@/components/ui/loading";

// Fast navigation wrapper with instant loading states
export const FastLink = memo(function FastLink({ 
  href, 
  children, 
  className, 
  showLoader = true,
  prefetch = true,
  ...props 
}) {
  const router = useRouter();
  const [isNavigating, setIsNavigating] = useState(false);

  const handleClick = async (e) => {
    if (showLoader) {
      setIsNavigating(true);
      
      // Start navigation immediately
      router.push(href);
      
      // Reset loading state after a short delay
      setTimeout(() => setIsNavigating(false), 500);
    }
  };

  return (
    <>
      <Link 
        href={href} 
        className={className} 
        prefetch={prefetch}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
      
      {isNavigating && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-center justify-center">
          <div className="bg-black/90 border border-yellow-400/30 rounded-xl p-6 flex items-center gap-3">
            <GlobalLoader isLoading={true} variant="dots" />
            <span className="text-yellow-400 font-medium">Loading...</span>
          </div>
        </div>
      )}
    </>
  );
});

// Navigation progress bar
export const NavigationProgress = memo(function NavigationProgress() {
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let interval;
    
    if (isLoading) {
      interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 100);
    } else {
      setProgress(100);
      setTimeout(() => setProgress(0), 500);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isLoading]);

  // Listen to route changes
  useEffect(() => {
    const handleStart = () => {
      setIsLoading(true);
      setProgress(0);
    };
    
    const handleComplete = () => {
      setProgress(100);
      setTimeout(() => {
        setIsLoading(false);
      }, 300);
    };

    // Listen to route change events if using app router
    const handleRouteChange = () => {
      handleStart();
      // Simulate loading completion after a delay
      setTimeout(handleComplete, 1000);
    };

    return () => {
      // Cleanup listeners
    };
  }, []);

  if (!isLoading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-1 bg-black/20">
      <div 
        className="h-full bg-gradient-to-r from-yellow-400 to-yellow-300 transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
});

// Route prefetcher for faster navigation
export const RoutePrefetcher = memo(function RoutePrefetcher() {
  useEffect(() => {
    // Prefetch critical routes after initial load
    const prefetchRoutes = [
      '/products',
      '/categories',
      '/deals',
      '/pc-builder',
      '/cart'
    ];

    const prefetchWithDelay = (route, delay) => {
      setTimeout(() => {
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = route;
        document.head.appendChild(link);
      }, delay);
    };

    // Stagger prefetching to avoid overwhelming the browser
    prefetchRoutes.forEach((route, index) => {
      prefetchWithDelay(route, index * 500);
    });
  }, []);

  return null;
});
